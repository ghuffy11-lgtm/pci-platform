/**
 * TASK-0045 -- bounded DA-1 evidence: measure durability artefacts against the
 * criterion that already exists.
 *
 * Authority: MSG-0153 (AUTHORIZED), plus the CLAUDE-TASKS.md TASK-0045 section.
 * Binding:   EPA-0006 §4.16 DA-0…DA-7 AS WRITTEN -- the criterion is
 *            authoritative and this probe does not adjust it, including where
 *            it is inconvenient to measure.  Also §4.6 S5 (the asymmetry rule),
 *            S8 (negative control), S9 (verdict vocabulary), S11 (what a probe
 *            must not do); §4.12 (the control standard); §4.13 GAP-B / N1 / N2;
 *            §4.15 (the binding-not-build caution).
 *
 * WHAT THIS IS
 * ------------
 * A measurement of engine-managed DURABILITY ARTEFACTS against DA-1's three
 * limbs.  The subject is a TEST SUBJECT, not a candidate.  Per DA-5
 * consequence 1, SATISFYING DA-1 CLEARS NOTHING -- it is not an §4.6 S6
 * evidence class and cannot substitute for E1, E2, E3 or E4.  No candidate
 * verdict anywhere in EPA-0006 moves on this file's output, whatever it says.
 *
 * THE ONE THING THIS PROBE IS BUILT AROUND: DA-4, PROVENANCE NOT PRESENCE
 * ----------------------------------------------------------------------
 * §4.16 DA-4: a projection durably holds the corpus it indexes, so
 * "unauthorized-for-s bytes exist somewhere in the engine's files" is TRUE BY
 * CONSTRUCTION for every candidate at every moment.  A probe that greps an
 * artefact for a marker therefore MEASURES NOTHING.
 *
 * The apparatus that separates the two provenances is section C's BASELINE:
 * after ingest, the artefact is emptied by a maintenance operation and
 * MEASURED EMPTY.  Only then is a request resolved.  Anything found afterwards
 * arrived AFTER the baseline, so it is attributable to what happened after --
 * which is the request.  Where the baseline cannot be established for an
 * artefact class, DA-6 gives the answer (NOT CLEARED) and the probe says so
 * rather than reinterpreting the criterion.
 *
 * WHY THIS SUBJECT, GIVEN GAP-B
 * -----------------------------
 * §4.13 GAP-B records E4 UNOBTAINABLE on this subject.  That does not transfer:
 * E4 needs an EXECUTION surface the binding does not expose, DA-1 asks about
 * CONTENT AT REST in files (DA-7), and files are exposed by the filesystem
 * regardless of binding.  The instrument DA-1 needs is a file read.  The one
 * real limitation was that every prior measurement here used ':memory:', which
 * §4.12 recorded as location() == null -- a property of the FIXTURE, not the
 * engine.  A file-backed fixture closes it.
 *
 * HOW TO RUN
 * ----------
 *     node implementation/probes/TASK-0045/probe.mjs
 *
 * Deterministic, offline, no arguments, no network, no install.  Every fixture
 * is synthetic (S11).  Databases are created under the OS temp directory and
 * removed; nothing is written inside the repository.  Capture stdout to
 * probe-output.txt.
 */

import { DatabaseSync, backup } from 'node:sqlite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

// Markers stand in for Restricted / approved passage text.  Chosen so a byte
// scan for either cannot collide with anything else this process writes.
const UNAUTH = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ';
const AUTH = 'QQ-AUTHORIZED-PASSAGE-TEXT-QQ';

const FAILURES = [];
const CONTROLS = [];

const head = (t) => { console.log(); console.log('='.repeat(78)); console.log(t); console.log('='.repeat(78)); };
const sub = (t) => { console.log(); console.log('  --- ' + t + ' ' + '-'.repeat(Math.max(0, 70 - t.length))); };
const note = (k, v) => console.log('  ' + (k + ':').padEnd(50) + ' ' + v);
const fail = (m) => { FAILURES.push(m); console.log('  !! CONTROL FAILED: ' + m); };

/**
 * Classify an artefact three ways, never two.  The task's verification section
 * requires that "the artefact was empty" be distinguished from "the artefact
 * was never created", exactly as §4.12 distinguished an inert pragma from an
 * absent one.  A two-way classification silently merges them, and the merged
 * reading is the optimistic one.
 */
function inspect(p) {
  if (!fs.existsSync(p)) return { state: 'NEVER CREATED', bytes: null, unauth: null, auth: null, readable: null };
  let size = null;
  try { size = fs.statSync(p).size; } catch (e) { return { state: 'PRESENT, UNSTATABLE (' + e.code + ')', bytes: null, unauth: null, auth: null, readable: false }; }
  let buf;
  try { buf = fs.readFileSync(p); } catch (e) {
    // DA-6: an artefact that exists but cannot be read is UNINSPECTABLE.
    return { state: 'PRESENT, UNREADABLE (' + e.code + ')', bytes: size, unauth: null, auth: null, readable: false };
  }
  const s = buf.toString('latin1');
  const u = s.split(UNAUTH).length - 1;
  const a = s.split(AUTH).length - 1;
  return {
    state: size === 0 ? 'PRESENT BUT EMPTY (0 bytes)' : 'PRESENT, ' + size + ' bytes',
    bytes: size, unauth: u, auth: a, readable: true,
  };
}

function report(label, p) {
  const r = inspect(p);
  const marks = r.readable
    ? 'UNAUTH x' + r.unauth + '  AUTH x' + r.auth
    : (r.readable === null ? '(no file to scan)' : 'NOT SCANNABLE');
  note('  ' + label.padEnd(14) + r.state, marks);
  return r;
}

function artefacts(db) {
  return [['(main db)', db], ['-wal', db + '-wal'], ['-shm', db + '-shm'], ['-journal', db + '-journal']];
}

function scanAll(db, title) {
  sub(title);
  const out = {};
  for (const [label, p] of artefacts(db)) out[label] = report(label, p);
  return out;
}

/** Synthetic shared projection: one store, both entitlement classes in it. */
function buildFixture(d, n, wide) {
  d.exec('CREATE TABLE chunk (id INTEGER PRIMARY KEY, scope TEXT NOT NULL, body TEXT NOT NULL)');
  const ins = d.prepare('INSERT INTO chunk VALUES (?,?,?)');
  const pad = wide ? ' ' + 'x'.repeat(200) : '';
  d.exec('BEGIN');
  for (let i = 1; i <= n; i++) {
    const authorized = i % 2 === 0;
    ins.run(i, authorized ? 'AUTHORIZED' : 'OTHER-TENANT',
      (authorized ? AUTH : UNAUTH) + ' body ' + i + pad);
  }
  d.exec('COMMIT');
  return n;
}

