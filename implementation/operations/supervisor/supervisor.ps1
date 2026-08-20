<#
.SYNOPSIS
    PCI Execution Supervisor -- fail-closed scheduler for the Claude Code task queue.

.DESCRIPTION
    Runs on the Windows development machine. Periodically reconciles with origin/main,
    reads implementation/operations/CLAUDE-TASKS.md, and starts an authorized Claude
    runner only when a READY task exists and no runner is active.

    The supervisor is a TRIGGER, not an authority. It never decides what work is
    allowed, never edits the queue, never marks anything COMPLETE, and never touches
    the PCI server. The repository queue remains the sole authority.

    FAIL-CLOSED: every uncertainty results in doing nothing. Unreadable repository,
    unreachable remote, contradictory queue, existing lock, or any unhandled error
    all produce a no-op, logged and heartbeated.

.NOTES
    Windows PowerShell 5.1 compatible. No ternary, no null-coalescing, no -AsHashtable.
    Dot-sourceable for tests: functions load without executing Main.
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [switch]$Once,
    [switch]$Install,
    [switch]$Uninstall
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

$script:VALID_STATUSES = @(
    'READY', 'IN_PROGRESS', 'COMPLETE', 'BLOCKED',
    'WAITING_FOR_ARCHITECTURE_LEAD', 'WAITING_FOR_OPERATOR', 'ABORTED'
)

# --------------------------------------------------------------------------- config

function Get-SupervisorConfig {
    param([string]$Path)

    # Defaults are deliberately inert: disabled, dry-run, nothing starts.
    $config = [ordered]@{
        enabled            = $false
        dryRun             = $true
        repositoryPath     = ''
        queueRelativePath  = 'implementation/operations/CLAUDE-TASKS.md'
        remote             = 'origin'
        branch             = 'main'
        intervalMinutes    = 10
        staleRunMinutes    = 120
        lockTimeoutMinutes = 240
        runnerCommand      = ''
        runnerArguments    = @()
        statePath          = 'state'
        logPath            = 'logs'
    }

    if ([string]::IsNullOrWhiteSpace($Path)) { return [pscustomobject]$config }
    if (-not (Test-Path -LiteralPath $Path)) { throw "config not found: $Path" }

    $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $parsed = $raw | ConvertFrom-Json

    foreach ($key in @($config.Keys)) {
        if ($parsed.PSObject.Properties.Name -contains $key) {
            $config[$key] = $parsed.$key
        }
    }
    return [pscustomobject]$config
}

# --------------------------------------------------------------------------- logging

function Write-SupervisorLog {
    param(
        [Parameter(Mandatory)][ValidateSet('INFO', 'WARN', 'ERROR', 'NOOP', 'ACTION')][string]$Level,
        [Parameter(Mandatory)][string]$Event,
        [string]$Detail = '',
        [string]$LogDirectory
    )

    $stamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $line = '{0} [{1}] {2}{3}' -f $stamp, $Level, $Event, $(if ($Detail) { " :: $Detail" } else { '' })

    Write-Verbose $line
    if ([string]::IsNullOrWhiteSpace($LogDirectory)) { return $line }

    if (-not (Test-Path -LiteralPath $LogDirectory)) {
        New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
    }
    $file = Join-Path $LogDirectory ('supervisor-{0}.log' -f (Get-Date).ToUniversalTime().ToString('yyyyMMdd'))
    Add-Content -LiteralPath $file -Value $line -Encoding utf8
    return $line
}

function Write-SupervisorHeartbeat {
    param(
        [Parameter(Mandatory)][string]$StateDirectory,
        [Parameter(Mandatory)][string]$Decision,
        [string]$Reason = '',
        $ReadyTask = $null,
        [string]$Head = '',
        [bool]$RunnerActive = $false
    )

    if (-not (Test-Path -LiteralPath $StateDirectory)) {
        New-Item -ItemType Directory -Path $StateDirectory -Force | Out-Null
    }

    $taskId = ''
    if ($null -ne $ReadyTask) { $taskId = $ReadyTask.Id }

    $beat = [ordered]@{
        timestamp    = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        decision     = $Decision      # STARTED | NOOP | BLOCKED | ERROR | DRY_RUN
        reason       = $Reason
        readyTask    = $taskId
        head         = $Head
        runnerActive = $RunnerActive
        supervisorPid = $PID
        host         = $env:COMPUTERNAME
    }

    $path = Join-Path $StateDirectory 'heartbeat.json'
    ($beat | ConvertTo-Json -Depth 4) | Out-File -LiteralPath $path -Encoding utf8 -Force
    return [pscustomobject]$beat
}

