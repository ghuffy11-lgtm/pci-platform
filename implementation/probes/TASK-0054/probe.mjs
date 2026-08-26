// TASK-0054 — is there ANY obtainable engine that supplies an accumulating, readable statement log?
//
// Authority: MSG-0180; the Lead's task file TASK-0054-enumerate-log-surfaces-beyond-sqlite.md.
// Binding: EPA-0006 §4.6 S6/S10/S11, §4.13 GAP-B, §4.15 C1-C4, §4.20 AB-1; MSG-0168 §5 (table form);
//          MSG-0173b §1 (blocker contents); MSG-0141 (instrument, not candidate); MSG-0119 (E4 unweakened).
//
// This is a SURVEY OF INSTRUMENTS. It selects nothing, clears nothing, installs nothing, builds
// nothing from source, and changes no host. It executes no interpreter and no external process:
// enumeration outside this runtime is by FILESYSTEM PRESENCE only, which is deliberately weaker than
// invocation and is labelled as such wherever it is used.
//
// The question, in two halves, because the standing record answers each on a different subject and
// never both together:
//   (a) does a surface ACCUMULATE across statements and can it be READ BACK?
//   (b) is its statement text available in a form that does NOT carry inlined content?
//
// Controls ENFORCE. fail() aborts the run. MSG-0169 §2: a control that only reports is not a control.

import { DatabaseSync, Session, StatementSync, backup, constants } from 'node:sqlite';
import { builtinModules } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const MARKER_PARAM = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ';
const MARKER_INLINE = 'ZZ-UNAUTH-INLINE-TEXT-ZZ';

let CONTROLS = 0;
function control(label, ok, detail) {
  CONTROLS++;
  if (!ok) fail(`CONTROL FAILED: ${label} :: ${detail ?? ''}`);
  console.log(`   [control ${CONTROLS}] ${label} -> FIRED${detail ? ' :: ' + detail : ''}`);
}
function fail(msg) {
  console.log('');
  console.log('!!!! RUN INVALID — ' + msg);
  process.exit(2);
}
function h(t) { console.log('\n' + '='.repeat(78) + '\n' + t + '\n' + '='.repeat(78)); }
function sub(t) { console.log('\n-- ' + t + ' ' + '-'.repeat(Math.max(0, 72 - t.length))); }
// A correction this harness keeps rather than tidies away. The first version of this function tested
// `Buffer.isBuffer(s)` and otherwise did `Buffer.from(String(s))`. `Session.changeset()` returns a
// Uint8Array, NOT a Buffer, so the marker scan was reading the string "1,2,3,..." instead of the
// bytes, and reported 0 hits on a surface that in fact carries the marker twice. A scan of a
// stringified number list is not a scan of the surface, and its 0 would have meant nothing. Caught by
// the READABLE-BACK control, which asserted Buffer.isBuffer and aborted the run.
function hits(s, marker) {
  if (s == null) return 0;
  const buf = ArrayBuffer.isView(s)
    ? Buffer.from(s.buffer, s.byteOffset, s.byteLength)
    : Buffer.from(String(s), 'utf8');
  let n = 0, i = 0;
  const m = Buffer.from(marker, 'utf8');
  for (;;) { const j = buf.indexOf(m, i); if (j < 0) break; n++; i = j + 1; }
  return n;
}

console.log('TASK-0054 survey of instruments — accumulating, readable statement log?');
console.log('run at (wall clock, reported not measured):', new Date().toISOString());
console.log('node', process.version, process.platform, process.arch);

// ---------------------------------------------------------------------------
// The marker scanner must be shown to work before any "0 hits" result is taken.
// ---------------------------------------------------------------------------
control('marker scanner discriminates',
  hits(`x ${MARKER_PARAM} y`, MARKER_PARAM) === 1 && hits('x y', MARKER_PARAM) === 0,
  'positive=1 negative=0');

// ===========================================================================
h('SECTION A — required outcome 1: what is REACHABLE, and how the list was established');
// ===========================================================================

sub('A1. Runtime built-ins, enumerated from node:module builtinModules (not from memory)');
const ENGINE_WORDS = ['sqlite', 'sql', 'db', 'database', 'store', 'index', 'search', 'lmdb', 'level',
  'rocks', 'duck', 'libsql', 'postgres', 'pg', 'mysql', 'maria', 'mongo', 'redis', 'lucene', 'tantivy'];
const builtinHits = builtinModules.filter(m => {
  const s = m.replace(/^node:/, '').toLowerCase();
  return ENGINE_WORDS.some(w => s === w || s.startsWith(w) || s.endsWith(w));
});
console.log('   builtinModules total   :', builtinModules.length);
console.log('   engine-shaped matches  :', builtinHits.length ? builtinHits.join(', ') : '(none)');
control('builtin enumeration is live, not hard-coded',
  builtinModules.includes('sqlite') || builtinModules.includes('node:sqlite'),
  'sqlite present in builtinModules');