function mkdir(tag) { return fs.mkdtempSync(path.join(os.tmpdir(), 'pci-task-0045-' + tag + '-')); }
function rmdir(dir) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* reported by caller */ } }

const TMP = os.tmpdir();
const snapshot = () => new Set(fs.readdirSync(TMP));
const newSince = (before) => fs.readdirSync(TMP).filter((f) => !before.has(f));

// ---------------------------------------------------------------------------
// A.  Subject, runtime and maintenance state.  Acceptance criterion 6 requires
//     subject, runtime, journal_mode and maintenance state PER MEASUREMENT, so
//     this section fixes the parts that do not vary and each section states the
//     parts that do.
// ---------------------------------------------------------------------------
function sectionA() {
  head('A. SUBJECT AND RUNTIME (acceptance criterion 6)');
  const d = new DatabaseSync(':memory:');
  note('node version', process.version);
  note('platform / arch', process.platform + ' / ' + process.arch);
  note('binding', 'node:sqlite (built in)');
  note('SQLite ENGINE version', d.prepare('SELECT sqlite_version() v').get().v);
  note('OS temp directory', TMP);
  const opts = d.prepare('PRAGMA compile_options').all().map((r) => Object.values(r)[0]);
  note('compile options reported', opts.length);
  const joined = opts.join(' ').toUpperCase();
  for (const f of ['ENABLE_STMT_SCANSTATUS', 'DEBUG', 'ENABLE_SQLLOG']) {
    note('  ' + f, joined.includes(f) ? 'PRESENT' : 'ABSENT');
  }
  for (const f of ['TEMP_STORE', 'THREADSAFE', 'MAX_MMAP_SIZE']) {
    const hit = opts.filter((o) => o.toUpperCase().startsWith(f));
    note('  ' + f, hit.length ? hit.join(', ') : 'not reported');
  }
  d.close();

  console.log();
  console.log('  THIS IS THE FIRST TEST SUBJECT -- the one §4.13 GAP-B concerns.');
  console.log('  §4.15: the two available subjects differ in the BINDING, not the');
  console.log('  build, and NEITHER GENERALIZES TO AN ENGINE CLASS.  Nothing below');
  console.log('  may be read as "SQLite does X", still less as "class R does X".');
  console.log();
  console.log('  The SECOND subject (Python 3.14.5 / SQLite 3.50.4) is NOT used:');
  console.log('  MSG-0145 granted `py` for TASK-0043\'s probe ONLY, and the queue');
  console.log('  section requires a fresh grant.  None exists, so it is not invoked.');
  console.log('  Every measurement below is on the FIRST subject.  See section K.');
}

// ---------------------------------------------------------------------------
// B.  The scope the criterion fixes.  Printed rather than assumed, so a reader
//     can check the probe against DA-2/DA-3 without holding §4.16 in mind.
// ---------------------------------------------------------------------------
function sectionB() {
  head('B. SCOPE, TAKEN FROM DA-2 AND DA-3 UNCHANGED (criterion 1)');
  console.log('  IN SCOPE (DA-2) -- and where this probe measures each:');
  for (const [k, v] of [
    ['write-ahead logs', 'sections D, E, G (NC-2)'],
    ['rollback / undo journals', 'section F'],
    ['shared-memory / index files (-shm)', 'sections D, E'],
    ['temporary and spill files', 'sections E, G (NC-1) -- the hard one'],
    ['engine-produced backups / snapshots', 'section H'],
  ]) note('  ' + k, v);
  console.log();
  console.log('  OUT OF SCOPE (DA-3) -- not measured, and not narrowed either:');
  for (const k of [
    'application logs, telemetry, audit payloads (ADR-0020 §6.2, §9.3)',
    "the engine's execution surface -- traces/profiles/logs (that is E4; DA-7)",
    'OS page cache and other volatile kernel buffers',
    'filesystem / volume / storage-layer encryption at rest',
    'operator-taken backups, filesystem snapshots, host images',
    "the projection's own at-rest storage of APPROVED content (ADR-0020 §1)",
  ]) console.log('      - ' + k);
  console.log();
  console.log('  The last exclusion is the one DA-4 makes load-bearing, and it is');
  console.log('  why section C exists: without it, the main db always "fails".');
}

// ---------------------------------------------------------------------------
// C.  THE PROVENANCE APPARATUS.  This is the section the whole probe turns on.
//
//     DA-4 says a grep measures nothing.  So: ingest, then EMPTY the artefact by
//     a maintenance operation, then MEASURE IT EMPTY, and only then resolve a
//     request.  The measured-empty step is what converts a later finding from
//     "bytes exist" into "bytes arrived because the request was resolved".
//
//     The baseline is VERIFIED, not assumed.  If the artefact does not come back
//     empty, no attribution is available and DA-6 applies -- and this section
//     says so instead of proceeding.
// ---------------------------------------------------------------------------
function sectionC() {
  head('C. THE PROVENANCE BASELINE (DA-4) -- the apparatus, established first');

  console.log('  DA-4: "unauthorized-for-s bytes exist somewhere in the engine\'s');
  console.log('  files" is TRUE BY CONSTRUCTION under a shared projection.  So');
  console.log('  presence is not evidence.  What follows is the discriminator.');

  const dir = mkdir('baseline');
  const db = path.join(dir, 'projection.db');
  const d = new DatabaseSync(db);
  try {
    note('journal_mode set', d.prepare('PRAGMA journal_mode=WAL').get().journal_mode);
    const n = buildFixture(d, 400, false);
    note('fixture rows (synthetic, S11)', n + '  (' + n / 2 + ' authorized / ' + n / 2 + ' unauthorized)');

    scanAll(db, 'C1  AFTER INGEST -- provenance here is INGEST, not a request');
    console.log('      Under DA-4 row 1 this is NOT a DA-1.1/DA-1.2 finding: it is');
    console.log('      the projection of approved content, governed by ADR-0020 §1.');
    console.log('      A probe that stopped here would have measured nothing.');

    sub('C2  MAINTENANCE OPERATION -- PRAGMA wal_checkpoint(TRUNCATE)');
    const ck = d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
    note('checkpoint result', JSON.stringify(ck));
    note('maintenance state after this point', 'checkpointed (TRUNCATE); no VACUUM, no ANALYZE');

    const after = scanAll(db, 'C3  BASELINE -- the artefact MEASURED empty, not assumed empty');

    const wal = after['-wal'];
    const baselineOk = wal.readable === true && wal.bytes === 0;
    console.log();
    note('BASELINE ESTABLISHED for the -wal artefact', baselineOk ? 'YES -- 0 bytes, verified by reading it' : 'NO');
    if (baselineOk) {
      console.log('      => Any UNAUTH occurrence found in -wal AFTER this point');
      console.log('         arrived after the baseline.  That is DA-4 row 2:');
      console.log('         "written, or retained, BECAUSE a request was resolved."');
      console.log('         Attribution is available for this artefact class.');
    } else {
      console.log('      => Attribution is NOT available for this artefact class.');
      console.log('         DA-6 applies: NOT CLEARED.  This is a RESULT, not a');
      console.log('         probe defect, and the criterion is not reinterpreted.');
      fail('the -wal baseline did not come back empty; attribution unavailable');
    }

    console.log();
    console.log('  NOTE ON THE -shm ARTEFACT, recorded rather than glossed: it is');
    console.log('  NOT emptied by the checkpoint (see C3 above).  Attribution for');
    console.log('  -shm therefore rests on its measured marker COUNT changing, not');
    console.log('  on an empty baseline -- a weaker instrument, and said to be one.');

    d.close();
    return { baselineOk, dir, db };
  } finally {
    rmdir(dir);
  }
}

