// TASK-0050 part 2 — exercise every surface part 1 found, disarmed before armed, then apply
// §4.15's adversity probe and its C1–C4 conditions to each.
//
// Part 1 (probe.mjs) enumerated the surface. It found TWO members that §4.12 gap 1's table did
// not report on this subject:
//
//   * DatabaseSync.setAuthorizer          — the same class of surface §4.15 measured on the
//                                           second subject and classified "NO — a counter, not
//                                           a log; prepare-time, per column reference"
//   * StatementSync.sourceSQL / .expandedSQL
//                                         — the UNEXPANDED and EXPANDED statement text, exposed
//                                           as separate accessors
//
// The second pair is the substance. §4.15's adverse finding was caused by the trace emitting the
// EXPANDED statement. Whether obtainability and adversity are SEPARABLE for statement surfaces is
// the question the task file says to REFER rather than resolve — and it cannot be referred
// honestly without measuring whether the engine can produce the unexpanded form at all.
//
// Nothing here selects, adopts, ranks, clears or generalizes. No gate is changed. The subject is
// an evidence instrument (MSG-0141).

import { DatabaseSync } from 'node:sqlite';

const MARK_PARAM  = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ';
const MARK_INLINE = 'ZZ-UNAUTH-INLINE-TEXT-ZZ';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const hr  = (t) => { say(''); say('='.repeat(94)); say(t); say('='.repeat(94)); };
const sub = (t) => { say(''); say('--- ' + t + ' ' + '-'.repeat(Math.max(0, 88 - t.length))); };
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: `${e.name}: ${e.message}` }; } };

function fixture(db, nUnauthorized = 100) {
  db.exec(`CREATE TABLE chunk (id INTEGER PRIMARY KEY, scope TEXT NOT NULL, body TEXT NOT NULL)`);
  const ins = db.prepare(`INSERT INTO chunk (id, scope, body) VALUES (?, ?, ?)`);
  for (let i = 0; i < nUnauthorized; i++) ins.run(i + 1, 'authorized', `authorized body ${i}`);
  for (let i = 0; i < nUnauthorized; i++) ins.run(i + 1 + nUnauthorized, 'unauthorized', `${MARK_PARAM} body ${i}`);
  return nUnauthorized * 2;
}

const count = (haystack, needle) => (haystack.match(new RegExp(needle, 'g')) || []).length;

hr('TASK-0050 part 2 · the surfaces exercised · disarmed before armed · §4.15 conditions applied');
say('subject: SQLite via node:sqlite — the subject every Shape-1 measurement was taken on');
say('no install · no subprocess · no network · in-memory database only');

// =============================================================================================
// A — setAuthorizer
// =============================================================================================
hr('A — setAuthorizer');

sub('A.0  CONTROL — is the instrument actually WIRED to the engine, or is it a no-op?');
say('   Without this, "the authorizer reported nothing" and "the authorizer was never running"');
say('   are the same observation — F15\'s rule, applied to a callback instead of a pragma.');
say('   The control: an authorizer that DENIES must make a statement FAIL to prepare. A no-op');
say('   cannot do that. Kept structurally separate (MSG-0156).');
{
  const c = new DatabaseSync(':memory:');
  fixture(c, 5);
  const SQLITE_DENY = 1;
  c.setAuthorizer(() => SQLITE_DENY);
  const denied = attempt(() => c.prepare('SELECT body FROM chunk').all());
  say(`      prepare under a DENY-ing authorizer threw: ${!denied.ok}${denied.ok ? '' : ' — ' + denied.error}`);
  say(`      -> instrument is ${!denied.ok ? 'WIRED TO THE ENGINE' : 'NOT WIRED — every result below would be void'}`);
  c.close();
}

sub('A.1  DISARMED — no authorizer installed; the sink must stay empty');
const events = [];
const record = (...args) => { events.push(args); return 0 /* SQLITE_OK */; };
{
  const d = new DatabaseSync(':memory:');
  fixture(d, 100);
  events.length = 0;
  d.prepare('SELECT id FROM chunk WHERE body = ?').all(`${MARK_PARAM} body 7`);
  say(`      events captured while DISARMED : ${events.length}`);
  say(`      silent?                        : ${events.length === 0 ? 'YES — the instrument is valid for this run' : 'NO — INSTRUMENT VOIDED'}`);
  d.close();
}

sub('A.2  ARMED path 1 — unauthorized text bound as a PARAMETER (§4.15\'s exact probe)');
const armed = new DatabaseSync(':memory:');
const totalRows = fixture(armed, 100);
events.length = 0;
armed.setAuthorizer(record);
const stmt1 = armed.prepare('SELECT id FROM chunk WHERE body = ?');
const prepEvents = events.length;
const rows1 = stmt1.all(`${MARK_PARAM} body 7`);
const execEvents = events.length - prepEvents;
const authText1 = JSON.stringify(events);
say(`      rows in fixture        : ${totalRows}   (100 authorized + 100 unauthorized)`);
say(`      rows returned          : ${rows1.length}`);
say(`      events at PREPARE      : ${prepEvents}`);
say(`      events at EXECUTE      : ${execEvents}`);
say(`      total events           : ${events.length}`);
say(`      unauthorized-marker occurrences in the captured events: *** ${count(authText1, MARK_PARAM)} ***`);
say('      the events themselves, in full:');
for (const e of events) say(`         ${JSON.stringify(e)}`);