# --------------------------------------------------------------------------- queue parsing

function ConvertFrom-QueueMarkdown {
    <#
        Parses the status board and per-task priorities out of CLAUDE-TASKS.md.
        Returns an array of task objects. Parsing is deliberately strict: anything
        it cannot understand is reported rather than guessed at.
    #>
    param([Parameter(Mandatory)][string]$Markdown)

    $tasks = @()
    $lines = $Markdown -split "`r?`n"

    foreach ($line in $lines) {
        if ($line -notmatch '^\s*\|\s*\*{0,2}(TASK-\d{4})\*{0,2}\s*\|') { continue }

        $cells = @()
        foreach ($cell in ($line.Trim().Trim('|') -split '\|')) {
            $cells += ($cell -replace '\*', '').Trim()
        }
        if ($cells.Count -lt 3) { continue }

        $id = $cells[0]
        if ($tasks | Where-Object { $_.Id -eq $id }) { continue }  # board row wins; ignore later repeats

        $statusCell = $cells[2]
        $status = $null
        foreach ($candidate in $script:VALID_STATUSES) {
            if ($statusCell -match ('\b' + [regex]::Escape($candidate) + '\b')) {
                # Longest match wins so READY does not shadow WAITING_FOR_...
                if ($null -eq $status -or $candidate.Length -gt $status.Length) { $status = $candidate }
            }
        }

        $dependsRaw = ''
        if ($cells.Count -ge 4) { $dependsRaw = $cells[3] }
        $depends = @()
        foreach ($m in ([regex]::Matches($dependsRaw, 'TASK-\d{4}'))) { $depends += $m.Value }

        $priority = 9999
        if ($Markdown -match ('(?ms)^##\s+' + [regex]::Escape($id) + '\b.*?^\*\*Priority:\*\*\s*(\d+)')) {
            $priority = [int]$Matches[1]
        }

        $tasks += [pscustomobject]@{
            Id       = $id
            Title    = $cells[1]
            Status   = $status
            RawStatus = $statusCell
            Depends  = $depends
            Priority = $priority
        }
    }

    return , $tasks
}

function Test-QueueConsistency {
    <#
        Fail-closed queue validation. Returns an object with IsConsistent and Problems.
        Any problem means the supervisor does nothing at all this cycle.
    #>
    param([Parameter(Mandatory)][AllowEmptyCollection()][array]$Tasks)

    $problems = @()

    if ($Tasks.Count -eq 0) { $problems += 'queue contains no recognisable tasks' }

    $ids = @($Tasks | ForEach-Object { $_.Id })
    $dupes = @($ids | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name })
    foreach ($d in $dupes) { $problems += "duplicate task id: $d" }

    foreach ($t in $Tasks) {
        if ($null -eq $t.Status) {
            $problems += ('{0} has an unrecognised status: "{1}"' -f $t.Id, $t.RawStatus)
        }
    }

    $inProgress = @($Tasks | Where-Object { $_.Status -eq 'IN_PROGRESS' })
    if ($inProgress.Count -gt 1) {
        $problems += ('more than one task IN_PROGRESS: {0}' -f (($inProgress | ForEach-Object { $_.Id }) -join ', '))
    }

    # A READY task whose dependencies are not COMPLETE is a contradiction, not an invitation.
    foreach ($t in @($Tasks | Where-Object { $_.Status -eq 'READY' })) {
        foreach ($dep in $t.Depends) {
            $depTask = $Tasks | Where-Object { $_.Id -eq $dep } | Select-Object -First 1
            if ($null -eq $depTask) {
                $problems += ('{0} depends on unknown task {1}' -f $t.Id, $dep)
            }
            elseif ($depTask.Status -ne 'COMPLETE') {
                $problems += ('{0} is READY but dependency {1} is {2}' -f $t.Id, $dep, $depTask.Status)
            }
        }
    }

    return [pscustomobject]@{
        IsConsistent = ($problems.Count -eq 0)
        Problems     = $problems
    }
}