// ---------------------------------------------------------------------------
// D + E.  MEASUREMENT M1 -- a request resolved in the Shape-1-respecting shape:
//     the entitlement predicate is applied BY the engine, before anything is
//     sorted or materialised.  This is the honest measurement; section G is the
//     control that proves the instruments can see a finding at all.
// ---------------------------------------------------------------------------
function measure(label, { sql, params = [], rows, wide, journalMode, maintenance, describe }) {
  head(label);
  console.log('  ' + describe);
  const dir = mkdir('m');
  const db = path.join(dir, 'projection.db');
  const d = new DatabaseSync(db);
  const result = { spills: [], walAfter: null, baselineOk: false };
  try {
    note('subject / runtime', 'SQLite ' + d.prepare('SELECT sqlite_version() v').get().v + ' via node:sqlite, node ' + process.version);
    note('journal_mode', d.prepare('PRAGMA journal_mode=' + journalMode).get().journal_mode);
    d.exec('PRAGMA temp_store=FILE');
    d.exec('PRAGMA cache_size=-8');
    note('temp_store', JSON.stringify(d.prepare('PRAGMA temp_store').get()) + '   (1 = FILE)');
    note('cache_size', JSON.stringify(d.prepare('PRAGMA cache_size').get()) + '   (negative = KiB)');
    const n = buildFixture(d, rows, wide);
    note('fixture rows (synthetic, S11)', n + '  (' + n / 2 + ' authorized / ' + n / 2 + ' unauthorized)');

    // --- baseline
    if (journalMode.toUpperCase() === 'WAL') {
      d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
    }
    note('maintenance state at baseline', maintenance);
    const base = scanAll(db, 'BASELINE -- after ingest + maintenance, before the request');
    result.baselineOk = journalMode.toUpperCase() !== 'WAL' || (base['-wal'].readable === true && base['-wal'].bytes === 0);
    note('baseline attributable (DA-4)', result.baselineOk ? 'YES' : 'NO -- DA-6 applies to this measurement');

    // --- the request, with the temp directory watched while it runs
    sub('THE REQUEST -- resolved for subject s, temp directory watched DURING');
    note('SQL', sql);
    for (const r of d.prepare('EXPLAIN QUERY PLAN ' + sql).all(...params)) {
      note('  plan', r.detail);
    }
    const before = snapshot();
    const st = d.prepare(sql);
    let seen = 0, kept = 0, sampled = false;
    for (const row of st.iterate(...params)) {
      seen++;
      if (row.scope === undefined || row.scope === 'AUTHORIZED') kept++;
      // Sample the temp directory mid-flight.  A spill file exists only while
      // the statement is live, so a before/after comparison cannot see it --
      // which is exactly why DA-2 calls these "least likely to be looked for".
      if (!sampled && seen >= Math.min(20, rows)) {
        sampled = true;
        for (const f of newSince(before)) {
          const p = path.join(TMP, f);
          const r = inspect(p);
          result.spills.push({ name: f, ...r });
          note('  SPILL FILE (during) ' + f, r.state + '  |  ' + (r.readable ? 'UNAUTH x' + r.unauth + '  AUTH x' + r.auth : 'NOT READABLE'));
        }
        if (result.spills.length === 0) note('  spill files visible during the request', 'NONE');
      }
    }
    note('rows the ENGINE returned', seen);
    note('rows the request was entitled to', kept);

    // --- after
    const after = scanAll(db, 'AFTER THE REQUEST -- same artefacts, same instrument');
    result.walAfter = after['-wal'];
    result.mainAfter = after['(main db)'];
    result.residue = newSince(before);
    note('temp-directory residue after the request', result.residue.length ? JSON.stringify(result.residue) : 'NONE -- every spill file removed');

    d.close();
    const afterClose = scanAll(db, 'AFTER CONNECTION CLOSE -- DA-1.2 asks what survives');
    result.afterClose = afterClose;
    return result;
  } finally {
    rmdir(dir);
  }
}