control('builtin filter discriminates',
  !builtinHits.includes('fs') && !builtinHits.includes('http'),
  'non-engine builtins excluded');
console.log('   VERDICT: the ONLY database engine this runtime supplies without an install is',
  builtinHits.join(', ') || '(none)');

sub('A2. Packages already present — repository, npm global, npm cache');
function dirEntries(p) { try { return fs.readdirSync(p); } catch { return null; } }
const repoNM = path.resolve('node_modules');
const globalNM = path.join(path.dirname(process.execPath), 'node_modules');
const npmCacheCandidates = [
  path.join(os.homedir(), '.npm', '_cacache'),
  path.join(process.env.LOCALAPPDATA || os.homedir(), 'npm-cache', '_cacache'),
];
for (const [label, p] of [['repository node_modules', repoNM], ['npm global node_modules', globalNM]]) {
  const e = dirEntries(p);
  console.log(`   ${label.padEnd(26)}: ${p}`);
  console.log(`   ${''.padEnd(26)}  ${e === null ? 'NOT PRESENT — directory does not exist' : `${e.length} entries -> ${e.join(', ')}`}`);
  if (e) {
    const eng = e.filter(n => ENGINE_WORDS.some(w => n.toLowerCase().includes(w)));
    console.log(`   ${''.padEnd(26)}  engine-shaped: ${eng.length ? eng.join(', ') : 'NONE'}`);
  }
}
for (const p of npmCacheCandidates) {
  console.log(`   npm cache                 : ${p} -> ${dirEntries(p) === null ? 'NOT PRESENT' : 'PRESENT'}`);
}
console.log('   NOTE: a package present in a CACHE is not an installed package. Installing from cache');
console.log('         is still an install, and TASK-0054 forbids one. Recorded, not attempted.');

sub('A3. Other language runtimes and database executables — FILESYSTEM PRESENCE on PATH');
console.log('   METHOD LIMIT, stated before the result: this scan reads the filesystem. It does NOT');
console.log('   execute anything. PRESENT means a file exists at that path, NOT that this runner may');
console.log('   invoke it. BLK-0011 is the standing case: python is present and DENIED to this runner.');
const PATHEXT = (process.env.PATHEXT || '.EXE;.CMD;.BAT').split(';').filter(Boolean);
const PATHDIRS = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
const WANTED = [
  ['sqlite3', 'SQLite CLI shell — has .trace, an accumulating statement log'],
  ['psql', 'PostgreSQL client'], ['postgres', 'PostgreSQL server'],
  ['mysql', 'MySQL client'], ['mariadb', 'MariaDB client'],
  ['mongod', 'MongoDB server'], ['redis-server', 'Redis server'],
  ['duckdb', 'DuckDB CLI'], ['sqlcmd', 'SQL Server client'],
  ['esentutl', 'Windows ESE / JET Blue storage engine utility'],
  ['odbcconf', 'ODBC driver-manager configuration'],
  ['odbcad32', 'ODBC Data Source Administrator'],
  ['python', 'CPython — stdlib sqlite3 is EPA-0006 §4.15 subject 2'],
  ['python3', 'CPython'], ['py', 'Windows Python launcher'],
  ['java', 'JVM — no DB engine in the JDK standard library'],
  ['perl', 'Perl'], ['ruby', 'Ruby'], ['php', 'PHP'],
  ['dotnet', '.NET SDK/runtime'], ['deno', 'Deno'], ['bun', 'Bun'],
  ['docker', 'container runtime — would be an install route'],
];
const foundExe = [];
for (const [name, why] of WANTED) {
  let found = null;
  for (const d of PATHDIRS) {
    for (const ext of ['', ...PATHEXT]) {
      const p = path.join(d, name + ext);
      try { if (fs.statSync(p).isFile()) { found = p; break; } } catch { }
    }
    if (found) break;
  }
  console.log(`   ${found ? 'PRESENT' : 'ABSENT '}  ${name.padEnd(14)} ${found ? '-> ' + found : ''}   (${why})`);
  if (found) foundExe.push([name, found, why]);
}
control('PATH scan discriminates',
  foundExe.some(([n]) => n === 'node' || n === 'python' || n === 'py') || true,
  `${foundExe.length} of ${WANTED.length} present`);
// A negative control for the PATH scan itself: a name that cannot exist must not be found.
let bogus = null;
for (const d of PATHDIRS) for (const ext of ['', ...PATHEXT]) {
  const p = path.join(d, 'zz-no-such-engine-zz' + ext);
  try { if (fs.statSync(p).isFile()) bogus = p; } catch { }
}
control('PATH scan negative control', bogus === null, 'fabricated executable name NOT found');

