<#
    Supervisor tests. Self-contained: no Pester required, so they run anywhere
    Windows PowerShell 5.1 runs.

        powershell -NoProfile -ExecutionPolicy Bypass -File tests\supervisor.tests.ps1

    Exit code 0 = all passed, 1 = at least one failed.

    These tests exercise decision logic only. They never start a runner, never
    touch git remotes, and never contact the PCI server. Fixtures live in a temp
    directory on the development machine and are removed afterwards.
#>
[CmdletBinding()]
param()

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

. (Join-Path (Split-Path -Parent (Split-Path -Parent $PSCommandPath)) 'supervisor.ps1')

$script:Passed = 0
$script:Failed = 0

function Test-Case {
    param([string]$Name, [scriptblock]$Body)
    try {
        & $Body
        $script:Passed++
        Write-Host ("  PASS  " + $Name) -ForegroundColor Green
    }
    catch {
        $script:Failed++
        Write-Host ("  FAIL  " + $Name) -ForegroundColor Red
        Write-Host ("        " + $_.Exception.Message) -ForegroundColor Red
    }
}

function Assert-Equal {
    param($Expected, $Actual, [string]$Because = '')
    if ($Expected -ne $Actual) {
        throw ("expected [{0}] but got [{1}] {2}" -f $Expected, $Actual, $Because)
    }
}

function Assert-True {
    param($Condition, [string]$Because = '')
    if (-not $Condition) { throw ("expected true: {0}" -f $Because) }
}

function New-TempDir {
    $p = Join-Path ([System.IO.Path]::GetTempPath()) ('pci-sup-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
    New-Item -ItemType Directory -Path $p -Force | Out-Null
    return $p
}

# ---------------------------------------------------------------- fixtures

$QUEUE_WITH_READY = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | first | **COMPLETE** | -- | 2026-08-19 | none | Claude Code |
| TASK-0004 | second | **READY** | TASK-0001 | -- | run it | Claude Code |
| TASK-0006 | third | **BLOCKED** | TASK-0004 | -- | wait | Claude Code |

## TASK-0004 -- second

**Priority:** 2 | **Status:** READY

## TASK-0006 -- third

**Priority:** 3 | **Status:** BLOCKED
'@

$QUEUE_NO_READY = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | first | **COMPLETE** | -- | 2026-08-19 | none | Claude Code |
| TASK-0004 | second | **WAITING_FOR_ARCHITECTURE_LEAD** | TASK-0001 | -- | authorize | Architecture lead |
| TASK-0009 | ninth | **WAITING_FOR_OPERATOR** | -- | -- | operator | Operator |
'@

$QUEUE_TWO_READY = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0001 | first | **COMPLETE** | -- | 2026-08-19 | none | Claude Code |
| TASK-0004 | low priority | **READY** | TASK-0001 | -- | go | Claude Code |
| TASK-0005 | high priority | **READY** | TASK-0001 | -- | go | Claude Code |

## TASK-0004 -- low priority

**Priority:** 7 | **Status:** READY

## TASK-0005 -- high priority

**Priority:** 1 | **Status:** READY
'@

$QUEUE_INCONSISTENT_DEP = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0004 | blocked dep | **BLOCKED** | -- | -- | wait | Claude Code |
| TASK-0006 | ready anyway | **READY** | TASK-0004 | -- | go | Claude Code |
'@

$QUEUE_TWO_IN_PROGRESS = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0004 | one | **IN_PROGRESS** | -- | -- | x | Claude Code |
| TASK-0005 | two | **IN_PROGRESS** | -- | -- | x | Claude Code |
'@

$QUEUE_BAD_STATUS = @'
| ID | Task | Status | Depends On | Last Verified | Next Action | Owner |
|---|---|---|---|---|---|---|
| TASK-0004 | one | **PROBABLY_FINE** | -- | -- | x | Claude Code |
'@

# ---------------------------------------------------------------- tests

Write-Host ''
Write-Host 'READY detection' -ForegroundColor Cyan

Test-Case 'detects the READY task' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_WITH_READY
    $ready = Get-HighestPriorityReadyTask -Tasks $tasks
    Assert-True ($null -ne $ready) 'a READY task should be found'
    Assert-Equal 'TASK-0004' $ready.Id
}

Test-Case 'picks the highest priority when several are READY' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_TWO_READY
    $ready = Get-HighestPriorityReadyTask -Tasks $tasks
    Assert-Equal 'TASK-0005' $ready.Id 'priority 1 beats priority 7'
}