function Get-HighestPriorityReadyTask {
    param([Parameter(Mandatory)][AllowEmptyCollection()][array]$Tasks)

    $ready = @($Tasks | Where-Object { $_.Status -eq 'READY' })
    if ($ready.Count -eq 0) { return $null }
    return ($ready | Sort-Object Priority, Id | Select-Object -First 1)
}

# --------------------------------------------------------------------------- locking

function Get-RunnerLock {
    param([Parameter(Mandatory)][string]$StateDirectory)

    $path = Join-Path $StateDirectory 'runner.lock'
    if (-not (Test-Path -LiteralPath $path)) { return $null }

    try {
        $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
        return ($raw | ConvertFrom-Json)
    }
    catch {
        # An unreadable lock is treated as HELD. Fail closed: never assume it is free.
        return [pscustomobject]@{
            taskId    = 'UNKNOWN'
            pid       = 0
            acquired  = '1970-01-01T00:00:00Z'
            unreadable = $true
        }
    }
}

function Test-RunnerActive {
    <#
        A runner is active if a lock exists AND (its process is alive OR the lock is
        unreadable). An expired lock whose process is gone is reported as stale rather
        than free, so a human sees it -- the supervisor still does not start anything.
    #>
    param(
        [Parameter(Mandatory)][string]$StateDirectory,
        [int]$LockTimeoutMinutes = 240
    )

    $lock = Get-RunnerLock -StateDirectory $StateDirectory
    if ($null -eq $lock) {
        return [pscustomobject]@{ Active = $false; Stale = $false; Lock = $null; Reason = 'no lock' }
    }

    $unreadable = $false
    if ($lock.PSObject.Properties.Name -contains 'unreadable') { $unreadable = [bool]$lock.unreadable }
    if ($unreadable) {
        return [pscustomobject]@{ Active = $true; Stale = $false; Lock = $lock; Reason = 'lock unreadable -- treated as held' }
    }

    $alive = $false
    if ($lock.PSObject.Properties.Name -contains 'pid' -and $lock.pid -gt 0) {
        $proc = Get-Process -Id $lock.pid -ErrorAction SilentlyContinue
        if ($null -ne $proc) { $alive = $true }
    }

    $age = $null
    try { $age = ((Get-Date).ToUniversalTime() - ([datetime]$lock.acquired).ToUniversalTime()).TotalMinutes } catch { $age = $null }

    if ($alive) {
        return [pscustomobject]@{ Active = $true; Stale = $false; Lock = $lock; Reason = 'runner process alive' }
    }

    if ($null -ne $age -and $age -gt $LockTimeoutMinutes) {
        return [pscustomobject]@{ Active = $true; Stale = $true; Lock = $lock; Reason = ('stale lock, {0:N0} min old, process gone' -f $age) }
    }

    return [pscustomobject]@{ Active = $true; Stale = $true; Lock = $lock; Reason = 'lock present but process gone' }
}

function New-RunnerLock {
    param(
        [Parameter(Mandatory)][string]$StateDirectory,
        [Parameter(Mandatory)][string]$TaskId,
        [int]$RunnerPid = $PID
    )

    if (-not (Test-Path -LiteralPath $StateDirectory)) {
        New-Item -ItemType Directory -Path $StateDirectory -Force | Out-Null
    }
    $path = Join-Path $StateDirectory 'runner.lock'

    # Exclusive create: if another supervisor won the race, this throws and we do nothing.
    $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
    try {
        $payload = [ordered]@{
            taskId   = $TaskId
            pid      = $RunnerPid
            acquired = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
            host     = $env:COMPUTERNAME
        }
        $bytes = [System.Text.Encoding]::UTF8.GetBytes(($payload | ConvertTo-Json -Depth 3))
        $stream.Write($bytes, 0, $bytes.Length)
    }
    finally { $stream.Close() }

    return $path
}

function Update-RunnerLockPid {
    <#
        Repoint an existing lock at the runner process.

        The lock must be created BEFORE the runner starts, or two supervisors could both decide to
        start one. But it is necessarily created with the supervisor's own PID, and the supervisor
        is a short-lived `-Once` process. Left that way, every completed run would leave a lock
        whose PID is already dead -- which Test-RunnerActive correctly reports as stale, and which
        the policy says never to clear automatically. The supervisor would stall permanently after
        its first task.
    #>
    param(
        [Parameter(Mandatory)][string]$StateDirectory,
        [Parameter(Mandatory)][int]$RunnerPid
    )

    $path = Join-Path $StateDirectory 'runner.lock'
    if (-not (Test-Path -LiteralPath $path)) { return $null }

    $lock = Get-RunnerLock -StateDirectory $StateDirectory
    if ($null -eq $lock) { return $null }

    $payload = [ordered]@{
        taskId   = $lock.taskId
        pid      = $RunnerPid
        acquired = $lock.acquired
        host     = $env:COMPUTERNAME
    }
    ($payload | ConvertTo-Json -Depth 3) | Out-File -LiteralPath $path -Encoding utf8 -Force
    return $path
}