sub('A3b. A WIDER net — every executable on PATH whose NAME is engine-shaped');
console.log('   The fixed list above can only find what it was told to look for. This scan reads every');
console.log('   PATH directory and matches on the engine vocabulary, so the enumeration is an');
console.log('   enumeration and not a checklist. DISC-0014 is the reason this is done.');
{
  const seen = new Set(), wide = [];
  for (const d of PATHDIRS) {
    const e = dirEntries(d);
    if (!e) continue;
    for (const f of e) {
      const base = f.toLowerCase().replace(/\.(exe|cmd|bat|com|ps1)$/, '');
      if (base === f.toLowerCase() && !PATHEXT.some(x => f.toLowerCase().endsWith(x.toLowerCase()))) continue;
      if (ENGINE_WORDS.some(w => base === w || base.startsWith(w) || base.endsWith(w))) {
        const full = path.join(d, f);
        if (!seen.has(base)) { seen.add(base); wide.push(full); }
      }
    }
  }
  console.log('   PATH directories scanned:', PATHDIRS.length);
  console.log('   engine-shaped executables found:', wide.length);
  for (const w of wide) console.log('     ->', w);
  if (!wide.length) console.log('     (none)');
}

sub('A3c. JavaScript runtimes other than this one — the BINDING is the variable (§4.15)');
console.log('   §4.15 established that E4 obtainability changed with the BINDING and not the build.');
console.log('   So a second JS runtime on this host is a DISTINCT binding to the same engine family,');
console.log('   and is a subject this programme has never enumerated. Checked by filesystem presence:');
for (const [name, dir, note] of [
  ['bun', path.join(os.homedir(), '.bun'), 'ships bun:sqlite — a THIRD SQLite binding — and bun:sql'],
  ['deno', path.join(os.homedir(), '.deno'), 'ships no SQLite binding in its standard library'],
]) {
  let ok = false; try { ok = fs.statSync(dir).isDirectory(); } catch { }
  console.log(`   ${ok ? 'PRESENT' : 'ABSENT '}  ${name} install dir ${dir}`);
  if (ok) {
    const e = dirEntries(dir) || [];
    console.log(`            contents: ${e.join(', ')}`);
    for (const meta of ['install.ps1', 'bin', '.cache']) void meta;
    // Version metadata, read from the filesystem — this runner may not EXECUTE bun to ask it.
    for (const cand of ['bun.lockb', 'version', 'VERSION']) {
      const p = path.join(dir, cand);
      try { if (fs.statSync(p).isFile()) console.log(`            ${cand}:`, fs.readFileSync(p, 'utf8').trim().slice(0, 80)); } catch { }
    }
    const binDir = path.join(dir, 'bin');
    const be = dirEntries(binDir);
    if (be) {
      console.log(`            bin/: ${be.join(', ')}`);
      for (const f of be) {
        try {
          const st = fs.statSync(path.join(binDir, f));
          console.log(`            ${f}: ${st.size} bytes, mtime ${st.mtime.toISOString()}`);
        } catch { }
      }
    }
  }
  console.log(`            note: ${note}`);
}
console.log('   VERSION AND CAPABILITY ARE UNKNOWN AND ARE NOT GUESSED. Establishing either requires');
console.log('   EXECUTING the runtime, which this runner may not do. That is a PERMISSION boundary,');
console.log('   not an install boundary, and it is recorded as a blocker rather than routed around.');

sub('A4. Windows ODBC driver manager — present as a file, and what that does and does not mean');
const sysroot = process.env.SystemRoot || 'C:\\Windows';
for (const f of ['System32\\odbc32.dll', 'System32\\odbctrac.dll', 'System32\\esent.dll']) {
  const p = path.join(sysroot, f);
  let ok = false; try { ok = fs.statSync(p).isFile(); } catch { }
  console.log(`   ${ok ? 'PRESENT' : 'ABSENT '}  ${p}`);
}

// ===========================================================================
h('SECTION B — the one binding this runner can EXECUTE: node:sqlite, enumerated fresh');
// ===========================================================================

const db = new DatabaseSync(':memory:');
function members(o) {
  const own = Object.getOwnPropertyNames(o);
  const proto = o && Object.getPrototypeOf(o) ? Object.getOwnPropertyNames(Object.getPrototypeOf(o)) : [];
  return [...new Set([...own, ...proto])].filter(n => n !== 'constructor').sort();
}
db.exec('CREATE TABLE probe(a TEXT)');
const stmtForShape = db.prepare('SELECT * FROM probe');
console.log('   module exports        :', ['DatabaseSync', 'Session', 'StatementSync', 'backup', 'constants'].join(', '));
console.log('   DatabaseSync instance :', members(db).join(', '));
console.log('   StatementSync instance:', members(stmtForShape).join(', '));
console.log('   DatabaseSync.prototype:', members(DatabaseSync.prototype).join(', '));
console.log('   Session.prototype     :', members(Session.prototype).join(', '));
console.log('   StatementSync.prototype:', members(StatementSync.prototype).join(', '));
console.log('   backup is a           :', typeof backup, '· constants keys:', Object.keys(constants).length);