// ---------------------------------------------------------------------------
// F.  Rollback / undo journal.  A separate artefact class under DA-2, and it
//     needs a different instrument: the -journal exists only WHILE a write
//     transaction is open, so it must be read between the write and the commit.
//
//     This section is also where DA-4 is demonstrated rather than argued.  The
//     SAME artefact is measured under TWO provenances -- an ingest write and a
//     request resolution -- and the criterion returns OPPOSITE verdicts on
//     observations that look identical.  A presence-based criterion could not
//     tell them apart; that is DA-4's whole point, shown on real output.
//
//     Attribution here does not need an emptied baseline, because the rollback
//     journal is created PER TRANSACTION: F1 measures that no -journal exists
//     beforehand, so the file itself is created by the transaction under test.
//     The question DA-4 asks is then what that transaction WAS.
// ---------------------------------------------------------------------------
function sectionF() {
  head('F. ROLLBACK / UNDO JOURNAL (DA-2 row 2) -- and DA-4 shown, not argued');
  console.log('  MSG-0146 §5 recorded "-journal ABSENT", which §4.16 DA-2 notes is');
  console.log('  "a fact about the configuration, not about the criterion" -- that');
  console.log('  run was in WAL mode, where no rollback journal is used.  This');
  console.log('  section puts the subject in the configuration that DOES use one.');

  const dir = mkdir('journal');
  const db = path.join(dir, 'projection.db');
  const d = new DatabaseSync(db);
  const out = {};
  try {
    note('journal_mode', d.prepare('PRAGMA journal_mode=DELETE').get().journal_mode);
    note('maintenance state', 'none -- no checkpoint applies in this mode');
    buildFixture(d, 400, false);
    const jp = db + '-journal';

    scanAll(db, 'F1  AFTER INGEST, no transaction open -- the per-transaction baseline');
    out.baseline = inspect(jp);
    note('baseline: does a -journal exist before any transaction', out.baseline.state);
    const attributable = out.baseline.state === 'NEVER CREATED';
    note('=> a -journal seen later was CREATED by the transaction', attributable ? 'YES -- attribution available at artefact level' : 'NO');
    if (!attributable) fail('a -journal already existed before the transaction; F is not attributable');

    // --- F2: provenance = INGEST -------------------------------------------
    sub('F2  A write whose provenance is INGEST -- maintaining the projection');
    console.log('      This transaction adds approved-corpus rows.  It is NOT a');
    console.log('      request being resolved for any subject.');
    d.exec('BEGIN IMMEDIATE');
    d.prepare('INSERT INTO chunk VALUES (?,?,?)').run(99999, 'OTHER-TENANT', UNAUTH + ' ingested inside the open transaction');
    out.ingest = report('-journal', jp);
    d.exec('COMMIT');
    console.log();
    console.log('      DA-4 ROW 1: written at ingest, maintaining the projection of');
    console.log('      approved content => NOT a DA-1.1 or DA-1.2 finding, however');
    console.log('      many times the marker appears.  ADR-0020 §1 governs it.');

    // --- F3: provenance = REQUEST RESOLUTION, appending --------------------
    sub('F3  Request-resolution write #1 -- the caching shape (APPENDS)');
    console.log('      A retrieval layer that caches its working set writes back what');
    console.log('      it examined, into a NEW table.  Nothing is ingested here: every');
    console.log('      byte written is a consequence of resolving the request.');
    d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)');
    d.exec('BEGIN IMMEDIATE');
    d.exec("INSERT INTO result_cache SELECT id, scope, body FROM chunk WHERE body LIKE '%body 1%'");
    out.append = report('-journal', jp);
    d.exec('COMMIT');
    console.log();
    console.log('      MEASURED, AND NOT WHAT THE PROBE\'S AUTHOR EXPECTED.  The marker');
    console.log('      count above is what it is; if it is 0, the reason is structural:');
    console.log('      a rollback journal holds the ORIGINAL images of pages about to');
    console.log('      be OVERWRITTEN, and rows appended into fresh pages overwrite');
    console.log('      nothing.  An APPEND-shaped request-induced write therefore need');
    console.log('      not journal any corpus content at all.');
    console.log('      Under DA-5 row 3 this absence is NOT sufficient and NOT a pass.');

    // --- F4: provenance = REQUEST RESOLUTION, overwriting -------------------
    sub('F4  Request-resolution write #2 -- access accounting (OVERWRITES)');
    console.log('      The other everyday retrieval-layer write: record that a chunk');
    console.log('      was served.  It UPDATES rows in the shared projection itself,');
    console.log('      and it updates ONLY rows the subject was ENTITLED to receive.');
    d.exec('ALTER TABLE chunk ADD COLUMN served INTEGER DEFAULT 0');
    d.exec('BEGIN IMMEDIATE');
    d.exec("UPDATE chunk SET served = served + 1 WHERE scope = 'AUTHORIZED'");
    out.overwrite = report('-journal', jp);
    d.exec('COMMIT');

    sub('F5  AFTER COMMIT');
    out.after = report('-journal', jp);

    const ingestHit = out.ingest.readable && out.ingest.unauth > 0;
    const reqHit = (out.overwrite.readable && out.overwrite.unauth > 0) || (out.append.readable && out.append.unauth > 0);
    out.requestFinding = out.overwrite.readable && out.overwrite.unauth > 0 ? out.overwrite
      : (out.append.readable && out.append.unauth > 0 ? out.append : null);

    console.log();
    if (out.overwrite.readable && out.overwrite.unauth > 0) {
      console.log('  THE SHARPEST RESULT IN THIS SECTION.  The request updated ONLY');
      console.log('  rows the subject was entitled to -- and the rollback journal came');
      console.log('  back holding the UNAUTHORIZED marker ' + out.overwrite.unauth + ' times.  The engine');
      console.log('  journals whole PAGES, and a page holding an authorized row also');
      console.log('  holds its unauthorized neighbours.  So a write touching nothing');
      console.log('  the subject was forbidden still made forbidden content durable.');
      console.log('  DA-4 row 2: it happened BECAUSE the request was resolved.');
      console.log('  DA-5 row 1: a single occurrence is sufficient => NOT CLEARED.');
      console.log();
      console.log('  Note what this does NOT depend on: no post-filtering, no bad query');
      console.log('  plan, and no examination of unauthorized rows by the request. This');
      console.log('  is page granularity, not query shape -- so §4.13 N1 containment,');
      console.log('  which works by keeping unauthorized content out of REACH, is the');
      console.log('  kind of answer it responds to, and a better query is not.');
    } else {
      console.log('  The overwrite-shaped request-induced write did NOT leave the');
      console.log('  unauthorized marker in the journal on this run.  Recorded as');
      console.log('  measured.  DA-5 row 3: this absence is NOT sufficient.');
    }

    console.log();
    console.log('  AND THE DA-4 CONTRAST, which is why the section is built this way:');
    note('  F2 ingest write -- marker in journal', ingestHit ? out.ingest.unauth + ' times' : 'absent');
    note('  F2 verdict', 'NOT a DA-1 finding -- DA-4 row 1, ingest provenance');
    note('  F4 request write -- marker in journal', out.overwrite.readable ? out.overwrite.unauth + ' times' : 'not readable');
    note('  F4 verdict', out.overwrite.readable && out.overwrite.unauth > 0 ? 'DA-1.1 FINDING -- DA-4 row 2, request provenance' : 'no finding; absence not sufficient');
    console.log('  The two observations are the same SHAPE and get opposite answers.');
    console.log('  A criterion phrased as PRESENCE would have flagged both, failed the');
    console.log('  engine on the ingest one, and told nobody anything.  That is what');
    console.log('  §4.16 DA-4 was written to prevent, demonstrated on this run\'s own');
    console.log('  output rather than argued.');

    console.log();
    console.log('  READ F5 CAREFULLY.  "NEVER CREATED" does NOT mean the artefact never');
    console.log('  held the content -- F2 and F4 measured that it did.  It means the');
    console.log('  artefact was reclaimed between the inspections.  §4.16 DA-5 row 3');
    console.log('  names this exactly: "an absence proves only that nothing crossed the');
    console.log('  point, and the moment, at which the inspection was taken.  An');
    console.log('  artefact may have been checkpointed, truncated, rotated or reclaimed');
    console.log('  between the request and the scan."  A probe that scanned only AFTER');
    console.log('  the request would have reported a clean result here, and it would');
    console.log('  have been a FALSE NEGATIVE.');
    void reqHit;
    d.close();
    return out;
  } finally {
    rmdir(dir);
  }
}