sub('A.3  ARMED path 2 — the same text INLINED. A surface that survives A.2 is not thereby clean.');
events.length = 0;
const inline = `${MARK_INLINE} body 7`;
const rows2 = attempt(() => armed.prepare(`SELECT id FROM chunk WHERE body = '${inline}'`).all());
const authText2 = JSON.stringify(events);
say(`      rows returned          : ${rows2.ok ? rows2.value.length : 'threw — ' + rows2.error}`);
say(`      total events           : ${events.length}`);
say(`      inline-marker occurrences in the captured events: *** ${count(authText2, MARK_INLINE)} ***`);
say('      the events themselves, in full:');
for (const e of events) say(`         ${JSON.stringify(e)}`);

sub('A.4  Does the surface record what the engine EXAMINED?  (C4)');
say('   §4.6 S5: a count proves only that something crossed the point the instrument sits at.');
say('   If the event count does not move with the collection size, the surface is not counting');
say('   units examined — it is describing the instruction.');
for (const n of [100, 500, 2500]) {
  const t = new DatabaseSync(':memory:');
  const rows = fixture(t, n);
  events.length = 0;
  t.setAuthorizer(record);
  const s = t.prepare('SELECT id FROM chunk WHERE body = ?');
  const p = events.length;
  s.all(`${MARK_PARAM} body 7`);
  say(`      rows=${String(rows).padStart(5)}   events at prepare=${String(p).padStart(3)}   events total=${String(events.length).padStart(3)}`);
  t.close();
}
say('   -> if those three event counts are identical while the row count grows 25x, the surface');
say('      is INVARIANT WITH N and therefore cannot measure `U`.');

sub('A.5  Second identical execution — §4.15 observed 0 events on re-execution; checked here too');
events.length = 0;
stmt1.all(`${MARK_PARAM} body 7`);
say(`      events on an identical SECOND execution of the SAME prepared statement: ${events.length}`);
say('      -> a prepare-time surface says nothing at all about a statement that is re-run.');

armed.close();

// =============================================================================================
// B — sourceSQL and expandedSQL. This is the measurement §4.15 could not make, and it is the
//     one the referral turns on.
// =============================================================================================
hr('B — sourceSQL vs expandedSQL: is adversity a property of the SURFACE or of the ENGINE?');

say('§4.15: the second subject\'s trace was adverse because "the trace emits the EXPANDED');
say('statement, so binding a parameter does not keep the text out of it." Whether that is a');
say('property of that binding or of statement observability generally was NOT established.');
say('');
say('This subject exposes BOTH forms as separate accessors, so the question is measurable here.');

const b = new DatabaseSync(':memory:');
fixture(b, 100);

sub('B.1  DISARMED — the accessors read on a statement no unauthorized text has passed through');
{
  const clean = b.prepare('SELECT id FROM chunk WHERE scope = ?');
  const src = attempt(() => clean.sourceSQL);
  const exp = attempt(() => clean.expandedSQL);
  say(`      sourceSQL   : ${JSON.stringify(src.ok ? src.value : src.error)}`);
  say(`      expandedSQL : ${JSON.stringify(exp.ok ? exp.value : exp.error)}`);
  const t = JSON.stringify([src, exp]);
  say(`      marker hits : param ${count(t, MARK_PARAM)}, inline ${count(t, MARK_INLINE)}`);
  say(`      silent?     : ${count(t, MARK_PARAM) === 0 && count(t, MARK_INLINE) === 0 ? 'YES — valid for this run' : 'NO — VOIDED'}`);
}

sub('B.2  ARMED path 1 — unauthorized text bound as a PARAMETER');
{
  const s = b.prepare('SELECT id FROM chunk WHERE body = ?');
  const returned = s.all(`${MARK_PARAM} body 7`);
  const src = attempt(() => s.sourceSQL);
  const exp = attempt(() => s.expandedSQL);
  say(`      rows returned : ${returned.length}`);
  say(`      sourceSQL     : ${JSON.stringify(src.ok ? src.value : src.error)}`);
  say(`         marker hits: ${src.ok ? count(String(src.value), MARK_PARAM) : 'n/a'}`);
  say(`      expandedSQL   : ${JSON.stringify(exp.ok ? exp.value : exp.error)}`);
  say(`         marker hits: ${exp.ok ? count(String(exp.value), MARK_PARAM) : 'n/a'}`);
}