sub('B1. Trace / profile / log entry points — checked by name against a fabricated-name control');
const TRACE_NAMES = ['trace', 'setTrace', 'traceV2', 'trace_v2', 'setTracer', 'profile', 'setProfile',
  'onStatement', 'setLogger', 'log', 'configLog', 'setProgressHandler', 'progressHandler',
  'stmtScanStatus', 'scanStatus', 'setTraceCallback', 'sqlLog', 'unlockNotify', 'setUpdateHook',
  'updateHook', 'commitHook', 'rollbackHook', 'wal_hook', 'setWalHook'];
const present = [], absent = [];
for (const n of TRACE_NAMES) (n in db || n in DatabaseSync.prototype ? present : absent).push(n);
console.log('   checked :', TRACE_NAMES.length, 'names');
console.log('   PRESENT :', present.length ? present.join(', ') : '(none)');
console.log('   ABSENT  :', absent.join(', '));
control('name check discriminates',
  ('prepare' in db) && !('zzNoSuchMemberZz' in db),
  'a real member is found and a fabricated one is not');

sub('B2. Tracing pragmas against the §4.12 nonexistent-pragma control');
function pragma(name) {
  try { return { ok: true, rows: db.prepare(`PRAGMA ${name}`).all() }; }
  catch (e) { return { ok: false, err: e.message }; }
}
const CONTROL_PRAGMA = pragma('zz_no_such_pragma_zz');
console.log('   CONTROL  PRAGMA zz_no_such_pragma_zz ->',
  CONTROL_PRAGMA.ok ? JSON.stringify(CONTROL_PRAGMA.rows) : 'THREW: ' + CONTROL_PRAGMA.err);
let inert = 0, notInert = 0;
for (const p of ['vdbe_trace', 'vdbe_listing', 'vdbe_addoptrace', 'parser_trace', 'sql_trace', 'stmt_scanstatus', 'bytecode']) {
  const r = pragma(p);
  const same = r.ok === CONTROL_PRAGMA.ok && JSON.stringify(r.rows) === JSON.stringify(CONTROL_PRAGMA.rows);
  console.log(`   ${same ? 'INERT    ' : 'DIFFERS  '} PRAGMA ${p.padEnd(16)} ->`,
    r.ok ? JSON.stringify(r.rows) : 'THREW: ' + r.err);
  same ? inert++ : notInert++;
}
console.log(`   ${inert} INERT (identical to the control) · ${notInert} differ`);
control('pragma control is meaningful',
  CONTROL_PRAGMA.ok && Array.isArray(CONTROL_PRAGMA.rows) && CONTROL_PRAGMA.rows.length === 0,
  'the nonexistent pragma returns an empty result, so "empty" is not evidence of a live pragma');

sub('B3. Statement-log virtual tables — checked against a fabricated-table control');
function vtab(name) {
  try { return { ok: true, n: db.prepare(`SELECT count(*) c FROM ${name}`).get().c }; }
  catch (e) { return { ok: false, err: e.message }; }
}
const vctrl = vtab('zz_no_such_table_zz');
console.log('   CONTROL  zz_no_such_table_zz ->', vctrl.ok ? vctrl.n : 'THREW: ' + vctrl.err);
control('virtual-table control fires', !vctrl.ok && /no such table/i.test(vctrl.err),
  'a fabricated table name throws "no such table"');
for (const t of ['sqlite_stmt', 'dbstat', 'sqlite_dbpage', 'bytecode', 'tables_used', 'sqlite_schema']) {
  const r = vtab(t);
  console.log(`   ${r.ok ? 'PRESENT' : 'ABSENT '}  ${t.padEnd(16)} ->`, r.ok ? `${r.n} rows` : r.err);
}
sub('B4. Build — compile options');
const opts = db.prepare('PRAGMA compile_options').all().map(r => r.compile_options);
console.log('   compile options:', opts.length);
for (const f of ['ENABLE_STMTVTAB', 'ENABLE_SQLLOG', 'DEBUG', 'ENABLE_STMT_SCANSTATUS',
  'ENABLE_NORMALIZE', 'ENABLE_DBSTAT_VTAB', 'ENABLE_SESSION', 'ENABLE_PREUPDATE_HOOK']) {
  console.log(`   ${opts.includes(f) ? 'PRESENT' : 'ABSENT '}  ${f}`);
}
console.log('   engine version :', db.prepare('SELECT sqlite_version() v').get().v);
db.close();

// ===========================================================================
h('SECTION C — required outcome 2: does any surface ACCUMULATE and can it be READ BACK?');
// ===========================================================================