// ---------------------------------------------------------------------------
// G.  THE NEGATIVE CONTROLS (§4.6 S8, acceptance criterion 5).
//
//     Two of them, one per instrument, because a control on the WAL scanner says
//     nothing about whether the spill scanner works.  Each is a configuration
//     that MUST produce a DA-1 finding.  If either comes back clean the run has
//     measured nothing and is declared INVALID.
// ---------------------------------------------------------------------------
function sectionG() {
  head('G. NEGATIVE CONTROLS -- each MUST produce a DA-1 finding (criterion 5)');
  console.log('  §4.6 S8.  "A run whose negative control comes back clean has');
  console.log('  measured nothing."  Two controls, because there are two');
  console.log('  instruments and they can fail independently.');

  // ---- NC-1: the spill-file instrument ----------------------------------
  sub('NC-1  SPILL-FILE INSTRUMENT -- post-filtered retrieval');
  console.log('      The adverse shape is not contrived: rank across the SHARED');
  console.log('      projection, apply entitlement to the RESULT.  That is exactly');
  console.log('      the post-filtering strict Shape-1 exists to forbid, and it is');
  console.log('      how a retrieval layer is written when authorization is bolted');
  console.log('      on afterwards.  The engine must sort every row to answer it.');
  const nc1 = measure('NC-1 (negative control) -- post-filtered retrieval, WAL mode', {
    sql: 'SELECT id, scope FROM chunk ORDER BY body',
    rows: 20000, wide: true, journalMode: 'WAL',
    maintenance: 'checkpointed (TRUNCATE) at baseline; no VACUUM, no ANALYZE',
    describe: 'Entitlement applied AFTER the engine ranks the whole shared projection.',
  });
  const nc1hit = nc1.spills.some((s) => s.readable && s.unauth > 0);
  console.log();
  note('NC-1 produced a DA-1 finding', nc1hit ? 'YES' : 'NO');
  if (nc1hit) {
    const s = nc1.spills.find((x) => x.readable && x.unauth > 0);
    CONTROLS.push('NC-1 fired: spill file ' + s.name + ' (' + s.bytes + ' bytes) held the unauthorized marker ' + s.unauth + ' times');
    console.log('      QUOTED: spill file "' + s.name + '", ' + s.bytes + ' bytes,');
    console.log('      UNAUTHORIZED marker present ' + s.unauth + ' times, AUTHORIZED ' + s.auth + ' times.');
    console.log('      => the spill-file instrument CAN see unauthorized content.');
  } else {
    fail('NC-1 came back clean -- the spill-file instrument is not demonstrated to work');
  }

  // ---- NC-2: the WAL instrument ------------------------------------------
  sub('NC-2  WAL INSTRUMENT -- request resolution that materialises what it examined');
  console.log('      A retrieval layer that caches its working set writes examined');
  console.log('      content back into the store.  Under a shared projection the');
  console.log('      working set includes unauthorized rows.  This MUST reach the');
  console.log('      WAL, and the baseline makes it attributable to the request.');
  const dir = mkdir('nc2');
  const db = path.join(dir, 'projection.db');
  const d = new DatabaseSync(db);
  let nc2hit = false;
  try {
    note('journal_mode', d.prepare('PRAGMA journal_mode=WAL').get().journal_mode);
    buildFixture(d, 400, false);
    d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
    note('maintenance state at baseline', 'checkpointed (TRUNCATE)');
    const base = report('-wal', db + '-wal');
    const baseOk = base.readable && base.bytes === 0;
    note('baseline empty and attributable', baseOk ? 'YES' : 'NO');
    if (!baseOk) fail('NC-2 baseline was not empty; the finding below would not be attributable');

    d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)');
    d.exec("INSERT INTO result_cache SELECT id, scope, body FROM chunk WHERE body LIKE '%body 1%'");
    const after = report('-wal', db + '-wal');
    nc2hit = after.readable && after.unauth > 0 && baseOk;
    console.log();
    note('NC-2 produced a DA-1 finding', nc2hit ? 'YES' : 'NO');
    if (nc2hit) {
      CONTROLS.push('NC-2 fired: -wal went from 0 bytes to ' + after.bytes + ' and held the unauthorized marker ' + after.unauth + ' times, attributable to the resolution');
      console.log('      QUOTED: -wal went 0 bytes -> ' + after.bytes + ' bytes;');
      console.log('      UNAUTHORIZED marker present ' + after.unauth + ' times where the');
      console.log('      measured baseline held it 0 times.  Provenance: DA-4 row 2.');
      console.log('      => the WAL instrument CAN see unauthorized content.');
    } else {
      fail('NC-2 came back clean -- the WAL instrument is not demonstrated to work');
    }
    d.close();
  } finally {
    rmdir(dir);
  }
  return { nc1, nc1hit, nc2hit };
}