function Remove-RunnerLock {
    param([Parameter(Mandatory)][string]$StateDirectory)
    $path = Join-Path $StateDirectory 'runner.lock'
    if (Test-Path -LiteralPath $path) { Remove-Item -LiteralPath $path -Force }
}

# --------------------------------------------------------------------------- runner args

function ConvertTo-RunnerCommandLine {
    <#
        Build a single, correctly quoted command line from an argument array.

        Start-Process -ArgumentList <array> in Windows PowerShell 5.1 joins the elements with
        spaces and does NOT quote them, so an argument containing whitespace -- a runner prompt,
        for instance -- would arrive at the runner split into several arguments. That silently
        changes what the unattended session is asked to do, which is exactly the class of failure
        this repository keeps finding: a command that appears to work while doing something else.
    #>
    param([Parameter(Mandatory)][AllowEmptyCollection()][string[]]$Arguments)

    $parts = @()
    foreach ($a in $Arguments) {
        if ($a -match '[\s"]') {
            $parts += '"' + ($a -replace '(\\*)"', '$1$1\"' -replace '(\\+)$', '$1$1') + '"'
        }
        else {
            $parts += $a
        }
    }
    return ($parts -join ' ')
}

function Start-RunnerProcess {
    <#
        Launch the runner, capture both streams to files, and return a RELIABLE exit code.

        Start-Process -PassThru does not surface ExitCode in this environment -- verified against
        `cmd /c exit 3`, which reported an empty ExitCode even after WaitForExit and Refresh. Code
        branching on that would have reported every successful run as a failure. System.Diagnostics
        .Process reports 0 and 3 correctly, so the runner is launched through it directly.

        Both streams are read asynchronously before WaitForExit: reading one to completion first
        can deadlock if the other fills its buffer.
    #>
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][AllowEmptyString()][string]$CommandLine,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [Parameter(Mandatory)][string]$StdOutPath,
        [Parameter(Mandatory)][string]$StdErrPath,
        [scriptblock]$OnStarted
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName               = $FilePath
    $psi.Arguments              = $CommandLine
    $psi.WorkingDirectory       = $WorkingDirectory
    $psi.UseShellExecute        = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError  = $true
    $psi.CreateNoWindow         = $true

    $proc = [System.Diagnostics.Process]::Start($psi)

    if ($null -ne $OnStarted) { & $OnStarted $proc.Id }

    $outTask = $proc.StandardOutput.ReadToEndAsync()
    $errTask = $proc.StandardError.ReadToEndAsync()
    $proc.WaitForExit()

    $out = $outTask.Result
    $err = $errTask.Result

    $dir = Split-Path -Parent $StdOutPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $out | Out-File -LiteralPath $StdOutPath -Encoding utf8 -Force
    $err | Out-File -LiteralPath $StdErrPath -Encoding utf8 -Force

    return [pscustomobject]@{
        ExitCode = $proc.ExitCode
        Pid      = $proc.Id
        StdOut   = $out
        StdErr   = $err
    }
}

# --------------------------------------------------------------------------- git