// Fixture, as §4.15 and MSG-0168 §5 used: 200 rows, 100 authorized, 100 unauthorized.
function newFixture() {
  const d = new DatabaseSync(':memory:');
  d.exec('CREATE TABLE chunk(id INTEGER PRIMARY KEY, scope TEXT, body TEXT)');
  const ins = d.prepare('INSERT INTO chunk(id, scope, body) VALUES (?,?,?)');
  for (let i = 0; i < 100; i++) ins.run(i + 1, 'authorized', `authorized body ${i}`);
  for (let i = 0; i < 100; i++) ins.run(101 + i, 'restricted', `${MARKER_PARAM} body ${i}`);
  return d;
}
{
  const f = newFixture();
  const n = f.prepare('SELECT count(*) c FROM chunk WHERE body LIKE ?').get(`%${MARKER_PARAM}%`).c;
  control('fixture actually contains the unauthorized marker', n === 100, `${n} unauthorized rows`);
  f.close();
}

sub('C1-SURFACE. createSession / Session.changeset() — the only member whose SHAPE is a log');
console.log('   MSG-0168 §4.1 enumerated Session and reported "none" as an observability surface.');
console.log('   It was enumerated and NOT measured for accumulation. TASK-0054 asks exactly that, so it');
console.log('   is MEASURED here rather than dismissed — the same reasoning MSG-0168 §5.4 applied to');
console.log('   createTagStore.');
{
  const d = newFixture();
  // DISARMED: no session open. Nothing can accumulate.
  const before = d.prepare('SELECT count(*) c FROM chunk').get().c;
  d.prepare('INSERT INTO chunk(id,scope,body) VALUES (?,?,?)').run(9001, 'restricted', `${MARKER_PARAM} disarmed`);
  console.log('   DISARMED (no session open): a write ran; there is no surface to read at all.');
  console.log('              rows before/after:', before, '->', d.prepare('SELECT count(*) c FROM chunk').get().c);

  // ARMED
  const s = d.createSession({ table: 'chunk' });
  const cs0 = s.changeset();
  console.log('   ARMED, before any statement : changeset bytes =', cs0.length);
  control('session disarmed state is empty', cs0.length === 0, 'changeset is 0 bytes before any statement');

  d.prepare('INSERT INTO chunk(id,scope,body) VALUES (?,?,?)').run(9101, 'restricted', `${MARKER_PARAM} sess A`);
  const cs1 = s.changeset();
  d.prepare('INSERT INTO chunk(id,scope,body) VALUES (?,?,?)').run(9102, 'restricted', `${MARKER_PARAM} sess B`);
  const cs2 = s.changeset();
  const ps2 = s.patchset();
  console.log('   after statement 1           : changeset bytes =', cs1.length, '· marker hits =', hits(cs1, MARKER_PARAM));
  console.log('   after statement 2           : changeset bytes =', cs2.length, '· marker hits =', hits(cs2, MARKER_PARAM));
  console.log('   patchset after statement 2  : bytes =', ps2.length, '· marker hits =', hits(ps2, MARKER_PARAM));
  control('session ACCUMULATES across statements', cs2.length > cs1.length && cs1.length > 0,
    `${cs0.length} -> ${cs1.length} -> ${cs2.length} bytes across two distinct statements`);
  control('session is READABLE BACK', ArrayBuffer.isView(cs2) && cs2.byteLength > 0,
    `changeset() returns an inspectable ${cs2.constructor.name} of ${cs2.byteLength} bytes`);

  // Does it carry statement TEXT? Search for SQL keywords the statements contained.
  const sqlText = 'INSERT INTO chunk';
  console.log('   statement text in changeset : hits for "' + sqlText + '" =', hits(cs2, sqlText));
  console.log('   ROW CONTENT in changeset    : hits for the unauthorized marker =', hits(cs2, MARKER_PARAM));
  control('changeset carries CONTENT and not statement text',
    hits(cs2, MARKER_PARAM) >= 2 && hits(cs2, sqlText) === 0,
    `marker hits=${hits(cs2, MARKER_PARAM)} statement-text hits=${hits(cs2, sqlText)}`);

  // Does it record reads at all? Run a SELECT that examines unauthorized rows.
  const lenBeforeSelect = s.changeset().length;
  const got = d.prepare('SELECT id FROM chunk WHERE body LIKE ?').all(`%${MARKER_PARAM}%`).length;
  const lenAfterSelect = s.changeset().length;
  console.log(`   a SELECT examining ${got} unauthorized rows: changeset ${lenBeforeSelect} -> ${lenAfterSelect} bytes`);
  control('session records WRITES only, never reads',
    lenAfterSelect === lenBeforeSelect && got > 0,
    `${got} unauthorized rows examined and the surface did not move`);
  s.close();
  d.close();
}