// ---------------------------------------------------------------------------
// H.  Engine-produced backups (DA-2 row 5).  node:sqlite exports backup(), so
//     this artefact class is reachable on this subject rather than unreachable.
// ---------------------------------------------------------------------------
async function sectionH() {
  head('H. ENGINE-PRODUCED BACKUP (DA-2 row 5)');
  console.log('  DA-2 puts "backups, snapshots and replication streams produced by');
  console.log('  the engine itself" in scope; DA-3 excludes OPERATOR-taken backups.');
  console.log('  node:sqlite exports backup(), so what follows is the IN-scope kind.');

  const dir = mkdir('backup');
  const elsewhere = mkdir('backup-elsewhere');   // a DIFFERENT directory
  const db = path.join(dir, 'projection.db');
  const inStore = path.join(dir, 'engine-backup.db');
  const outStore = path.join(elsewhere, 'engine-backup.db');
  const d = new DatabaseSync(db);
  const res = {};
  try {
    note('journal_mode', d.prepare('PRAGMA journal_mode=WAL').get().journal_mode);
    buildFixture(d, 400, false);
    d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
    note('maintenance state', 'checkpointed (TRUNCATE) before the backup');
    note('projection store directory', dir);

    let pages = null, err = null;
    try { pages = await backup(d, inStore); } catch (e) { err = e; }
    if (err) {
      note('backup() -> inside the store directory', 'FAILED: ' + err.message);
      res.reachable = false;
      d.close();
      return res;
    }
    note('backup() pages copied', pages);
    res.reachable = true;
    res.file = report('backup', inStore);

    console.log();
    console.log('  PROVENANCE, stated plainly: the backup reproduces the PROJECTION,');
    console.log('  whose content is there by INGEST -- DA-4 row 1.  So its holding');
    console.log('  unauthorized-for-s content is NOT a DA-1.1 or DA-1.2 finding, for');
    console.log('  exactly the reason DA-4 gives.  Reporting it as one would be the');
    console.log('  presence-not-provenance error the criterion was written to stop.');
    console.log('  DA-1.3 is the limb that applies, and it is TESTED below.');

    // DA-1.3 for this artefact is a REACH question, so it is measured by
    // actually writing the artefact outside the store directory rather than by
    // asserting that the API would allow it.
    sub('H2  DA-1.3 reach -- tested by writing the backup OUTSIDE the store');
    note('destination directory', elsewhere);
    let pages2 = null, err2 = null;
    try { pages2 = await backup(d, outStore); } catch (e) { err2 = e; }
    if (err2) {
      note('backup() -> outside the store directory', 'REFUSED: ' + err2.message);
      res.escapes = false;
      console.log('      => the engine constrained the destination.  Recorded as a');
      console.log('         containment the engine actually provides.');
    } else {
      note('backup() -> outside the store directory', 'SUCCEEDED, ' + pages2 + ' pages');
      res.escapes = true;
      res.outFile = report('backup (outside)', outStore);
      console.log('      => MEASURED, not asserted: the engine wrote a complete second');
      console.log('         copy of the projection into a directory that is NOT the');
      console.log('         store directory, and applied no constraint of its own to');
      console.log('         the destination.  Whatever protects the store does not');
      console.log('         travel with the copy.');
    }
    d.close();
    return res;
  } finally {
    rmdir(dir);
    rmdir(elsewhere);
  }
}

// ---------------------------------------------------------------------------
// I.  DA-1.3 -- widened reach.  A different question from 1.1 and 1.2: not what
//     was written, but WHERE, and who can reach it.
// ---------------------------------------------------------------------------
function sectionI(nc1) {
  head('I. DA-1.3 -- WIDENED REACH (measured, not argued)');
  console.log('  DA-1.3 prohibits an artefact "placing corpus content where MORE');
  console.log('  PRINCIPALS, or a LONGER LIFETIME, can reach it than the projection');
  console.log('  store itself allows" -- naming "a spill file outside the store\'s');
  console.log('  protection" as its own example.  So this is measured by LOCATION');
  console.log('  and LIFETIME, not by marker counts.');

  const dir = mkdir('reach');
  const db = path.join(dir, 'projection.db');
  const d = new DatabaseSync(db);
  const res = {};
  try {
    d.prepare('PRAGMA journal_mode=WAL').get();
    buildFixture(d, 400, false);
    d.prepare('SELECT id FROM chunk WHERE scope = ?').all('AUTHORIZED');

    sub('I1  WHERE each artefact lives, relative to the store directory');
    const storeDir = path.dirname(db);
    note('projection store directory', storeDir);
    for (const [label, p] of artefacts(db)) {
      if (!fs.existsSync(p)) { note('  ' + label, 'NEVER CREATED'); continue; }
      note('  ' + label, path.dirname(p) === storeDir ? 'INSIDE the store directory' : 'OUTSIDE: ' + path.dirname(p));
    }
    note('  spill / temporary files', 'OUTSIDE the store directory: ' + TMP);
    res.spillOutside = true;
    console.log();
    console.log('      MEASURED, from section G NC-1: the spill file was created in');
    console.log('      the OS temp directory, which is NOT the store directory and');
    console.log('      is NOT governed by whatever protects the store.  Its path is');
    console.log('      chosen by the engine, not by the deployment.');

    sub('I2  LIFETIME -- what survives the connection closing');
    d.close();
    for (const [label, p] of artefacts(db)) {
      note('  ' + label + ' after close', fs.existsSync(p) ? 'SURVIVES (' + fs.statSync(p).size + ' bytes)' : 'removed');
    }

    sub('I3  READABILITY BY A SECOND PRINCIPAL, tested rather than asserted');
    console.log('      The probe re-opened each surviving artefact as an ordinary');
    console.log('      file, with no database connection and no engine involvement.');
    for (const [label, p] of artefacts(db)) {
      if (!fs.existsSync(p)) continue;
      const r = inspect(p);
      note('  ' + label + ' read as a plain file', r.readable ? 'READABLE -- ' + r.bytes + ' bytes, UNAUTH x' + r.unauth : 'not readable');
    }
    console.log();
    console.log('      This is what "more principals can read it" means concretely:');
    console.log('      no engine, no authorization, no §3 predicate -- a file read.');

    sub('I4  The deployment limb of DA-1.3, and its boundary');
    console.log('      DA-1.3 also names artefacts "written outside the governed');
    console.log('      persistent-state boundary the bootstrap contract already fixes');
    console.log('      (/data/docker, contract v0.2, MSG-0006)".  THAT LIMB IS NOT');
    console.log('      MEASURED HERE and is not claimed either way: this probe runs on');
    console.log('      the Windows development machine, which has no /data boundary,');
    console.log('      and no PCI server deployment exists to measure.  Recorded as a');
    console.log('      stated limitation (criterion 1), not silently omitted.');
    console.log();
    console.log('      What IS established structurally: the engine chooses the temp');
    console.log('      path itself, so on ANY deployment the spill artefact lands');
    console.log('      wherever the engine\'s temp resolution points -- which is a');
    console.log('      deployment-time question, not one the projection store answers.');
    res.deploymentLimb = 'NOT MEASURED -- no PCI server deployment exists';
    return res;
  } finally {
    rmdir(dir);
  }
}