function Test-RepositoryReconciled {
    <#
        Returns reconciliation facts. Never modifies the working tree; fetch only.
        A failure to reach the remote is NOT an error condition -- it is a reason to
        do nothing this cycle, which is the whole point of the 10-minute fallback.
    #>
    param([Parameter(Mandatory)][string]$RepositoryPath, [string]$Remote = 'origin', [string]$Branch = 'main')

    $result = [ordered]@{
        Readable       = $false
        Reconciled     = $false
        Head           = ''
        Remote         = ''
        Clean          = $false
        FastForwarded  = $false
        Reason         = ''
    }

    if (-not (Test-Path -LiteralPath (Join-Path $RepositoryPath '.git'))) {
        $result.Reason = 'not a git repository'
        return [pscustomobject]$result
    }

    Push-Location $RepositoryPath
    try {
        $head = (& git rev-parse HEAD 2>$null)
        if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($head)) {
            $result.Reason = 'cannot read HEAD'
            return [pscustomobject]$result
        }
        $result.Readable = $true
        $result.Head = $head.Trim()

        $status = (& git status --porcelain 2>$null)
        $result.Clean = [string]::IsNullOrWhiteSpace(($status -join ''))

        & git fetch --quiet $Remote 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            $result.Reason = 'remote unreachable -- no action this cycle'
            return [pscustomobject]$result
        }

        $remoteHead = (& git rev-parse "$Remote/$Branch" 2>$null)
        if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($remoteHead)) {
            $result.Reason = 'cannot read remote ref'
            return [pscustomobject]$result
        }
        $result.Remote = $remoteHead.Trim()
        $result.Reconciled = ($result.Head -eq $result.Remote)

        if (-not $result.Reconciled) {
            # Distinguish the three ways local and remote can differ. Only one of them is safe to
            # resolve automatically, and lumping them together is what stalled the supervisor: every
            # push by the architecture lead left it refusing forever, because nothing ever pulled.
            $behind = 0
            $ahead  = 0
            $counts = (& git rev-list --left-right --count "$Remote/$Branch...HEAD" 2>$null)
            if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($counts)) {
                $parts = ($counts -split '\s+') | Where-Object { $_ -ne '' }
                if ($parts.Count -ge 2) { $behind = [int]$parts[0]; $ahead = [int]$parts[1] }
            }

            if ($ahead -gt 0) {
                # Local commits not on the remote. Never resolved automatically: deciding what to do
                # with unpushed work is not a scheduler's business.
                $result.Reason = ('local is ahead by {0} (and behind by {1})' -f $ahead, $behind)
            }
            elseif ($behind -le 0) {
                $result.Reason = 'local and remote differ, but neither is ahead - unexpected'
            }
            elseif (-not $result.Clean) {
                # A fast-forward would silently overwrite nothing, but an unclean tree means someone
                # or something is mid-change. Refuse and let a human look.
                $result.Reason = ('local is behind by {0} but the working tree is dirty' -f $behind)
            }
            else {
                # Strictly behind, clean tree: a fast-forward is the whole of "reconcile". It cannot
                # lose work, cannot merge, and cannot rewrite history.
                & git merge --ff-only "$Remote/$Branch" --quiet 2>$null | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    $newHead = (& git rev-parse HEAD 2>$null)
                    $result.Head = $newHead.Trim()
                    $result.Reconciled = ($result.Head -eq $result.Remote)
                    $result.FastForwarded = $result.Reconciled
                    if (-not $result.Reconciled) { $result.Reason = 'fast-forward did not reach the remote head' }
                }
                else {
                    $result.Reason = ('fast-forward failed while {0} behind' -f $behind)
                }
            }
        }
    }
    finally { Pop-Location }

    return [pscustomobject]$result
}

# --------------------------------------------------------------------------- decision