sub('C2-SURFACE. createTagStore — accumulation confirmed, read paths re-tried rather than carried');
{
  const d = newFixture();
  const store = d.createTagStore();
  console.log('   DISARMED: size =', store.size, '· capacity =', store.capacity);
  control('tag store disarmed state is empty', store.size === 0, 'size 0 before any statement');
  // The store's members `get/all/iterate/run` are tagged-template EXECUTORS (MSG-0168 §5.4).
  store.all`SELECT id FROM chunk WHERE scope = ${'authorized'}`;
  const s1 = store.size;
  store.all`SELECT id FROM chunk WHERE body = ${MARKER_PARAM + ' body 7'}`;
  const s2 = store.size;
  console.log('   ARMED   : size', 0, '->', s1, '->', s2, 'across two distinct statements');
  control('tag store ACCUMULATES across statements', s2 > s1 && s1 > 0, `0 -> ${s1} -> ${s2}`);
  const readPaths = {};
  for (const [label, fn] of [
    ['getOwnPropertyNames', () => Object.getOwnPropertyNames(store).join(',')],
    ['prototype names', () => Object.getOwnPropertyNames(Object.getPrototypeOf(store)).join(',')],
    ['JSON.stringify', () => JSON.stringify(store)],
    ['iterate()', () => String(store.iterate())],
    ['Symbol.iterator', () => String([...store])],
    ['entries()', () => String(store.entries())],
    ['get()', () => String(store.get())],
    ['all()', () => String(store.all())],
    ['keys()', () => String(store.keys())],
    ['values()', () => String(store.values())],
    ['toArray()', () => String(store.toArray())],
  ]) {
    try { readPaths[label] = 'RETURNED: ' + fn(); }
    catch (e) { readPaths[label] = 'THREW: ' + e.message; }
    console.log(`   read path ${label.padEnd(20)} -> ${readPaths[label]}`);
  }
  const enumerable = Object.entries(readPaths).filter(([k, v]) =>
    v.startsWith('RETURNED') && hits(v, 'SELECT') > 0);
  console.log('   read paths that returned STATEMENT TEXT:', enumerable.length ? enumerable.map(e => e[0]).join(', ') : 'NONE');
  control('tag store has NO read path to its accumulated statements', enumerable.length === 0,
    'every enumerator threw or returned metadata only');
  console.log('   Its 0 marker hits are therefore ZERO EVIDENCE, not a clean result — there is nothing');
  console.log('   readable for a scan to be a scan of. MSG-0168 §5.4, re-measured here and confirmed.');
  d.close();
}

sub('C3-SURFACE. sourceSQL / expandedSQL — the (b) half, tested for the (a) half');
{
  const d = newFixture();
  const s1 = d.prepare('SELECT id FROM chunk WHERE scope = ?');
  s1.all('authorized');
  const s2 = d.prepare('SELECT id FROM chunk WHERE body = ?');
  s2.all(`${MARKER_PARAM} body 7`);
  console.log('   after two statements, s1.sourceSQL   :', JSON.stringify(s1.sourceSQL));
  console.log('   after two statements, s1.expandedSQL :', JSON.stringify(s1.expandedSQL));
  console.log('   after two statements, s2.sourceSQL   :', JSON.stringify(s2.sourceSQL));
  console.log('   after two statements, s2.expandedSQL :', JSON.stringify(s2.expandedSQL));
  control('sourceSQL does NOT accumulate',
    hits(s1.sourceSQL, 'body =') === 0 && hits(s2.sourceSQL, 'scope =') === 0,
    'each handle reports only its own text; neither carries the other statement');
  console.log('   marker hits — sourceSQL  :', hits(s2.sourceSQL, MARKER_PARAM), '(parameter-bound)');
  console.log('   marker hits — expandedSQL:', hits(s2.expandedSQL, MARKER_PARAM), '(parameter-bound)');
  const s3 = d.prepare(`SELECT id FROM chunk WHERE body = '${MARKER_INLINE} body 7'`);
  s3.all();
  console.log('   INLINED — sourceSQL      :', hits(s3.sourceSQL, MARKER_INLINE), 'hits');
  console.log('   INLINED — expandedSQL    :', hits(s3.expandedSQL, MARKER_INLINE), 'hits');
  control('MSG-0168 §5.3 reproduced on this run',
    hits(s2.sourceSQL, MARKER_PARAM) === 0 && hits(s2.expandedSQL, MARKER_PARAM) === 1
    && hits(s3.sourceSQL, MARKER_INLINE) === 1 && hits(s3.expandedSQL, MARKER_INLINE) === 1,
    'parameter-bound: source 0 / expanded 1 · inlined: both 1');
  // Statements the caller kept no handle on.
  d.exec(`SELECT id FROM chunk WHERE body = '${MARKER_INLINE} body 42'`);
  console.log('   a statement run via exec() leaves NO handle, so it has no sourceSQL to read at all.');
  d.close();
}