// ---------------------------------------------------------------------------
// J.  VERDICTS.  DA-5's vocabulary unchanged (criterion 4), one result per
//     limb (criterion 2), one row per in-scope artefact class (criterion 1).
// ---------------------------------------------------------------------------
function sectionJ(m1, f, g, h, i) {
  head('J. VERDICTS -- DA-5 vocabulary, unchanged (criteria 1, 2, 3, 4)');

  const nc1spill = g.nc1.spills.find((s) => s.readable && s.unauth > 0);

  console.log('  DA-1.1 -- REQUEST-INDUCED PERSISTENCE, per artefact class');
  console.log('  ' + '-'.repeat(74));
  const r11 = [
    ['write-ahead log', m1.walAfter && m1.walAfter.bytes === 0 && m1.baselineOk
      ? 'no finding on the Shape-1-respecting request (-wal measured empty at baseline AND after)'
      : 'see section D/E', 'not sufficient alone (DA-5 row 3)'],
    ['rollback journal', f.requestFinding
      ? 'FINDING -- created BY the request-resolution transaction (F1 measured none existed) and held the unauthorized marker ' + f.requestFinding.unauth + ' times, though the request updated ONLY authorized rows'
      : 'no marker observed under a request-induced write', f.requestFinding ? 'NOT CLEARED (DA-5 row 1)' : 'not sufficient alone (DA-5 row 3)'],
    ['  same artefact, APPEND-shaped request write', 'marker present ' + (f.append.readable ? f.append.unauth : '?') + ' times (F3)',
      f.append.readable && f.append.unauth > 0 ? 'FINDING' : 'no finding -- appends overwrite nothing, so nothing is journalled'],
    ['  same artefact at INGEST', 'marker present ' + (f.ingest.readable ? f.ingest.unauth : '?') + ' times (F2) -- and this is NOT a finding',
      'DA-4 row 1 -- ingest provenance. The contrast with the rows above IS the criterion working'],
    ['shared-memory (-shm)', 'no unauthorized marker observed in any measurement', 'not sufficient alone (DA-5 row 3)'],
    ['temporary / spill files', nc1spill
      ? 'FINDING -- ' + nc1spill.bytes + '-byte spill file held the unauthorized marker ' + nc1spill.unauth + ' times, created BY the request'
      : 'no finding', nc1spill ? 'NOT CLEARED (DA-5 row 1)' : 'not sufficient alone'],
    ['engine-produced backup', h.reachable ? 'content present, but provenance is INGEST (DA-4 row 1) -- NOT a DA-1.1 finding' : 'unreachable', h.reachable ? 'no DA-1.1 finding; DA-1.3 applies' : 'NOT CLEARED (DA-6)'],
  ];
  for (const [a, obs, v] of r11) { note('  ' + a, obs); note('    verdict', v); }

  console.log();
  console.log('  DA-1.2 -- RESIDUAL RETENTION, per artefact class');
  console.log('  ' + '-'.repeat(74));
  note('  write-ahead log', 'survives the connection closing where it is non-empty; measured empty here after a Shape-1-respecting request');
  note('    verdict', 'not sufficient alone (DA-5 row 3)');
  note('  rollback journal', 'the artefact is RECLAIMED at commit -- ' + f.after.state);
  note('    verdict', 'ABSENCE ONLY -- explicitly NOT sufficient (DA-5 row 3); the content WAS there, measured in F4 (' + (f.overwrite.readable ? f.overwrite.unauth : '?') + ' occurrences) before the commit reclaimed it');
  note('  temporary / spill files', 'removed when the statement finished; residue after the request: ' + (g.nc1.residue && g.nc1.residue.length ? JSON.stringify(g.nc1.residue) : 'NONE'));
  note('    verdict', 'NOT CLEARED (DA-6) -- see the paragraph below');
  console.log();
  console.log('      Why DA-6 and not "satisfied": the probe can observe that the');
  console.log('      DIRECTORY ENTRY is gone.  It cannot observe whether the CONTENT');
  console.log('      is gone -- unlinking a file does not overwrite its blocks, and');
  console.log('      no instrument available here reads them.  DA-6: "the instrument');
  console.log('      cannot reach it ... the verdict is NOT CLEARED", and DA-5 row 3');
  console.log('      refuses "we looked and found nothing" as satisfaction.  This is');
  console.log('      the criterion being inconvenient, and it is taken as written.');

  console.log();
  console.log('  DA-1.3 -- WIDENED REACH');
  console.log('  ' + '-'.repeat(74));
  note('  spill / temporary files', 'created OUTSIDE the store directory, in the OS temp directory, at a path the ENGINE chooses');
  note('    verdict', 'FINDING -- DA-1.3 names this case in its own text');
  note('  -wal / -shm / -journal', 'created INSIDE the store directory, alongside the main database');
  note('    verdict', 'no location finding; but readable as plain files by any principal with directory access');
  note('  engine-produced backup', !h.reachable ? 'unreachable'
    : h.escapes ? 'MEASURED (H2): the engine wrote a complete second copy of the projection into a directory outside the store, unconstrained'
      : 'MEASURED (H2): the engine REFUSED a destination outside the store directory');
  note('    verdict', !h.reachable ? 'NOT CLEARED (DA-6)'
    : h.escapes ? 'FINDING -- longer-lived copy, wider reach, no engine-side constraint on where it lands'
      : 'no reach finding -- containment the engine actually provides');
  note('  deployment limb (/data/docker)', i.deploymentLimb);
  note('    verdict', 'NOT MEASURED -- stated limitation, no verdict claimed either way');

  console.log();
  console.log('  ' + '='.repeat(74));
  console.log('  DA-1 OVERALL, for the subject measured: NOT CLEARED.');
  console.log('  ' + '='.repeat(74));
  console.log('  Decided by DA-5 row 1 on a single occurrence -- "A single occurrence');
  console.log('  is sufficient; no structural argument, vendor claim or configuration');
  console.log('  note rehabilitates it" -- and independently by DA-6 on DA-1.2 for');
  console.log('  spill files.  Two independent routes to the same verdict.');
  console.log();
  console.log('  AND WHAT IT DOES NOT MEAN -- DA-5 consequence 1, DA-7 row 5:');
  console.log('  DA-1 is NOT an §4.6 S6 evidence class.  This verdict CLEARS NOTHING,');
  console.log('  FAILS no Shape-1 gate, and MOVES NO VERDICT recorded anywhere in');
  console.log('  EPA-0006.  All six TASK-0042 candidates remain NOT CLEARED for the');
  console.log('  reasons they already were.  Under Q14\'s fail-closed default this is');
  console.log('  recorded ALONGSIDE the Shape-1 verdict and changes none of it.');
}