function Invoke-SupervisorCycle {
    <#
        One reconciliation cycle. Returns the decision object; performs no work beyond
        logging, heartbeating, and (when enabled and not dry-run) starting the runner.
    #>
    param([Parameter(Mandatory)][pscustomobject]$Config)

    $repo = $Config.repositoryPath
    $stateDir = Join-Path $repo (Join-Path 'implementation/operations/supervisor' $Config.statePath)
    $logDir = Join-Path $repo (Join-Path 'implementation/operations/supervisor' $Config.logPath)

    function Complete-Cycle {
        param($Decision, $Reason, $Task, $Head, $RunnerActive)
        Write-SupervisorLog -Level $(if ($Decision -eq 'STARTED') { 'ACTION' } elseif ($Decision -eq 'ERROR') { 'ERROR' } else { 'NOOP' }) `
            -Event $Decision -Detail $Reason -LogDirectory $logDir | Out-Null
        Write-SupervisorHeartbeat -StateDirectory $stateDir -Decision $Decision -Reason $Reason `
            -ReadyTask $Task -Head $Head -RunnerActive $RunnerActive | Out-Null
        return [pscustomobject]@{ Decision = $Decision; Reason = $Reason; Task = $Task }
    }

    try {
        # Every invocation announces itself before doing anything, so a cycle that dies early still
        # leaves a trace. An operator watching a console flash past needs the file to say what
        # happened; "nothing in the log" and "the script never ran" must not look identical.
        Write-SupervisorLog -Level 'INFO' -Event 'CYCLE_START' `
            -Detail ('pid=' + $PID + ' repo=' + $repo + ' enabled=' + $Config.enabled + ' dryRun=' + $Config.dryRun) `
            -LogDirectory $logDir | Out-Null

        # 1. Repository must be readable and reconciled with the remote.
        $git = Test-RepositoryReconciled -RepositoryPath $repo -Remote $Config.remote -Branch $Config.branch
        if ($git.FastForwarded) {
            Write-SupervisorLog -Level 'ACTION' -Event 'FAST_FORWARDED' `
                -Detail ('local was behind; fast-forwarded to ' + $git.Head) -LogDirectory $logDir | Out-Null
        }
        if (-not $git.Readable) { return Complete-Cycle 'NOOP' ('repository unreadable: ' + $git.Reason) $null '' $false }
        if (-not $git.Reconciled) { return Complete-Cycle 'NOOP' ('not reconciled: ' + $git.Reason) $null $git.Head $false }

        # 2. Queue must parse and be internally consistent.
        $queuePath = Join-Path $repo $Config.queueRelativePath
        if (-not (Test-Path -LiteralPath $queuePath)) { return Complete-Cycle 'NOOP' 'queue file missing' $null $git.Head $false }

        $tasks = ConvertFrom-QueueMarkdown -Markdown (Get-Content -LiteralPath $queuePath -Raw -Encoding UTF8)
        $consistency = Test-QueueConsistency -Tasks $tasks
        if (-not $consistency.IsConsistent) {
            return Complete-Cycle 'BLOCKED' ('queue inconsistent: ' + ($consistency.Problems -join '; ')) $null $git.Head $false
        }

        # 3. A READY task must exist.
        $ready = Get-HighestPriorityReadyTask -Tasks $tasks
        if ($null -eq $ready) { return Complete-Cycle 'NOOP' 'no READY task' $null $git.Head $false }

        # 4. No runner may already be active.
        $runner = Test-RunnerActive -StateDirectory $stateDir -LockTimeoutMinutes $Config.lockTimeoutMinutes
        if ($runner.Active) {
            $decision = 'NOOP'
            if ($runner.Stale) { $decision = 'BLOCKED' }
            return Complete-Cycle $decision ('runner active: ' + $runner.Reason) $ready $git.Head $true
        }

        # 5. Start -- unless disabled or dry-run.
        if (-not $Config.enabled) { return Complete-Cycle 'DRY_RUN' ('would start ' + $ready.Id + ' (supervisor disabled)') $ready $git.Head $false }
        if ($Config.dryRun) { return Complete-Cycle 'DRY_RUN' ('would start ' + $ready.Id + ' (dryRun)') $ready $git.Head $false }
        if ([string]::IsNullOrWhiteSpace($Config.runnerCommand)) { return Complete-Cycle 'NOOP' 'no runnerCommand configured' $ready $git.Head $false }

        $lockPath = $null
        try { $lockPath = New-RunnerLock -StateDirectory $stateDir -TaskId $ready.Id }
        catch { return Complete-Cycle 'NOOP' 'lost the lock race -- another supervisor won' $ready $git.Head $true }

        try {
            $args = @()
            foreach ($a in $Config.runnerArguments) { $args += ($a -replace '\{TASK_ID\}', $ready.Id) }
            $commandLine = ConvertTo-RunnerCommandLine -Arguments $args

            # Persist the runner's output. Without this the runner writes to a console that closes
            # with the scheduled task, so a failure leaves no trace anywhere -- which is exactly how
            # the first live start presented: a window appearing and vanishing with nothing to read.
            $stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss')
            $runOut = Join-Path $logDir ('runner-{0}-{1}.out.log' -f $ready.Id, $stamp)
            $runErr = Join-Path $logDir ('runner-{0}-{1}.err.log' -f $ready.Id, $stamp)

            # Record the EXACT command before launching, so a failure to launch is still diagnosable.
            Write-SupervisorLog -Level 'ACTION' -Event 'RUNNER_COMMAND' `
                -Detail ($Config.runnerCommand + ' ' + $commandLine) -LogDirectory $logDir | Out-Null

            $result = Start-RunnerProcess -FilePath $Config.runnerCommand -CommandLine $commandLine `
                -WorkingDirectory $repo -StdOutPath $runOut -StdErrPath $runErr `
                -OnStarted {
                    param($runnerPid)
                    # The lock was created with the supervisor's PID, but the supervisor is a
                    # short-lived `-Once` process. Point it at the runner instead, or every
                    # completed run would leave a lock whose PID is already dead -- read as
                    # "stale", which blocks every subsequent cycle forever.
                    Update-RunnerLockPid -StateDirectory $stateDir -RunnerPid $runnerPid | Out-Null
                    Write-SupervisorLog -Level 'ACTION' -Event 'RUNNER_STARTED' `
                        -Detail ('pid=' + $runnerPid + ' task=' + $ready.Id) -LogDirectory $logDir | Out-Null
                }

            $code = $result.ExitCode
            Remove-RunnerLock -StateDirectory $stateDir

            $outSize = 0
            if (Test-Path -LiteralPath $runOut) { $outSize = (Get-Item -LiteralPath $runOut).Length }
            $detail = ('{0} exited {1}; stdout {2} bytes -> {3}' -f $ready.Id, $code, $outSize, (Split-Path -Leaf $runOut))

            if ($code -eq 0) { return Complete-Cycle 'STARTED' ('runner completed: ' + $detail) $ready $git.Head $false }
            return Complete-Cycle 'ERROR' ('runner failed: ' + $detail) $ready $git.Head $false
        }
        catch {
            Remove-RunnerLock -StateDirectory $stateDir
            return Complete-Cycle 'ERROR' ('runner failed to start: ' + $_.Exception.Message) $ready $git.Head $false
        }
    }
    catch {
        # Fail closed on anything unforeseen.
        try { return Complete-Cycle 'ERROR' ('unhandled: ' + $_.Exception.Message) $null '' $false }
        catch { return [pscustomobject]@{ Decision = 'ERROR'; Reason = $_.Exception.Message; Task = $null } }
    }
}

# --------------------------------------------------------------------------- install

function Install-SupervisorTask {
    param([Parameter(Mandatory)][pscustomobject]$Config, [string]$ScriptPath, [string]$ConfigPath)

    $taskName = 'PCI-Execution-Supervisor'
    $action = New-ScheduledTaskAction -Execute 'powershell.exe' `
        -Argument ('-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" -Once -ConfigPath "{1}"' -f $ScriptPath, $ConfigPath)
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
        -RepetitionInterval (New-TimeSpan -Minutes $Config.intervalMinutes)
    $settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable `
        -DontStopOnIdleEnd -ExecutionTimeLimit (New-TimeSpan -Hours 1)

    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
    return $taskName
}

function Uninstall-SupervisorTask {
    $taskName = 'PCI-Execution-Supervisor'
    $existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($null -ne $existing) { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false }
    return $taskName
}

# --------------------------------------------------------------------------- main

function Invoke-SupervisorMain {
    param([string]$ConfigPath, [switch]$Once, [switch]$Install, [switch]$Uninstall)

    $here = Split-Path -Parent $PSCommandPath
    if ([string]::IsNullOrWhiteSpace($ConfigPath)) { $ConfigPath = Join-Path $here 'supervisor-config.json' }

    if ($Uninstall) { $n = Uninstall-SupervisorTask; Write-Output "unregistered scheduled task: $n"; return }

    if (-not (Test-Path -LiteralPath $ConfigPath)) {
        Write-Output "No config at $ConfigPath. Copy supervisor-config.example.json and edit it."
        Write-Output "The supervisor does nothing without a config -- this is intentional."
        return
    }

    $config = Get-SupervisorConfig -Path $ConfigPath
    if ([string]::IsNullOrWhiteSpace($config.repositoryPath)) {
        $config.repositoryPath = (Resolve-Path (Join-Path $here '..\..\..')).Path
    }

    if ($Install) { $n = Install-SupervisorTask -Config $config -ScriptPath $PSCommandPath -ConfigPath $ConfigPath; Write-Output "registered scheduled task: $n"; return }

    $result = Invoke-SupervisorCycle -Config $config
    Write-Output ('{0}: {1}' -f $result.Decision, $result.Reason)
}

# Dot-sourcing (for tests) loads the functions without running anything.
if ($MyInvocation.InvocationName -ne '.') {
    Invoke-SupervisorMain -ConfigPath $ConfigPath -Once:$Once -Install:$Install -Uninstall:$Uninstall
}