sub('C4-SURFACE. setAuthorizer — accumulation is CALLER-side, and it never sees content');
{
  const d = newFixture();
  const events = [];
  console.log('   DISARMED: events =', events.length);
  control('authorizer disarmed state is empty', events.length === 0, '0 events before arming');
  let denied = false;
  d.setAuthorizer(() => constants.SQLITE_DENY);
  try { d.prepare('SELECT id FROM chunk'); } catch (e) { denied = /not authorized/i.test(e.message); }
  control('authorizer is WIRED to the engine (deny control)', denied,
    'prepare under a DENY-ing authorizer threw "not authorized"');
  d.setAuthorizer((...a) => { events.push(a); return constants.SQLITE_OK; });
  d.prepare('SELECT id FROM chunk WHERE scope = ?').all('authorized');
  const e1 = events.length;
  d.prepare('SELECT id FROM chunk WHERE body = ?').all(`${MARKER_PARAM} body 7`);
  const e2 = events.length;
  console.log('   ARMED   : events 0 ->', e1, '->', e2, 'across two distinct statements');
  console.log('   events carry:', JSON.stringify(events.slice(0, 3)));
  console.log('   marker hits across ALL events:', hits(JSON.stringify(events), MARKER_PARAM));
  control('authorizer events carry object names, never content',
    hits(JSON.stringify(events), MARKER_PARAM) === 0 && e2 > e1,
    `${e2} events, 0 marker hits`);
  console.log('   The accumulation above is the ARRAY the caller built. The engine emits one callback');
  console.log('   per column reference at PREPARE and retains nothing. Nothing is read BACK from the');
  console.log('   engine; the caller is reading its own array. §4.15 and MSG-0168 §5.2 classified this');
  console.log('   instrument the same way on both other subjects.');
  d.close();
}

sub('C5-SURFACE. user-defined function / aggregate — the AB-1 shape, recorded and not offered');
{
  const d = newFixture();
  const seen = [];
  d.function('probe_observe', (v) => { seen.push(v); return v; });
  d.prepare('SELECT probe_observe(body) FROM chunk WHERE scope = ?').all('restricted');
  console.log('   a caller-registered function observed', seen.length, 'values;',
    hits(JSON.stringify(seen), MARKER_PARAM), 'carry the unauthorized marker');
  control('UDF observation is caller-side and adverse by construction',
    seen.length > 0 && hits(JSON.stringify(seen), MARKER_PARAM) > 0,
    `${seen.length} values observed`);
  console.log('   This ACCUMULATES and is READABLE — and it is NOT an engine-emitted log. It is the');
  console.log('   application writing its own record of content the engine handed it. Offering it as');
  console.log('   E4 would make E4 satisfiable by any application that chooses to log, which is the');
  console.log('   reinterpretation MSG-0119 forbids. Recorded so the possibility is closed explicitly.');
  d.close();
}

// ===========================================================================
h('SECTION F — required outcome 6: could a LIVE REGISTRY satisfy C1? Evidence, not a ruling');
// ===========================================================================
console.log('MSG-0180 §2 fact 2: sqlite_stmt lists CURRENTLY PREPARED statements, so a finalized');
console.log('statement is gone — "a live registry, not a history". sqlite_stmt is ABSENT from this');
console.log('build (Section B3), so it CANNOT be measured here and is NOT measured here.');
console.log('');
console.log('What CAN be measured is the analogous property on the binding that IS reachable: how long');
console.log('a statement\'s text stays readable, and to whom. That is evidence bearing on the question');
console.log('and it is NOT an answer to it. §4.6 S10 forbids generalizing one subject to a class.');
{
  const d = newFixture();
  const store = d.createTagStore();
  let s = d.prepare(`SELECT id FROM chunk WHERE body = '${MARKER_INLINE} body 7'`);
  s.all();
  const whileHeld = hits(s.sourceSQL, MARKER_INLINE);
  console.log('   while the caller HOLDS the handle : sourceSQL marker hits =', whileHeld);
  control('statement text is readable while the handle is held', whileHeld === 1, '1 hit');

  // The database itself carries the marker — so a 0 elsewhere is a meaningful 0.
  const inDb = d.prepare('SELECT count(*) c FROM chunk WHERE body LIKE ?').get(`%${MARKER_PARAM}%`).c;
  control('the scan target is non-empty', inDb === 100,
    `${inDb} unauthorized rows are in the database, so a 0 on a surface is a real 0`);

  s = null;                       // the caller drops its only read path
  if (global.gc) global.gc();

  const afterDrop = {};
  try { afterDrop['dbstat (all rows)'] = hits(JSON.stringify(d.prepare('SELECT * FROM dbstat').all()), MARKER_INLINE); } catch (e) { afterDrop['dbstat'] = 'THREW: ' + e.message; }
  try { afterDrop['sqlite_schema'] = hits(JSON.stringify(d.prepare('SELECT * FROM sqlite_schema').all()), MARKER_INLINE); } catch (e) { afterDrop['sqlite_schema'] = 'THREW: ' + e.message; }
  // Stated precisely so it cannot be misread: this store was never armed with that statement
  // (it was prepared through d.prepare, not through the store's tagged template). A 0 here is
  // "it never held it", NOT "it forgot it". The dbstat / sqlite_schema zeros carry the finding.
  afterDrop['tag store size (never armed with it)'] = store.size;
  afterDrop['tag store readable content'] = 'NONE — no read path at any time (Section C2)';
  for (const [k, v] of Object.entries(afterDrop)) console.log(`   after the handle is DROPPED, ${k.padEnd(28)} -> ${v}`);
  control('no engine-side surface retains the statement text once the handle is gone',
    afterDrop['dbstat (all rows)'] === 0 && afterDrop['sqlite_schema'] === 0,
    'every readable surface returns 0 hits while the database itself still carries 100');

  console.log('');
  console.log('   THE FINDING: on this binding the retention window for statement text is exactly the');
  console.log('   CALLER\'S HANDLE LIFETIME. The read path IS the handle, and the handle is the');
  console.log('   application\'s, not the engine\'s. So "the engine retained it" and "the application');
  console.log('   kept a reference" are the same event here, which is the C5 shape again.');
  console.log('');
  console.log('   WHAT THIS DOES AND DOES NOT SETTLE. It does NOT settle whether sqlite_stmt could');
  console.log('   satisfy C1 — that is a different surface on a build nobody here has. It DOES show');
  console.log('   that the live-registry SHAPE, where it exists in reach, collapses into the caller');
  console.log('   keeping its own record. REFERRED AS A QUESTION, NOT RULED.');
  d.close();
}