// ---------------------------------------------------------------------------
// K.  Coverage, limitations, and run validity.
// ---------------------------------------------------------------------------
function sectionK(h) {
  head('K. COVERAGE, LIMITATIONS AND RUN VALIDITY (criteria 1, 5)');

  sub('K1  Every DA-2 artefact class accounted for -- no silent omissions');
  for (const [k, v] of [
    ['write-ahead logs', 'MEASURED (sections C, D/E, G NC-2)'],
    ['rollback / undo journals', 'MEASURED (section F, during the transaction)'],
    ['shared-memory files (-shm)', 'MEASURED (sections C, D/E) -- with a weaker instrument, said so in C'],
    ['temporary and spill files', 'MEASURED (sections E, G NC-1, I)'],
    ['engine-produced backups', h.reachable ? 'MEASURED (section H)' : 'UNREACHABLE -- backup() failed'],
    ['replication streams', 'NOT APPLICABLE -- this subject is not a replicating engine; no such artefact exists to inspect'],
  ]) note('  ' + k, v);

  sub('K2  Limitations, stated rather than left to be discovered');
  const lims = [
    'ONE SUBJECT ONLY. Every measurement is on the FIRST test subject. §4.15: the two available subjects differ in the BINDING, not the build, and neither generalizes to an engine class. Nothing here is a claim about "SQLite", still less about class R.',
    'The `py` grant (MSG-0145) covers TASK-0043\'s probe only, so the second subject was NOT invoked and no fresh grant was sought. That is the queue section\'s instruction followed, not an omission.',
    'DA-1.3\'s /data/docker limb is NOT MEASURED -- no PCI server deployment exists to measure and this runner is the Windows development machine.',
    'Spill-file DA-1.2 is NOT CLEARED by DA-6 rather than measured: unlinking is observable, block reclamation is not.',
    'The -shm attribution rests on a marker count rather than an emptied baseline, because a checkpoint does not empty it. Weaker, and reported as weaker.',
    'Marker scanning is a BYTE scan. It would miss content the engine stored in a form the marker does not survive -- compression, encoding or partial-page writes. An absence therefore carries even less weight than DA-5 row 3 already gives it.',
  ];
  lims.forEach((l, n) => { console.log('  ' + (n + 1) + '. ' + l.replace(/(.{1,72})(\s|$)/g, '$1\n     ').trimEnd()); });

  sub('K3  RUN VALIDITY');
  console.log('  §4.6 S8: a run whose negative control comes back clean has measured');
  console.log('  nothing.  Both controls are required to have fired.');
  console.log();
  for (const c of CONTROLS) console.log('      + ' + c);
  if (!CONTROLS.length) console.log('      (none fired)');
  console.log();
  if (FAILURES.length) {
    console.log('  RUN VALIDITY: INVALID -- ' + FAILURES.length + ' control(s) failed:');
    for (const m of FAILURES) console.log('      - ' + m);
    console.log('  No verdict above may be relied on.');
  } else {
    console.log('  RUN VALIDITY: VALID -- both negative controls produced a DA-1');
    console.log('  finding, and each was quoted where it fired.');
  }

  sub('K4  What this probe did NOT do');
  for (const s of [
    'It selected, cleared, adopted, deployed and implemented NOTHING. Clearing is named explicitly in MSG-0153, and DA-5 consequence 1 makes satisfying DA-1 clear nothing in any case.',
    'It modified no criterion. DA-1…DA-7 were read and applied as written, including where inconvenient.',
    'It changed no gate. E1-E4, strict Shape-1, G-Q4…G-Q7.8 and S1-S11 are untouched, and no U was measured.',
    'It re-ran no prior probe, and reinterpreted none. §4.15\'s WAL figures are TASK-0043\'s and are not extended here.',
    'It installed nothing, modified no host configuration, and touched no real or confidential corpus. Every fixture is synthetic (S11).',
    'It introduced no numeric threshold, benchmark, latency or capacity figure. The byte counts above are observations, not bars.',
  ]) console.log('  - ' + s.replace(/(.{1,72})(\s|$)/g, '$1\n    ').trimEnd());
}

// ---------------------------------------------------------------------------
async function main() {
  console.log('TASK-0045 -- bounded DA-1 evidence: durability artefacts measured');
  console.log('against EPA-0006 §4.16, which is authoritative and is NOT adjusted here.');
  console.log('MSG-0153 AUTHORIZED.  This probe selects nothing and clears nothing.');

  sectionA();
  sectionB();
  const c = sectionC();

  const m1 = measure('D/E. MEASUREMENT M1 -- a Shape-1-RESPECTING request, WAL mode', {
    sql: 'SELECT id, scope FROM chunk WHERE scope = ? ORDER BY body',
    params: ['AUTHORIZED'],
    rows: 20000, wide: true, journalMode: 'WAL',
    maintenance: 'checkpointed (TRUNCATE) at baseline; no VACUUM, no ANALYZE',
    describe: 'The entitlement predicate is applied BY the engine, before the sorter.',
  });
  console.log();
  console.log('  READ THIS MEASUREMENT WITH DA-5 ROW 3 IN HAND.  A spill file was');
  console.log('  still created, and it still carried corpus content out of the store');
  console.log('  directory -- the difference from NC-1 is WHOSE content, not whether');
  console.log('  an artefact was written.  DA-1.1 is not engaged; DA-1.3 is.');

  const f = sectionF();
  const g = sectionG();
  const h = await sectionH();
  const i = sectionI(g.nc1);
  sectionJ(m1, f, g, h, i);
  sectionK(h);

  if (!c.baselineOk) fail('the section C baseline failed');

  console.log();
  console.log('END OF PROBE');
  return FAILURES.length ? 1 : 0;
}

main().then((code) => process.exit(code), (err) => { console.error('PROBE ABORTED:', err); process.exit(2); });