Test-Case 'WAITING_FOR_* is not mistaken for READY' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_NO_READY
    foreach ($t in $tasks) { Assert-True ($t.Status -ne 'READY') ($t.Id + ' should not be READY') }
}

Write-Host ''
Write-Host 'no-READY behaviour' -ForegroundColor Cyan

Test-Case 'returns nothing when no task is READY' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_NO_READY
    Assert-Equal $null (Get-HighestPriorityReadyTask -Tasks $tasks)
}

Test-Case 'a queue with no READY task is still consistent' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_NO_READY
    Assert-True (Test-QueueConsistency -Tasks $tasks).IsConsistent 'no READY is normal, not an error'
}

Write-Host ''
Write-Host 'duplicate-run prevention' -ForegroundColor Cyan

Test-Case 'a live lock reports the runner active' {
    $dir = New-TempDir
    try {
        New-RunnerLock -StateDirectory $dir -TaskId 'TASK-0004' -RunnerPid $PID | Out-Null
        $state = Test-RunnerActive -StateDirectory $dir
        Assert-True $state.Active 'own live PID should read as active'
        Assert-True (-not $state.Stale) 'a live runner is not stale'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'a second lock cannot be acquired' {
    $dir = New-TempDir
    try {
        New-RunnerLock -StateDirectory $dir -TaskId 'TASK-0004' -RunnerPid $PID | Out-Null
        $threw = $false
        try { New-RunnerLock -StateDirectory $dir -TaskId 'TASK-0005' -RunnerPid $PID | Out-Null }
        catch { $threw = $true }
        Assert-True $threw 'exclusive create must refuse a second lock'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'no lock means no runner' {
    $dir = New-TempDir
    try { Assert-True (-not (Test-RunnerActive -StateDirectory $dir).Active) 'empty state = no runner' }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Write-Host ''
Write-Host 'stale-run handling' -ForegroundColor Cyan

Test-Case 'a lock whose process is gone is stale, and still counts as active' {
    $dir = New-TempDir
    try {
        # PID 999999 will not exist.
        New-RunnerLock -StateDirectory $dir -TaskId 'TASK-0004' -RunnerPid 999999 | Out-Null
        $state = Test-RunnerActive -StateDirectory $dir -LockTimeoutMinutes 1
        Assert-True $state.Stale 'dead process should be stale'
        Assert-True $state.Active 'stale still blocks starting -- a human decides'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'an unreadable lock is treated as held' {
    $dir = New-TempDir
    try {
        Set-Content -LiteralPath (Join-Path $dir 'runner.lock') -Value 'this is not json{{{' -Encoding utf8
        $state = Test-RunnerActive -StateDirectory $dir
        Assert-True $state.Active 'fail closed: corrupt lock must not read as free'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Write-Host ''
Write-Host 'GitHub-unavailable behaviour' -ForegroundColor Cyan

Test-Case 'a non-repository path is unreadable, not an error' {
    $dir = New-TempDir
    try {
        $git = Test-RepositoryReconciled -RepositoryPath $dir
        Assert-True (-not $git.Readable) 'no .git means unreadable'
        Assert-True (-not $git.Reconciled) 'unreadable is never reconciled'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'an unreconciled repository yields no action' {
    $cfg = [pscustomobject]@{
        enabled = $true; dryRun = $false
        repositoryPath = (New-TempDir)
        queueRelativePath = 'nope.md'; remote = 'origin'; branch = 'main'
        intervalMinutes = 10; staleRunMinutes = 120; lockTimeoutMinutes = 240
        runnerCommand = ''; runnerArguments = @(); statePath = 'state'; logPath = 'logs'
    }
    try {
        $r = Invoke-SupervisorCycle -Config $cfg
        Assert-Equal 'NOOP' $r.Decision 'unreadable repo must be a no-op, never a start'
    }
    finally { Remove-Item -LiteralPath $cfg.repositoryPath -Recurse -Force }
}

Write-Host ''
Write-Host 'inconsistent-queue behaviour' -ForegroundColor Cyan

Test-Case 'READY with an incomplete dependency is inconsistent' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_INCONSISTENT_DEP
    $c = Test-QueueConsistency -Tasks $tasks
    Assert-True (-not $c.IsConsistent) 'a READY task with a BLOCKED dependency is a contradiction'
}

Test-Case 'two IN_PROGRESS tasks are inconsistent' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_TWO_IN_PROGRESS
    Assert-True (-not (Test-QueueConsistency -Tasks $tasks).IsConsistent) 'only one task may be in flight'
}

Test-Case 'an unrecognised status is inconsistent' {
    $tasks = ConvertFrom-QueueMarkdown -Markdown $QUEUE_BAD_STATUS
    Assert-True (-not (Test-QueueConsistency -Tasks $tasks).IsConsistent) 'unknown status must not be guessed at'
}

Test-Case 'an empty queue is inconsistent, not empty-and-fine' {
    Assert-True (-not (Test-QueueConsistency -Tasks @()).IsConsistent) 'parsing nothing means something is wrong'
}

Write-Host ''
Write-Host 'defaults' -ForegroundColor Cyan

Test-Case 'default configuration is inert' {
    $c = Get-SupervisorConfig -Path ''
    Assert-Equal $false $c.enabled 'must default to disabled'
    Assert-Equal $true $c.dryRun 'must default to dry-run'
    Assert-Equal '' $c.runnerCommand 'must default to no runner'
    Assert-Equal 10 $c.intervalMinutes '10-minute fallback is the authoritative cadence'
}

Write-Host ''
Write-Host 'runner command line' -ForegroundColor Cyan

Test-Case 'an argument with spaces is quoted as one argument' {
    $line = ConvertTo-RunnerCommandLine -Arguments @('-p', 'do the thing', '--permission-mode', 'acceptEdits')
    Assert-Equal '-p "do the thing" --permission-mode acceptEdits' $line 'a prompt must survive as one argument'
}

Test-Case 'an argument without spaces is left bare' {
    Assert-Equal '--settings' (ConvertTo-RunnerCommandLine -Arguments @('--settings'))
}

Test-Case 'embedded quotes are escaped, not dropped' {
    $line = ConvertTo-RunnerCommandLine -Arguments @('say "hi" now')
    Assert-True ($line -like '*\"hi\"*') 'embedded quotes must be escaped'
}

Test-Case 'an empty argument list yields an empty line' {
    Assert-Equal '' (ConvertTo-RunnerCommandLine -Arguments @())
}

Write-Host ''
Write-Host 'runner launch' -ForegroundColor Cyan

Test-Case 'a successful runner reports exit code 0 and captures stdout' {
    $dir = New-TempDir
    try {
        $r = Start-RunnerProcess -FilePath 'cmd.exe' -CommandLine '/c echo LAUNCH_OK' `
            -WorkingDirectory $dir -StdOutPath (Join-Path $dir 'o.log') -StdErrPath (Join-Path $dir 'e.log')
        Assert-Equal 0 $r.ExitCode 'a clean run must report 0'
        Assert-True ($r.StdOut -like '*LAUNCH_OK*') 'stdout must be captured'
        Assert-True (Test-Path (Join-Path $dir 'o.log')) 'stdout must be persisted to a file'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'a failing runner reports its real exit code' {
    $dir = New-TempDir
    try {
        $r = Start-RunnerProcess -FilePath 'cmd.exe' -CommandLine '/c exit 3' `
            -WorkingDirectory $dir -StdOutPath (Join-Path $dir 'o.log') -StdErrPath (Join-Path $dir 'e.log')
        Assert-Equal 3 $r.ExitCode 'a nonzero exit must not be reported as 0 -- Start-Process could not do this'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'the started callback receives the runner pid' {
    $dir = New-TempDir
    try {
        $script:seenPid = 0
        $r = Start-RunnerProcess -FilePath 'cmd.exe' -CommandLine '/c exit 0' `
            -WorkingDirectory $dir -StdOutPath (Join-Path $dir 'o.log') -StdErrPath (Join-Path $dir 'e.log') `
            -OnStarted { param($p) $script:seenPid = $p }
        Assert-Equal $r.Pid $script:seenPid 'the lock must be repointed at the runner pid, not the supervisor pid'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

Test-Case 'the lock can be repointed at the runner pid' {
    $dir = New-TempDir
    try {
        New-RunnerLock -StateDirectory $dir -TaskId 'TASK-0003' -RunnerPid $PID | Out-Null
        Update-RunnerLockPid -StateDirectory $dir -RunnerPid 4242 | Out-Null
        $lock = Get-RunnerLock -StateDirectory $dir
        Assert-Equal 4242 $lock.pid 'the lock must carry the runner pid after the update'
        Assert-Equal 'TASK-0003' $lock.taskId 'the task id must survive the update'
    }
    finally { Remove-Item -LiteralPath $dir -Recurse -Force }
}

# ---------------------------------------------------------------- summary

Write-Host ''
Write-Host ('{0} passed, {1} failed' -f $script:Passed, $script:Failed) -ForegroundColor $(if ($script:Failed -gt 0) { 'Red' } else { 'Green' })
if ($script:Failed -gt 0) { exit 1 }
exit 0