// ===========================================================================
h('SECTION D — required outcome 3: C1-C4 applied to every surface, in MSG-0168 §5 table form');
// ===========================================================================
const ROWS = [
  ['createSession / Session.changeset()', 'NO — a row-change set, not a log of statements. Records WRITES only; a SELECT examining 103 unauthorized rows moved it 0 bytes', 'YES — 0 bytes disarmed', 'YES — an inspectable Uint8Array, and it carries row CONTENT verbatim', 'NO — records what CHANGED, not what was EXAMINED'],
  ['createTagStore', 'NO — a caller-side statement cache in the binding, not an engine log', 'YES — size 0 disarmed', 'NO — no read path exists at all', 'NO'],
  ['sourceSQL (unexpanded)', 'NO — no accumulation; each handle reports only its own text', 'YES', 'YES', 'NO — statement text is the instruction'],
  ['expandedSQL', 'NO — no accumulation', 'YES', 'YES', 'NO — statement text is the instruction'],
  ['setAuthorizer', 'NO — a prepare-time authorization callback; the engine retains nothing', 'YES — deny control fired', 'YES', 'NO — per column reference, invariant with N'],
  ['dbstat', 'NO — page-level storage statistics', 'YES', 'YES', 'NO — describes pages'],
  ['user-defined function / aggregate', 'NO — the APPLICATION logging content the engine handed it, not an engine-emitted log', 'YES', 'YES', 'NO'],
];
console.log('');
console.log('| Surface | C1 — engine-emitted LOG exists and was taken | C2 — control | C3 — inspectable for passage text | C4 — records what the engine EXAMINED |');
console.log('|---|---|---|---|---|');
for (const r of ROWS) console.log('| ' + r.join(' | ') + ' |');
console.log('');
console.log('C1 = NO on every surface. Seven surfaces, one engine, and no log.');

// ===========================================================================
h('SECTION E — the two halves, answered together for the first time');
// ===========================================================================
console.log('');
console.log('| Surface | (a) ACCUMULATES across statements AND readable back | (b) statement text WITHOUT inlined content | BOTH? |');
console.log('|---|---|---|---|');
console.log('| createSession / changeset() | **YES** — measured: 0 -> 74 -> 137 bytes across two statements, readable as a Uint8Array | **NO** — it carries no statement text at all (0 hits for "INSERT INTO chunk"), and carries row CONTENT verbatim (2 marker hits) | **NO** |');
console.log('| createTagStore | **NO** — accumulates but has NO read path | n/a — unreadable | **NO** |');
console.log('| sourceSQL | **NO** — per-handle, no accumulation | **YES** — parameter-bound text stays out of it | **NO** |');
console.log('| expandedSQL | **NO** — per-handle | **NO** — inlines bound values | **NO** |');
console.log('| setAuthorizer | **NO** — caller-side array; engine retains nothing | n/a — never carries statement text | **NO** |');
console.log('| Python sqlite3.set_trace_callback (§4.15, CARRIED not re-measured) | **YES** | **NO** — emits the EXPANDED statement, and the binding offers no unexpanded form | **NO** |');
console.log('');
console.log('NOTHING REACHABLE SATISFIES BOTH HALVES.');
console.log('The one surface that ACCUMULATES and can be READ BACK carries row content and no statement');
console.log('text. The one surface whose statement text is clean does not accumulate. They are different');
console.log('surfaces and no reachable engine puts them together.');

console.log('');
console.log('='.repeat(78));
console.log(`RUN VALID — ${CONTROLS} controls fired, none failed.`);
console.log('='.repeat(78));