sub('B.3  ARMED path 2 — the same text INLINED');
{
  const s = b.prepare(`SELECT id FROM chunk WHERE body = '${MARK_INLINE} body 7'`);
  const returned = attempt(() => s.all());
  const src = attempt(() => s.sourceSQL);
  const exp = attempt(() => s.expandedSQL);
  say(`      rows returned : ${returned.ok ? returned.value.length : 'threw — ' + returned.error}`);
  say(`      sourceSQL     : ${JSON.stringify(src.ok ? src.value : src.error)}`);
  say(`         marker hits: ${src.ok ? count(String(src.value), MARK_INLINE) : 'n/a'}`);
  say(`      expandedSQL   : ${JSON.stringify(exp.ok ? exp.value : exp.error)}`);
  say(`         marker hits: ${exp.ok ? count(String(exp.value), MARK_INLINE) : 'n/a'}`);
}

sub('B.4  Is either accessor a LOG?  (C1 — E4 asks about the engine\'s own LOGS)');
say('   A log accumulates entries about operations that have happened. These accessors return the');
say('   text of ONE statement object the caller is already holding. Measured, not asserted:');
{
  const s1 = b.prepare('SELECT id FROM chunk WHERE id = 1');
  const s2 = b.prepare('SELECT id FROM chunk WHERE id = 2');
  s1.all(); s2.all();
  say(`      after running two different statements, s1.sourceSQL is: ${JSON.stringify(s1.sourceSQL)}`);
  say(`      -> it carries s1 only. There is no accumulated record, and nothing to inspect for a`);
  say(`         statement the caller did not keep a handle on.`);
}
b.close();

// =============================================================================================
// C — createTagStore. Part 1's enumeration listed it and nothing has classified it. It is the
//     only member of this binding that ACCUMULATES across statements, which is the shape a log
//     has, so it is measured rather than dismissed.
// =============================================================================================
hr('C — createTagStore: the one member of this binding that ACCUMULATES');

const tdb = new DatabaseSync(':memory:');
fixture(tdb, 100);
const ts = tdb.createTagStore();

sub('C.1  DISARMED — the store before anything has passed through it');
say(`      size     : ${ts.size}`);
say(`      capacity : ${ts.capacity}`);
say(`      silent?  : ${ts.size === 0 ? 'YES — valid for this run' : 'NO — VOIDED'}`);

sub('C.2  ARMED — unauthorized text through the store\'s own API');
{
  const v = `${MARK_PARAM} body 7`;
  const rows = ts.all`SELECT id FROM chunk WHERE body = ${v}`;
  say(`      rows returned : ${rows.length}`);
  say(`      size after    : ${ts.size}   -> the store ACCUMULATES; it is not a per-statement accessor`);
  const v2 = `${MARK_INLINE} body 7`;
  const rows2 = ts.all`SELECT id FROM chunk WHERE body = ${v2} AND scope = 'unauthorized'`;
  say(`      second query rows : ${rows2.length}`);
  say(`      size after        : ${ts.size}`);
}

sub('C.3  CAN THE ACCUMULATED CONTENT BE INSPECTED FOR PASSAGE TEXT?  (C3)');
say('   Every read path this binding offers, tried rather than assumed:');
const readPaths = [
  ['Object.getOwnPropertyNames(store)', () => Object.getOwnPropertyNames(ts).join(', ')],
  ['prototype members',                 () => Object.getOwnPropertyNames(Object.getPrototypeOf(ts)).filter(n => n !== 'constructor').join(', ')],
  ['JSON.stringify(store)',             () => JSON.stringify(ts)],
  ['store.iterate() as an enumerator',  () => JSON.stringify([...ts.iterate()])],
  ['store[Symbol.iterator]',            () => JSON.stringify([...ts])],
  ['store.entries()',                   () => JSON.stringify([...ts.entries()])],
  ['store.get() as an accessor',        () => JSON.stringify(ts.get())],
];
for (const [label, fn] of readPaths) {
  const r = attempt(fn);
  const text = r.ok ? String(r.value) : r.error;
  say(`      ${label.padEnd(36)}: ${r.ok ? 'returned' : 'THREW'} — ${text.slice(0, 150)}`);
  if (r.ok) {
    say(`      ${''.padEnd(36)}  marker hits: param ${count(text, MARK_PARAM)}, inline ${count(text, MARK_INLINE)}`);
  }
}
say('');
say('   NOTE — the store\'s API is tagged-template only. An interpolation ALWAYS becomes a bound');
say('   parameter, so unauthorized text cannot be INLINED through it even deliberately. That is a');
say('   property of the caller-side API, not evidence about what the engine retains.');
tdb.close();

hr('D — SUMMARY OF WHAT WAS OBSERVED (findings only; no verdict is invented here)');
say('Recorded in the execution record with §4.15\'s C1–C4 applied to each surface.');

const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('./probe-surfaces-output.txt', import.meta.url), out.join('\n') + '\n');
