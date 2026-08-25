/**
 * TASK-0046 -- bounded Q16 evidence: does PHYSICAL CONTAINMENT prevent the
 * page-granularity durability exposure TASK-0045 measured?
 *
 * Authority: MSG-0157 (Q15/Q16 DECIDED), and the Architecture Lead's committed
 *            task definition at
 *            implementation/operations/TASK-0046-q16-topology-durability-evidence.md
 *            (commit bafe5c9), which is the specification.
 * Binding:   EPA-0006 §4.16 DA-1…DA-7 AS WRITTEN -- the criterion is
 *            authoritative and this probe does not adjust it.  §4.13 N1/N2/N3
 *            and W1–W4 (the topology this task tests a limb of).  §4.6 S5 (the
 *            asymmetry rule), S8 (negative control), S9 (verdict vocabulary),
 *            S11 (what a probe must not do).  §4.15 (binding, not build -- no
 *            class generalization).  MSG-0156 (a control's finding may NEVER
 *            also be reported as a finding about the subject).
 *
 * THE QUESTION
 * ----------------------------------------------------------------------------
 * TASK-0045 measured a request that updated ONLY rows the subject was entitled
 * to -- ordinary access accounting -- and found the unauthorized marker in the
 * rollback journal 236 times, because journalling is PAGE-granular and a page
 * holding an authorized row also holds its unauthorized neighbours.  MSG-0157
 * ruled that this bears on the §4.13 W1–W4 topology question.  So: if the
 * unauthorized rows are not on those pages, does the exposure go away?
 *
 * WHAT MAKES THIS DIFFERENT FROM RE-RUNNING TASK-0045
 * ----------------------------------------------------------------------------
 * The task file forbids silently re-running prior evidence as new evidence, and
 * success criterion 1 requires the shared arm to "reproduce or otherwise
 * DIRECTLY MEASURE the page-co-residency mechanism ... without relying on
 * presence alone."  A marker count does not do that: it says content is in the
 * artefact, not that PAGE CO-RESIDENCY is why.
 *
 * So this probe PARSES the artefacts.  A rollback journal is a sequence of
 * (page number, original page image) records and a WAL is a sequence of frames
 * of the same shape, so EVERY PAGE THE REQUEST MADE DURABLE IS CLASSIFIED
 * INDIVIDUALLY -- authorized-only, unauthorized-only, or BOTH.  "BOTH" is
 * co-residency, measured on the bytes the engine itself wrote down.  The same
 * classifier runs over the store file page by page, so the precondition and the
 * consequence are measured with one instrument.
 *
 * BOTH PARSERS ARE VERIFIED AGAINST AN INDEPENDENT PATH rather than trusted --
 * see section C.  That check is an INSTRUMENT check and is NOT the §4.6 S8
 * negative control, which is separate and must produce a DA-1 finding.
 *
 * THE FOUR PHYSICAL ORGANIZATIONS
 * ----------------------------------------------------------------------------
 *   L1  SHARED             one structure, both classes interleaved.  The
 *                          TASK-0045 shape, and the baseline.
 *   L2  ISOLATED-TABLES    separate structures, one store.  Each b-tree owns
 *                          its pages, so the classes are not page-co-resident.
 *   L3  ISOLATED-FILES     separate store per partition -- the routed shape
 *                          §4.13 W2/W3 describe and W4 bounds by execution
 *                          context.  The request reaches one store only.
 *   L4  ISOLATED-FILES, AFTER RE-PARTITION   L3's shape, except the authorized
 *                          store PREVIOUSLY held the other partition and was
 *                          re-materialised.  Not an exotic case: §4.13 N3
 *                          REQUIRES partitions to be rebuilt on enumerated
 *                          invalidating events, so re-materialisation is the
 *                          normal operating mode of every W1–W3 topology.
 *
 * TWO REQUEST-INDUCED WRITE SHAPES, AND WHY BOTH ARE HERE
 * ----------------------------------------------------------------------------
 *   W-A  ACCESS ACCOUNTING   an UPDATE over the rows the subject was entitled
 *                            to.  The TASK-0045 shape, and the one the task
 *                            file names.
 *   W-B  CACHE WRITEBACK     an INSERT of the subject's OWN authorized results
 *                            into a cache structure.  TASK-0045 F3 measured
 *                            this shape journalling NOTHING, because a rollback
 *                            journal holds original images of OVERWRITTEN pages
 *                            and an append overwrites none.
 *
 * W-B is not scope creep and is not decoration.  Running W-A alone would have
 * produced the answer "containment prevents the exposure", and that answer
 * would have been an artefact of the write shape chosen.  Neither shape
 * examines, reads or touches anything the subject was not entitled to.
 *
 * HOW TO RUN
 * ----------------------------------------------------------------------------
 *     node implementation/probes/TASK-0046/probe.mjs
 *
 * Deterministic, offline, no arguments, no network, no install.  Every fixture
 * is synthetic (S11).  Databases are created under the OS temp directory and
 * removed; nothing is written inside the repository.  Capture stdout to
 * probe-output.txt.
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const UNAUTH = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ';
const AUTH = 'QQ-AUTHORIZED-PASSAGE-TEXT-QQ';

const AUTH_ROWS = 200;
const UNAUTH_ROWS = 200;

const FAILURES = [];
const CONTROLS = [];
const INSTRUMENT = [];
const RESULTS = {};

const head = (t) => { console.log(); console.log('='.repeat(78)); console.log(t); console.log('='.repeat(78)); };
const sub = (t) => { console.log(); console.log('  --- ' + t + ' ' + '-'.repeat(Math.max(0, 70 - t.length))); };
const note = (k, v) => console.log('  ' + (k + ':').padEnd(52) + ' ' + v);
const fail = (m) => { FAILURES.push(m); console.log('  !! CONTROL FAILED: ' + m); };
const wrap = (s, w, ind) => s.replace(new RegExp('(.{1,' + w + '})(\\s|$)', 'g'), '$1\n' + ind).trimEnd();

const TMP = os.tmpdir();
const mkdir = (tag) => fs.mkdtempSync(path.join(TMP, 'pci-task-0046-' + tag + '-'));
const rmdir = (d) => { try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* reported by caller */ } };
const snapshot = () => new Set(fs.readdirSync(TMP));
const newSince = (before) => fs.readdirSync(TMP).filter((f) => !before.has(f));

/** Count both markers in a buffer.  latin1 so every byte maps to one char. */
function marks(buf) {
  const s = buf.toString('latin1');
  return { u: s.split(UNAUTH).length - 1, a: s.split(AUTH).length - 1 };
}

/** A page is one of four things, and BOTH is the co-residency being measured. */
function classify(m) {
  if (m.u > 0 && m.a > 0) return 'BOTH';
  if (m.u > 0) return 'UNAUTH-only';
  if (m.a > 0) return 'AUTH-only';
  return 'neither';
}

function tally(pages) {
  const t = { BOTH: 0, 'UNAUTH-only': 0, 'AUTH-only': 0, neither: 0, u: 0, a: 0, n: pages.length };
  for (const p of pages) { t[p.kind]++; t.u += p.u; t.a += p.a; }
  return t;
}

const tallyLine = (t) => 'BOTH ' + t.BOTH + ' | AUTH-only ' + t['AUTH-only'] + ' | UNAUTH-only ' + t['UNAUTH-only']
  + ' | neither ' + t.neither + '   (markers: UNAUTH x' + t.u + ', AUTH x' + t.a + ')';

function pageBuffers(file, pageSize) {
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  const out = [];
  for (let i = 0; i * pageSize < buf.length; i++) out.push(buf.subarray(i * pageSize, (i + 1) * pageSize));
  return out;
}

function scanStorePages(file, pageSize) {
  const bufs = pageBuffers(file, pageSize);
  if (!bufs) return null;
  return { pages: bufs.map((b, i) => ({ pgno: i + 1, ...marks(b), kind: classify(marks(b)) })), buffers: bufs };
}

/**
 * ROLLBACK JOURNAL.  28-byte header -- magic, nRec, nonce, dbSize, sector size,
 * page size -- padded to the sector size, then records of (4-byte page number,
 * pageSize bytes of the ORIGINAL page image, 4-byte checksum).  The original
 * image is the point: it is what the page held BEFORE the request touched it.
 *
 * THE MAGIC IS NOT USABLE AS A VALIDITY TEST HERE, and that is a measured fact
 * rather than an assumption.  Read DURING the transaction -- which is the only
 * time this artefact exists -- bytes 0..7 are ZERO: the engine writes the magic
 * last, so that a torn journal is not mistaken for a complete one on recovery.
 * The first version of this probe required the magic, and all four rollback-mode
 * measurements reported "MAGIC DID NOT MATCH" and were declared INVALID.  The
 * parser therefore validates STRUCTURALLY and its output is checked against an
 * independent path in section C, which is stronger than a header byte anyway.
 */
const JOURNAL_MAGIC = Buffer.from([0xd9, 0xd5, 0x05, 0xf9, 0x20, 0xa1, 0x63, 0xd7]);
const isPow2 = (n) => n > 0 && (n & (n - 1)) === 0;

function parseJournal(file) {
  if (!fs.existsSync(file)) return { state: 'NEVER CREATED' };
  const buf = fs.readFileSync(file);
  if (buf.length < 28) return { state: 'PRESENT, ' + buf.length + ' bytes -- too short to hold a header', parsed: false };
  const magicPresent = buf.subarray(0, 8).equals(JOURNAL_MAGIC);
  const magicZeroed = buf.subarray(0, 8).every((b) => b === 0);
  const nRec = buf.readUInt32BE(8);
  const dbSize = buf.readUInt32BE(16);
  const sectorSize = buf.readUInt32BE(20);
  const pageSize = buf.readUInt32BE(24);
  if (!isPow2(pageSize) || pageSize < 512 || pageSize > 65536 || !isPow2(sectorSize) || sectorSize < 32) {
    return { state: 'PRESENT, ' + buf.length + ' bytes -- header page/sector size not structurally sane', parsed: false, magicPresent, magicZeroed };
  }
  const recSize = 4 + pageSize + 4;
  const records = [];
  for (let off = sectorSize; off + recSize <= buf.length; off += recSize) {
    const image = buf.subarray(off + 4, off + 4 + pageSize);
    const m = marks(image);
    records.push({ pgno: buf.readUInt32BE(off), ...m, kind: classify(m), image });
  }
  return {
    state: 'PRESENT, ' + buf.length + ' bytes', parsed: true, bytes: buf.length,
    magic: magicPresent ? 'present' : (magicZeroed ? 'ZEROED -- written at commit, so absent mid-transaction' : 'unrecognised'),
    nRec, dbSize, sectorSize, pageSize, records,
  };
}

/**
 * WAL.  32-byte header, then frames of (24-byte frame header whose first four
 * bytes are the page number, then pageSize bytes of the page image AFTER the
 * change).  Before or after does not matter for co-residency: an updated page
 * carries its untouched neighbours either way.
 */
function parseWal(file) {
  if (!fs.existsSync(file)) return { state: 'NEVER CREATED' };
  const buf = fs.readFileSync(file);
  if (buf.length === 0) return { state: 'PRESENT BUT EMPTY (0 bytes)', parsed: true, bytes: 0, frames: [] };
  if (buf.length < 32) return { state: 'PRESENT, ' + buf.length + ' bytes -- too short for a header', parsed: false };
  const magic = buf.readUInt32BE(0);
  if (magic !== 0x377f0682 && magic !== 0x377f0683) return { state: 'PRESENT, ' + buf.length + ' bytes -- MAGIC DID NOT MATCH', parsed: false };
  const pageSize = buf.readUInt32BE(8);
  if (!isPow2(pageSize) || pageSize < 512) return { state: 'PRESENT, ' + buf.length + ' bytes -- header page size not sane', parsed: false };
  const frameSize = 24 + pageSize;
  const frames = [];
  for (let off = 32; off + frameSize <= buf.length; off += frameSize) {
    const image = buf.subarray(off + 24, off + 24 + pageSize);
    const m = marks(image);
    frames.push({ pgno: buf.readUInt32BE(off), ...m, kind: classify(m), image });
  }
  return { state: 'PRESENT, ' + buf.length + ' bytes', parsed: true, bytes: buf.length, pageSize, frames };
}

/**
 * The instrument check.  A parsed record claims "page N held exactly these
 * bytes".  That claim is checkable against a copy of the store taken outside
 * the parser: for a rollback journal the ORIGINAL image must equal the page as
 * it stood before the transaction; for a WAL the frame must equal the page
 * after the frames are checkpointed back.  Byte equality, not a marker count.
 */
function verifyImages(kind, records, refPages, label) {
  if (!records || !records.length || !refPages) return null;
  let matched = 0, compared = 0, missing = 0;
  for (const r of records) {
    const ref = refPages[r.pgno - 1];
    if (!ref) { missing++; continue; }
    compared++;
    if (ref.equals(r.image)) matched++;
  }
  const ok = compared > 0 && matched === compared;
  note('  parser check (' + kind + ')', matched + ' of ' + compared + ' page images byte-identical to the independent copy'
    + (missing ? '; ' + missing + ' page(s) beyond it' : ''));
  if (ok) INSTRUMENT.push(label + ': ' + matched + '/' + compared + ' ' + kind + ' page images byte-identical to an independently read copy');
  else fail(label + ': the ' + kind + ' parser output did not match the independent copy (' + matched + '/' + compared + ')');
  return ok;
}

function reportPages(label, list, limit = 12) {
  const t = tally(list);
  note(label + ' pages', list.length + '   ' + tallyLine(t));
  for (const p of list.slice(0, limit)) {
    note('    page ' + String(p.pgno).padStart(5), p.kind.padEnd(12) + '  UNAUTH x' + String(p.u).padStart(3) + '   AUTH x' + String(p.a).padStart(3));
  }
  if (list.length > limit) console.log('      … ' + (list.length - limit) + ' further page(s) not printed individually; the tally above covers all of them.');
  return t;
}

// ---------------------------------------------------------------------------
// Fixtures.  Every layout ends in the same state from the request's point of
// view: AUTH_ROWS authorized rows, reachable, with a `served` column ready for
// access accounting.  What differs is WHERE the unauthorized rows are -- which
// is the whole independent variable.
// ---------------------------------------------------------------------------
const body = (marker, i, pad = 0) => marker + ' body ' + i + (pad ? ' ' + 'x'.repeat(pad) : '');

function createChunkTable(d, name) {
  d.exec('CREATE TABLE ' + name + ' (id INTEGER PRIMARY KEY, scope TEXT NOT NULL, body TEXT NOT NULL, served INTEGER DEFAULT 0)');
}

function insertRows(d, name, from, count, scope, marker, pad = 0) {
  const ins = d.prepare('INSERT INTO ' + name + ' (id, scope, body) VALUES (?,?,?)');
  d.exec('BEGIN');
  for (let i = 0; i < count; i++) ins.run(from + i, scope, body(marker, from + i, pad));
  d.exec('COMMIT');
}

const LAYOUTS = {
  L1: {
    title: 'L1  SHARED PROJECTION -- one structure, both classes interleaved',
    idea: 'The baseline. Authorized and unauthorized rows alternate, so they land on the same pages.',
    build(dir) {
      const db = path.join(dir, 'projection.db');
      const d = new DatabaseSync(db);
      createChunkTable(d, 'chunk');
      const ins = d.prepare('INSERT INTO chunk (id, scope, body) VALUES (?,?,?)');
      d.exec('BEGIN');
      for (let i = 1; i <= AUTH_ROWS + UNAUTH_ROWS; i++) {
        const authorized = i % 2 === 0;
        ins.run(i, authorized ? 'AUTHORIZED' : 'OTHER-TENANT', body(authorized ? AUTH : UNAUTH, i));
      }
      d.exec('COMMIT');
      return { d, db, table: 'chunk', where: "scope = 'AUTHORIZED'", extra: [] };
    },
  },

  L2: {
    title: 'L2  ISOLATED STRUCTURES, ONE STORE -- separate b-trees in one file',
    idea: 'Each table owns its pages, so the two classes cannot be page-co-resident even though one file holds both.',
    build(dir) {
      const db = path.join(dir, 'projection.db');
      const d = new DatabaseSync(db);
      createChunkTable(d, 'chunk_auth');
      createChunkTable(d, 'chunk_other');
      insertRows(d, 'chunk_other', 1, UNAUTH_ROWS, 'OTHER-TENANT', UNAUTH);
      insertRows(d, 'chunk_auth', 1000, AUTH_ROWS, 'AUTHORIZED', AUTH);
      return { d, db, table: 'chunk_auth', where: "scope = 'AUTHORIZED'", extra: [] };
    },
  },

  L3: {
    title: 'L3  ISOLATED STORES -- one store per partition, request reaches one',
    idea: 'The routed shape of §4.13 W2/W3, bounded by execution context in W4. The other partition is a different file the request never opens.',
    build(dir) {
      const other = path.join(dir, 'other-partition.db');
      const o = new DatabaseSync(other);
      createChunkTable(o, 'chunk');
      insertRows(o, 'chunk', 1, UNAUTH_ROWS, 'OTHER-TENANT', UNAUTH);
      o.close();
      const db = path.join(dir, 'authorized-partition.db');
      const d = new DatabaseSync(db);
      createChunkTable(d, 'chunk');
      insertRows(d, 'chunk', 1000, AUTH_ROWS, 'AUTHORIZED', AUTH);
      return { d, db, table: 'chunk', where: "scope = 'AUTHORIZED'", extra: [['other partition store', path.basename(other)]] };
    },
  },

  L4: {
    title: 'L4  ISOLATED STORES, AFTER RE-PARTITION -- this store held the other partition first',
    idea: 'L3 exactly, except the authorized store PREVIOUSLY held the other partition and was re-materialised. §4.13 N3 requires partitions to be rebuilt on invalidating events, so this is a topology\'s normal operating mode, not an exotic case.',
    build(dir) {
      const db = path.join(dir, 'authorized-partition.db');
      const d = new DatabaseSync(db);
      // Phase 1 -- this store IS the other partition.  Wide rows, so it occupies
      // more pages than its successor will need.
      createChunkTable(d, 'chunk');
      insertRows(d, 'chunk', 1, UNAUTH_ROWS, 'OTHER-TENANT', UNAUTH, 200);
      // Phase 2 -- the invalidating event: the partition is re-materialised for
      // the authorized subject.  NOT vacuumed -- VACUUM rewrites the file, and
      // choosing it here would be a maintenance decision made silently.
      d.exec('DROP TABLE chunk');
      createChunkTable(d, 'chunk');
      insertRows(d, 'chunk', 1000, AUTH_ROWS, 'AUTHORIZED', AUTH);
      return { d, db, table: 'chunk', where: "scope = 'AUTHORIZED'", extra: [['maintenance after re-partition', 'NONE -- no VACUUM, no secure_delete']] };
    },
  },
};

// ---------------------------------------------------------------------------
// The two request-induced write shapes.  `setup` runs BEFORE the baseline, so
// the measured transaction contains the write and nothing else.
// ---------------------------------------------------------------------------
const SHAPES = {
  'W-A': {
    name: 'ACCESS ACCOUNTING -- UPDATE over the rows the subject was entitled to',
    setup() { /* the `served` column is already in the fixture */ },
    sql: (b) => 'UPDATE ' + b.table + ' SET served = served + 1 WHERE ' + b.where,
    count: (d, b) => d.prepare('SELECT COUNT(*) c FROM ' + b.table + ' WHERE ' + b.where).get().c,
    // Measured after the write: did any row the subject was NOT entitled to
    // end up modified?  Asserting this rather than assuming it is what makes
    // "the request touched nothing unauthorized" evidence instead of a claim.
    violation: (d, b) => d.prepare('SELECT COUNT(*) c FROM ' + b.table + ' WHERE served <> 0 AND NOT (' + b.where + ')').get().c,
  },
  'W-B': {
    name: 'CACHE WRITEBACK -- INSERT of the subject\'s OWN authorized results',
    setup: (d) => d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)'),
    sql: (b) => 'INSERT INTO result_cache SELECT id, scope, body FROM ' + b.table + ' WHERE ' + b.where,
    count: (d, b) => d.prepare('SELECT COUNT(*) c FROM ' + b.table + ' WHERE ' + b.where).get().c,
    violation: (d) => d.prepare("SELECT COUNT(*) c FROM result_cache WHERE scope <> 'AUTHORIZED'").get().c,
  },
};

// ---------------------------------------------------------------------------
function sectionA() {
  head('A. SUBJECT AND RUNTIME');
  const d = new DatabaseSync(':memory:');
  note('node version', process.version);
  note('platform / arch', process.platform + ' / ' + process.arch);
  note('binding', 'node:sqlite (built in)');
  note('SQLite ENGINE version', d.prepare('SELECT sqlite_version() v').get().v);
  note('default page_size', JSON.stringify(d.prepare('PRAGMA page_size').get()));
  note('secure_delete', JSON.stringify(d.prepare('PRAGMA secure_delete').get()));
  note('auto_vacuum', JSON.stringify(d.prepare('PRAGMA auto_vacuum').get()));
  note('OS temp directory', TMP);
  d.close();
  console.log();
  console.log('  THE secure_delete AND auto_vacuum VALUES ARE LOAD-BEARING FOR L4 and');
  console.log('  are read rather than assumed: together they decide what happens to a');
  console.log('  page when a partition is dropped.  Whatever they say, they are');
  console.log('  properties of THIS BUILD AND THIS DEPLOYMENT, and §4.15 is explicit');
  console.log('  that the two available subjects differ in the BINDING, not the build.');
  console.log('  NOTHING BELOW GENERALIZES TO AN ENGINE CLASS.');
  console.log();
  console.log('  This is the FIRST test subject -- the one §4.13 GAP-B concerns.  The');
  console.log('  second (Python 3.14.5 / SQLite 3.50.4) is NOT invoked: MSG-0145');
  console.log('  granted `py` for TASK-0043\'s probe only and no fresh grant exists.');
}

function sectionB() {
  head('B. THE QUESTION, THE INSTRUMENT, AND THE BOUNDARY');
  console.log('  MSG-0157 Q16: "physical containment/isolation is relevant not only to');
  console.log('  query-time U, but also to durability exposure."  This probe tests that');
  console.log('  one boundary and nothing else.');
  console.log();
  console.log('  THE INDEPENDENT VARIABLE is WHERE the unauthorized rows live.  Held');
  console.log('  constant across every layout:');
  for (const [k, v] of [
    ['request-induced write shapes', 'two -- W-A access accounting, W-B cache writeback'],
    ['rows touched per write', String(AUTH_ROWS) + ' -- asserted equal across layouts, not assumed'],
    ['rows the request was NOT entitled to touch', '0, in every layout and both shapes'],
    ['unauthorized rows in the fixture', String(UNAUTH_ROWS)],
    ['artefacts inspected', 'rollback journal, WAL, -shm, main store, temp/spill'],
  ]) note('  ' + k, v);
  console.log();
  console.log('  WHY THESE REQUESTS.  §4.15 and MSG-0155 both turn on this: the');
  console.log('  exposure needs NO post-filtering, NO bad plan and NO examination of');
  console.log('  any unauthorized row.  Neither shape below reads, examines or writes');
  console.log('  anything the subject was not entitled to.  A request that examined');
  console.log('  unauthorized content would measure a different thing and get the');
  console.log('  uninteresting answer.');
  console.log();
  console.log('  WHAT THIS PROBE MAY NOT CONCLUDE, stated before any output exists:');
  for (const s of [
    'It cannot CLEAR anything.  DA-5 consequence 1: satisfying DA-1 clears nothing, and DA-1 is not an §4.6 S6 evidence class.',
    'It cannot move a Shape-1 verdict.  All six TASK-0042 candidates stay NOT CLEARED for the reasons they already were.',
    'It cannot select, adopt, compare-for-adoption, deploy or implement an engine, or choose among W1-W4.',
    'It cannot change DA-1, N1-N5, E1-E4, S1-S11 or any G-Q gate.',
    'A layout that produces no finding is NOT thereby "safe": §4.6 S5 / DA-5 row 3, an absence proves only what crossed the point of inspection.',
  ]) console.log('    - ' + wrap(s, 70, '      '));
}

// ---------------------------------------------------------------------------
// One measured configuration: layout x journal mode x write shape.
// ---------------------------------------------------------------------------
function measure(key, layout, journalMode, shapeKey) {
  const shape = SHAPES[shapeKey];
  const label = key + ' / ' + journalMode + ' / ' + shapeKey;
  head('MEASUREMENT ' + label);
  console.log('  ' + layout.title);
  console.log('  ' + wrap(layout.idea, 72, '  '));
  console.log('  WRITE SHAPE: ' + shape.name);

  const dir = mkdir(key.toLowerCase() + '-' + journalMode.toLowerCase() + '-' + shapeKey.toLowerCase());
  const out = { key, journalMode, shapeKey, ok: false, unauthMadeDurable: 0, bothPages: 0 };
  let d = null;
  try {
    const built = layout.build(dir);
    d = built.d;
    const db = built.db;

    sub('SUBJECT, MODE AND MAINTENANCE STATE (recorded per measurement)');
    note('subject / runtime', 'SQLite ' + d.prepare('SELECT sqlite_version() v').get().v + ' via node:sqlite, node ' + process.version);
    note('store file', path.basename(db));
    const mode = d.prepare('PRAGMA journal_mode=' + journalMode).get().journal_mode;
    note('journal_mode', mode);
    const pageSize = Object.values(d.prepare('PRAGMA page_size').get())[0];
    note('page_size', pageSize);
    note('secure_delete / auto_vacuum', JSON.stringify(d.prepare('PRAGMA secure_delete').get()) + ' / ' + JSON.stringify(d.prepare('PRAGMA auto_vacuum').get()));
    for (const [k, v] of built.extra) note(k, v);

    shape.setup(d, built);

    // ---- the provenance baseline (DA-4) ---------------------------------
    sub('BASELINE -- established before the request, and VERIFIED not assumed');
    const isWal = mode.toUpperCase() === 'WAL';
    let baselineOk = false;
    if (isWal) {
      const ck = d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
      note('maintenance applied', 'PRAGMA wal_checkpoint(TRUNCATE) -> ' + JSON.stringify(ck));
      note('maintenance state', 'checkpointed (TRUNCATE); no VACUUM, no ANALYZE');
      const w = parseWal(db + '-wal');
      note('-wal at baseline', w.state);
      baselineOk = w.parsed === true && w.bytes === 0;
      note('baseline attributable (DA-4)', baselineOk ? 'YES -- -wal measured at 0 bytes, so anything found later arrived after it' : 'NO -- DA-6 applies to this measurement');
    } else {
      note('maintenance state', 'none -- no checkpoint applies in this mode; no VACUUM, no ANALYZE');
      const j = parseJournal(db + '-journal');
      note('-journal at baseline', j.state);
      baselineOk = j.state === 'NEVER CREATED';
      note('baseline attributable (DA-4)', baselineOk ? 'YES -- no journal exists, so one seen later was created BY the transaction' : 'NO -- DA-6 applies to this measurement');
    }
    if (!baselineOk) fail(label + ': the provenance baseline did not hold; attribution unavailable');
    out.baselineOk = baselineOk;

    // ---- the precondition, measured -------------------------------------
    sub('THE STORE ITSELF, PAGE BY PAGE -- the precondition, measured');
    const store = scanStorePages(db, pageSize);
    out.storeTally = reportPages('store', store.pages);
    const preImages = store.buffers;   // the independent copy the parser is checked against
    console.log();
    console.log('      "BOTH" is page co-residency: one page holding rows of both');
    console.log('      classes.  Measured on the store\'s own bytes, before any request');
    console.log('      runs.  It is NOT itself a DA-1 finding -- the store holding the');
    console.log('      projection it indexes is DA-3\'s last exclusion and DA-4 row 1.');
    console.log('      It is the MECHANISM\'s precondition.');
    if (out.storeTally['UNAUTH-only'] > 0 && key === 'L4') {
      console.log();
      console.log('      NOTE THE UNAUTH-only PAGES IN AN ISOLATED STORE.  This store');
      console.log('      holds no unauthorized ROW -- the re-partition dropped them.');
      console.log('      Those pages are on the free list, and their bytes are still');
      console.log('      there.  No query can reach them and no U counter can see them.');
      console.log('      Provenance is the RE-PARTITION, not a request, so DA-4 row 1');
      console.log('      applies and THIS IS NOT A DA-1.1 FINDING.  It is recorded');
      console.log('      because of what the next section measures.');
    }

    // ---- the request -----------------------------------------------------
    sub('THE REQUEST -- touching ONLY rows the subject was entitled to');
    const sql = shape.sql(built);
    note('SQL', sql);
    const entitled = shape.count(d, built);
    const notEntitled = d.prepare('SELECT COUNT(*) c FROM ' + built.table + ' WHERE NOT (' + built.where + ')').get().c;
    note('rows the request will touch', entitled);
    note('unauthorized rows IN REACH of the request', notEntitled + '   <-- the independent variable: this is what the topology changes');
    out.touched = entitled;
    out.notEntitledInReach = notEntitled;

    const before = snapshot();
    d.exec('BEGIN IMMEDIATE');
    d.exec(sql);

    // The rollback journal exists only while the transaction is open, so it is
    // read HERE.  Reading it after the commit would report a false negative --
    // exactly the trap DA-5 row 3 names.
    if (!isWal) {
      const journal = parseJournal(db + '-journal');
      sub('THE ROLLBACK JOURNAL -- read DURING the transaction, parsed page by page');
      note('artefact', journal.state);
      if (journal.parsed) {
        note('header magic', journal.magic);
        note('header nRec / dbSize / sector / page', journal.nRec + ' / ' + journal.dbSize + ' / ' + journal.sectorSize + ' / ' + journal.pageSize);
        out.durableTally = reportPages('journalled', journal.records);
        verifyImages('rollback journal', journal.records, preImages, label);
      } else {
        fail(label + ': the journal could not be parsed -- ' + journal.state);
      }
    }
    d.exec('COMMIT');

    const midSpills = newSince(before);

    out.violations = shape.violation(d, built);
    note('rows the request modified that it was NOT entitled to', out.violations + (out.violations === 0 ? '   (measured after the write, not assumed)' : '   <-- INVARIANT BROKEN'));
    if (out.violations !== 0) fail(label + ': the request modified ' + out.violations + ' row(s) the subject was not entitled to; this is not the shape being tested');

    if (isWal) {
      const wal = parseWal(db + '-wal');
      sub('THE WAL -- read after the commit, parsed frame by frame');
      note('artefact', wal.state);
      if (wal.parsed && wal.frames && wal.frames.length) {
        out.durableTally = reportPages('WAL-framed', wal.frames);
        // Independent path: checkpoint the frames back and compare the store.
        // Applied AFTER the measurement, and recorded as maintenance.
        const ck = d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
        note('maintenance applied AFTER the measurement', 'wal_checkpoint(TRUNCATE) -> ' + JSON.stringify(ck) + '  (for the parser check only)');
        const post = pageBuffers(db, pageSize);
        const last = new Map();
        for (const f of wal.frames) last.set(f.pgno, f);
        verifyImages('WAL', [...last.values()], post, label);
      } else if (!wal.parsed) {
        fail(label + ': the WAL could not be parsed -- ' + wal.state);
      } else {
        note('WAL frames', '0 -- the request wrote no frame');
        out.durableTally = tally([]);
      }
    }

    sub('THE OTHER IN-SCOPE ARTEFACTS -- enumerated, not assumed absent');
    for (const [lbl, p] of [['-shm', db + '-shm'], ['-wal', db + '-wal'], ['-journal', db + '-journal']]) {
      if (!fs.existsSync(p)) { note('  ' + lbl, 'NEVER CREATED'); continue; }
      const m = marks(fs.readFileSync(p));
      note('  ' + lbl, fs.statSync(p).size + ' bytes   UNAUTH x' + m.u + '   AUTH x' + m.a);
    }
    note('  temp/spill files seen during the request', midSpills.length ? JSON.stringify(midSpills) : 'NONE');
    out.spills = midSpills;

    const durable = out.durableTally || tally([]);
    out.unauthMadeDurable = durable.u;
    out.bothPages = durable.BOTH;
    out.durablePages = durable.n;
    out.ok = true;

    sub('WHAT THE REQUEST MADE DURABLE, for this configuration');
    note('page images the request wrote into the artefact', durable.n);
    note('unauthorized markers in them', durable.u);
    note('page images carrying BOTH classes', durable.BOTH);
    note('page images carrying UNAUTHORIZED ONLY', durable['UNAUTH-only']);
    note('finding under DA-1.1', durable.u > 0 && baselineOk
      ? 'YES -- DA-5 row 1: a single occurrence is sufficient => NOT CLEARED'
      : (durable.u > 0 ? 'marker present but attribution unavailable -- DA-6' : 'no unauthorized marker observed'));
    if (durable.u === 0) {
      console.log('      Absence, and DA-5 row 3 governs what it is worth on its own.');
    }
    return out;
  } finally {
    if (d) { try { d.close(); } catch { /* already closed */ } }
    rmdir(dir);
  }
}

// ---------------------------------------------------------------------------
// NC.  THE NEGATIVE CONTROL (§4.6 S8).  It MUST produce a DA-1 finding.
//
//      Built on the ISOLATED layout, because that is where the doubt is: a null
//      result under isolation is worthless unless the instrument is shown
//      capable of a finding IN THAT LAYOUT.  A control on the shared layout
//      would prove nothing about the isolated arm.
//
//      MSG-0156: a control is BUILT to produce a finding, so its finding may
//      NEVER also be reported as a finding about the subject.  Nothing here
//      enters any subject verdict, and section J does not read this section.
// ---------------------------------------------------------------------------
function negativeControl(journalMode) {
  sub('NC-1 / ' + journalMode + ' -- unauthorized content written INTO the isolated store');
  const dir = mkdir('nc1-' + journalMode.toLowerCase());
  let d = null;
  try {
    const built = LAYOUTS.L3.build(dir);
    d = built.d;
    const db = built.db;
    const isWal = journalMode.toUpperCase() === 'WAL';
    note('layout', 'L3 ISOLATED STORES -- the same fixture the subject arm uses');
    note('journal_mode', d.prepare('PRAGMA journal_mode=' + journalMode).get().journal_mode);

    // The control's fixture: content from OUTSIDE the routed partition is put
    // into the authorized store, then overwritten by a request-induced write.
    // This is the leak isolation is supposed to prevent, staged deliberately.
    d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)');
    const ins = d.prepare('INSERT INTO result_cache VALUES (?,?,?)');
    d.exec('BEGIN');
    for (let i = 1; i <= 60; i++) ins.run(i, 'OTHER-TENANT', body(UNAUTH, i));
    d.exec('COMMIT');

    let baseOk = false;
    if (isWal) {
      d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
      const w0 = parseWal(db + '-wal');
      note('-wal at baseline', w0.state);
      baseOk = w0.parsed && w0.bytes === 0;
    } else {
      const j0 = parseJournal(db + '-journal');
      note('-journal at baseline', j0.state);
      baseOk = j0.state === 'NEVER CREATED';
    }
    note('baseline attributable', baseOk ? 'YES' : 'NO');
    if (!baseOk) fail('NC-1 / ' + journalMode + ' baseline did not hold; its finding would not be attributable');

    d.exec('BEGIN IMMEDIATE');
    d.exec("UPDATE result_cache SET body = body || '!'");
    let t = null;
    if (!isWal) {
      const j = parseJournal(db + '-journal');
      note('-journal during the write', j.state);
      if (j.parsed) t = reportPages('journalled', j.records, 4);
    }
    d.exec('COMMIT');
    if (isWal) {
      const w = parseWal(db + '-wal');
      note('-wal after the write', w.state);
      if (w.parsed && w.frames) t = reportPages('WAL-framed', w.frames, 4);
    }

    const hit = !!t && t.u > 0 && baseOk;
    note('NC-1 / ' + journalMode + ' produced a DA-1 finding', hit ? 'YES' : 'NO');
    if (hit) {
      CONTROLS.push('NC-1 / ' + journalMode + ' fired on the ISOLATED layout: unauthorized marker x' + t.u
        + ' across ' + t.n + ' page image(s) the request made durable');
    } else {
      fail('NC-1 / ' + journalMode + ' came back clean -- a null result in the isolated arm could not be interpreted');
    }
    return hit;
  } finally {
    if (d) { try { d.close(); } catch { /* already closed */ } }
    rmdir(dir);
  }
}

function sectionNC() {
  head('NC-1  NEGATIVE CONTROL -- isolated layout, and it MUST produce a finding');
  console.log('  The adverse shape is not contrived: a retrieval layer that caches its');
  console.log('  working set writes back what it examined.  Give it a working set that');
  console.log('  crossed the partition boundary -- the thing isolation is supposed to');
  console.log('  prevent -- and the write lands in the AUTHORIZED store.  If the');
  console.log('  instrument cannot see that, it cannot see anything, and every null');
  console.log('  result in the isolated arm is uninterpretable.');
  const a = negativeControl('DELETE');
  const b = negativeControl('WAL');
  console.log();
  console.log('  MSG-0156, APPLIED IN ADVANCE rather than corrected afterwards: this is');
  console.log('  a CONTROL.  It is built to produce a finding.  Its numbers are NOT a');
  console.log('  finding about any layout, do NOT appear in section J or K, and are');
  console.log('  counted nowhere as evidence about the subject.');
  return a && b;
}

// ---------------------------------------------------------------------------
function sectionJ() {
  head('J. RESULTS -- per physical organization, per artefact, DA-5 vocabulary');
  console.log('  Read "store BOTH" first: it is the co-residency precondition.  Read');
  console.log('  "durable UNAUTH" second: it is what the request made durable.  The');
  console.log('  relationship between those columns is the answer to Q16.');
  console.log();
  console.log('  ' + 'configuration'.padEnd(24) + 'store BOTH'.padStart(11) + 'durable pages'.padStart(15)
    + 'durable UNAUTH'.padStart(16) + '   verdict');
  console.log('  ' + '-'.repeat(76));
  for (const k of Object.keys(RESULTS)) {
    const r = RESULTS[k];
    if (!r.ok) { console.log('  ' + k.padEnd(24) + '   MEASUREMENT DID NOT COMPLETE'); continue; }
    const verdict = r.unauthMadeDurable > 0
      ? (r.baselineOk ? 'FINDING -> NOT CLEARED (DA-5 row 1)' : 'attribution unavailable -> NOT CLEARED (DA-6)')
      : 'no marker observed (DA-5 row 3 governs)';
    console.log('  ' + k.padEnd(24) + String(r.storeTally.BOTH).padStart(11)
      + String(r.durablePages).padStart(15) + String(r.unauthMadeDurable).padStart(16) + '   ' + verdict);
  }

  sub('DA-1.1 -- request-induced persistence, per physical organization');
  for (const key of ['L1', 'L2', 'L3', 'L4']) {
    const rows = Object.entries(RESULTS).filter(([k]) => k.startsWith(key + ' '));
    const worst = Math.max(...rows.map(([, r]) => r.unauthMadeDurable));
    for (const [k, r] of rows) {
      note('  ' + k, r.unauthMadeDurable > 0
        ? 'FINDING -- ' + r.unauthMadeDurable + ' unauthorized marker(s) across ' + r.durablePages + ' durable page image(s); '
          + r.bothPages + ' carried BOTH classes, ' + r.durableTally['UNAUTH-only'] + ' carried unauthorized content only'
        : 'no unauthorized marker in any page image the request made durable');
    }
    note('  ' + key + ' VERDICT', worst > 0
      ? 'NOT CLEARED (DA-5 row 1) -- a single occurrence is sufficient, and no structural argument rehabilitates it'
      : 'no DA-1.1 finding on either write shape; see the account below for what that is worth');
  }

  sub('DA-5 ROW 4 -- what an absence here is, and is not');
  console.log('      DA-5 row 3: an absence "proves only that nothing crossed the');
  console.log('      point, and the moment, at which the inspection was taken."');
  console.log('      DA-5 row 4 is the ONLY route by which absence becomes');
  console.log('      satisfaction: "absence, PLUS evidence that the engine could not');
  console.log('      have written it -- containment of the reachable structure');
  console.log('      (§4.13 N1/N2), or an enumerated account of every in-scope');
  console.log('      artefact the request could touch."');
  console.log();
  console.log('      What this probe supplies for the layouts that came back clean:');
  for (const s of [
    'the enumerated account -- every page the request made durable was identified BY NUMBER and classified individually, and every in-scope artefact was listed rather than assumed absent;',
    'an instrument check -- each parsed page image was compared byte for byte against an independently read copy of the store, so the account is not the parser marking its own work;',
    'a negative control on the SAME layout, which fired.',
  ]) console.log('        + ' + wrap(s, 66, '          '));
  console.log();
  console.log('      What it does NOT supply, and what therefore stays open:');
  for (const s of [
    'the whole DA-1 verdict.  DA-1.2 residual retention and DA-1.3 widened reach are NOT re-measured here -- TASK-0045 recorded both NOT CLEARED and NOTHING in this run disturbs that.',
    'block-level erasure evidence.  Unlinking is observable; whether the blocks are gone is not, on any instrument available here (DA-6).',
    'anything about content a byte scan would miss -- compression, re-encoding, partial-page writes.',
    'a second subject.  §4.15: binding, not build.  No class generalization is available here and none may be read in.',
  ]) console.log('        - ' + wrap(s, 66, '          '));
}

// ---------------------------------------------------------------------------
function sectionK() {
  head('K. THE Q16 ANSWER -- for the tested configuration, and no wider');
  const worst = (key, shape) => Math.max(...Object.entries(RESULTS)
    .filter(([k]) => k.startsWith(key + ' ') && k.endsWith(shape))
    .map(([, r]) => r.unauthMadeDurable));

  console.log('  ' + 'layout'.padEnd(46) + 'W-A'.padStart(8) + 'W-B'.padStart(8));
  console.log('  ' + '-'.repeat(62));
  for (const [key, title] of [
    ['L1', 'shared projection'],
    ['L2', 'isolated structures, one store'],
    ['L3', 'isolated stores'],
    ['L4', 'isolated stores, after re-partition'],
  ]) console.log('  ' + (key + '  ' + title).padEnd(46) + String(worst(key, 'W-A')).padStart(8) + String(worst(key, 'W-B')).padStart(8));
  console.log();
  console.log('  (unauthorized markers the request made durable; W-A access');
  console.log('  accounting, W-B cache writeback)');

  const l1a = worst('L1', 'W-A'), l2a = worst('L2', 'W-A'), l3a = worst('L3', 'W-A'), l4a = worst('L4', 'W-A');
  const l4b = worst('L4', 'W-B'), l1b = worst('L1', 'W-B'), l2b = worst('L2', 'W-B'), l3b = worst('L3', 'W-B');

  sub('PART ONE -- the exposure the task asked about');
  if (l1a > 0 && l2a === 0 && l3a === 0 && l4a === 0) {
    console.log('      PHYSICAL CONTAINMENT PREVENTED IT.  Under W-A -- the write shape');
    console.log('      that produced the TASK-0045 result -- the shared layout made');
    console.log('      unauthorized content durable and NO isolated layout did.');
    console.log();
    console.log('      And the mechanism is measured rather than inferred.  In L1 the');
    console.log('      request made page images durable that carried BOTH classes; in');
    console.log('      L2, L3 and L4 every page image it made durable carried one.');
    console.log('      The page numbers and their classifications are printed above,');
    console.log('      and each image was verified byte-identical to an independently');
    console.log('      read copy of the store.  This is the co-residency mechanism');
    console.log('      exhibited, not a marker count re-asserted.');
  } else if (l1a === 0) {
    console.log('      THE SHARED BASELINE DID NOT REPRODUCE THE EXPOSURE, so success');
    console.log('      criterion 1 is NOT met and no comparison below it can be relied');
    console.log('      on: without a positive baseline an isolated null result is not');
    console.log('      evidence of containment.  Recorded as measured.');
  } else {
    console.log('      MIXED.  At least one isolated layout also made unauthorized');
    console.log('      content durable under W-A.  The per-configuration rows above');
    console.log('      are the result, and no summary sentence is written over them.');
  }

  sub('PART TWO -- and the answer changes with the write shape');
  if (l4b > 0) {
    console.log('      L4 IS L3 -- the same isolation, the same store layout, the same');
    console.log('      entitlement, no unauthorized row anywhere in reach -- with one');
    console.log('      difference: the store had previously held the OTHER partition');
    console.log('      and was re-materialised.  Under W-B it made ' + l4b + ' unauthorized');
    console.log('      marker(s) durable.');
    console.log();
    console.log('      THE MECHANISM IS NOT CO-RESIDENCY OF ROWS.  It is co-residency');
    console.log('      of BYTES.  A page released by the dropped partition keeps its');
    console.log('      content on the free list; an appending request-induced write');
    console.log('      consumes that page; and journalling the page writes its ORIGINAL');
    console.log('      IMAGE -- the old partition\'s bytes -- into the artefact.');
    console.log();
    console.log('      NOTE WHICH SHAPE DID IT, because it inverts TASK-0045.  There,');
    console.log('      W-A was the shape that leaked and W-B "journalled nothing,');
    console.log('      because a rollback journal holds original images of OVERWRITTEN');
    console.log('      pages and appends overwrite none."  That reasoning was correct');
    console.log('      about a store whose free list is empty.  In a re-materialised');
    console.log('      store the append does overwrite something: a page the previous');
    console.log('      partition left behind.  THE SAME WRITE SHAPE, THE OPPOSITE');
    console.log('      RESULT, AND THE DIFFERENCE IS THE STORE\'S HISTORY.');
    console.log();
    console.log('      WHY THIS IS NOT A CORNER CASE.  §4.13 N3 requires the partition');
    console.log('      invariant to be restored by "the recorded event that would break');
    console.log('      it", and names ingestion, effectivity-boundary crossing and');
    console.log('      entitlement-class change among those events.  A W1-W3 topology');
    console.log('      RE-MATERIALISES PARTITIONS AS ITS NORMAL OPERATING MODE, so the');
    console.log('      state L4 measures is not one a design would rarely be in.  It is');
    console.log('      the state it spends most of its life in.');
    console.log();
    console.log('      WHAT IT DOES AND DOES NOT SAY ABOUT N1.  §4.13 N1 requires every');
    console.log('      structure the traversal may open to contain, at answer time, no');
    console.log('      ENTRY unauthorized for the routed subject.  L4 SATISFIES N1 AS');
    console.log('      WRITTEN -- there is no such entry, no query can reach those');
    console.log('      bytes, and no U counter can see them.  N1 and DA-1 are asking');
    console.log('      different questions of the same page.  This probe does NOT');
    console.log('      propose amending N1: that is an architecture change it has no');
    console.log('      authority to make.  It refers the question and stops.');
  } else {
    console.log('      Under W-B the re-partitioned store made no unauthorized marker');
    console.log('      durable in this run.  Recorded as measured; DA-5 row 3 governs');
    console.log('      what the absence is worth, and the secure_delete / auto_vacuum');
    console.log('      values in section A are the settings it depends on.');
  }
  void l1b; void l2b; void l3b;

  sub('THE BOUNDARY ON ALL OF THE ABOVE');
  console.log('      In the task file\'s own words, the result states whether physical');
  console.log('      containment prevents the observed durability exposure FOR THE');
  console.log('      TESTED CONFIGURATION, "without generalizing to an engine class."');
  console.log('      One subject, one build, two write shapes, synthetic fixtures.');
  console.log();
  console.log('      NOTHING IS CLEARED.  No candidate verdict moves, no gate changes,');
  console.log('      no criterion is adjusted, and no topology is selected: W1-W4');
  console.log('      differ on cost and operability (§4.13 GAP-C) and nothing here');
  console.log('      narrows that choice.  DA-1 remains NOT CLEARED for this subject');
  console.log('      on the two independent routes MSG-0155 recorded, neither of which');
  console.log('      this run touched.');
}

// ---------------------------------------------------------------------------
function sectionL() {
  head('L. COVERAGE, LIMITATIONS AND RUN VALIDITY');

  sub('L1  Coverage -- every configuration accounted for, no silent omissions');
  note('  physical organizations', '4 (L1 shared, L2 isolated structures, L3 isolated stores, L4 re-partitioned)');
  note('  journal modes per organization', '2 (DELETE / rollback journal, WAL)');
  note('  request-induced write shapes', '2 (W-A access accounting, W-B cache writeback)');
  note('  measured configurations', String(Object.keys(RESULTS).length));
  note('  negative controls', '2 -- one per instrument, both on the ISOLATED layout');
  for (const [k, v] of [
    ['rollback journals', 'MEASURED, parsed page by page, parser verified'],
    ['write-ahead logs', 'MEASURED, parsed frame by frame, parser verified'],
    ['shared-memory (-shm)', 'MEASURED by marker count -- weaker instrument, no emptied baseline exists for it'],
    ['temporary / spill files', 'WATCHED during every request; these write shapes produced none'],
    ['engine-produced backups', 'NOT RE-MEASURED -- TASK-0045 measured this class and its result stands; re-running it would be the "prior evidence as new evidence" the task file forbids'],
    ['replication streams', 'NOT APPLICABLE -- this subject is not a replicating engine'],
  ]) note('  ' + k, v);

  sub('L2  Limitations, stated rather than left to be discovered');
  [
    'ONE SUBJECT, ONE BUILD. §4.15: the two available subjects differ in the BINDING, not the build. Nothing here is a claim about "SQLite", still less about class R or about engines generally.',
    'TWO WRITE SHAPES, NOT ALL OF THEM. W-A and W-B were chosen because TASK-0045 measured both and got opposite answers. A third shape could behave differently again, and this probe cannot exclude that.',
    'THE L4 RESULT DEPENDS ON DEPLOYMENT SETTINGS that are REPORTED in section A rather than assumed: secure_delete and auto_vacuum. A deployment that zeroes freed pages, or that vacuums after re-partition, would not reproduce it. This probe does not say which is more common and has no evidence about that.',
    'THE L4 FIXTURE GIVES THE MECHANISM A CHANCE TO APPEAR -- the predecessor partition used wider rows than its successor, so the free list is non-trivial when the request runs. That is a declared construction. It establishes the mechanism is AVAILABLE, never that it is universal.',
    'BYTE SCANNING. The classifier counts a literal marker, so it would miss content stored in a form the marker does not survive. An absence is worth even less than DA-5 row 3 already makes it.',
    'DA-1.2 AND DA-1.3 ARE NOT RE-MEASURED. TASK-0045 recorded both NOT CLEARED and this run neither confirms nor disturbs them.',
    'PAGE-TO-STRUCTURE ATTRIBUTION IS BY CONTENT, not by catalogue: a page is classified by which markers its bytes contain. That is sufficient for co-residency and is not a claim about b-tree ownership.',
  ].forEach((l, n) => { console.log('  ' + (n + 1) + '. ' + wrap(l, 70, '     ')); });

  sub('L3  RUN VALIDITY');
  console.log('  §4.6 S8: a run whose negative control comes back clean has measured');
  console.log('  nothing.  Success criterion 5 requires one that MUST fire.');
  console.log();
  console.log('  NEGATIVE CONTROLS (these are NOT subject findings -- MSG-0156):');
  for (const c of CONTROLS) console.log('      + ' + wrap(c, 68, '        '));
  if (!CONTROLS.length) console.log('      (none fired)');
  console.log();
  console.log('  INSTRUMENT CHECKS (a different thing from a control: they show the');
  console.log('  parser reports what is actually in the file, not that it can see a');
  console.log('  finding):');
  for (const c of INSTRUMENT.slice(0, 4)) console.log('      + ' + wrap(c, 68, '        '));
  if (INSTRUMENT.length > 4) console.log('      + … ' + (INSTRUMENT.length - 4) + ' further parser checks, all matching');
  console.log();
  if (FAILURES.length) {
    console.log('  RUN VALIDITY: INVALID -- ' + FAILURES.length + ' control/baseline/instrument failure(s):');
    for (const m of FAILURES) console.log('      - ' + wrap(m, 68, '        '));
    console.log('  No verdict above may be relied on.');
  } else {
    console.log('  RUN VALIDITY: VALID -- both negative controls produced a DA-1');
    console.log('  finding on the layout where a null result needed defending; every');
    console.log('  provenance baseline held and was verified rather than assumed; and');
    console.log('  every parsed page image matched an independently read copy.');
  }

  sub('L4  What this probe did NOT do');
  for (const s of [
    'It selected, cleared, adopted, deployed and implemented NOTHING, and chose no topology among W1-W4.',
    'It changed no criterion. DA-1…DA-7 and N1-N5 were read and applied as written, including where inconvenient.',
    'It changed no gate. E1-E4, strict Shape-1, G-Q4…G-Q7.8 and S1-S11 are untouched, and no U was measured.',
    'It moved no candidate verdict. All six TASK-0042 candidates remain NOT CLEARED for the reasons they already were.',
    'It did not re-run TASK-0045 and report the output as new evidence. The shared arm is a fresh fixture measured with a NEW instrument -- page-level parsing -- and its numbers are not TASK-0045\'s numbers.',
    'It installed nothing, modified no host configuration, touched no real or confidential corpus, and wrote nothing inside the repository except this harness and its captured output.',
    'It introduced no numeric threshold, benchmark, latency or capacity figure. Every count above is an observation.',
  ]) console.log('  - ' + wrap(s, 70, '    '));
}

// ---------------------------------------------------------------------------
function main() {
  console.log('TASK-0046 -- bounded Q16 evidence: does physical containment prevent the');
  console.log('page-granularity durability exposure TASK-0045 measured?');
  console.log('MSG-0157 AUTHORIZED.  EPA-0006 §4.16 and §4.13 are authoritative and are');
  console.log('NOT adjusted here.  This probe selects nothing and clears nothing.');

  sectionA();
  sectionB();

  for (const key of ['L1', 'L2', 'L3', 'L4']) {
    for (const mode of ['DELETE', 'WAL']) {
      for (const shape of ['W-A', 'W-B']) {
        RESULTS[key + ' / ' + mode + ' / ' + shape] = measure(key, LAYOUTS[key], mode, shape);
      }
    }
  }

  head('I. COMPARABILITY -- the write shape held constant, checked not assumed');
  const counts = {}, violations = new Set();
  for (const [k, r] of Object.entries(RESULTS)) {
    const shape = k.slice(-3);
    (counts[shape] = counts[shape] || new Set()).add(r.touched);
    violations.add(r.violations);
  }
  for (const [shape, s] of Object.entries(counts)) note('rows touched, every configuration of ' + shape, [...s].join(', '));
  note('rows modified that the subject was NOT entitled to', [...violations].join(', ') + '   (measured per configuration)');
  console.log();
  console.log('  THE INDEPENDENT VARIABLE, per layout -- unauthorized rows IN REACH of');
  console.log('  the request.  This is the one thing that is SUPPOSED to differ:');
  for (const key of ['L1', 'L2', 'L3', 'L4']) {
    const r = RESULTS[key + ' / DELETE / W-A'];
    note('  ' + key, r.notEntitledInReach + ' unauthorized row(s) reachable by the request');
  }
  let comparable = true;
  for (const [shape, s] of Object.entries(counts)) if (s.size !== 1) { comparable = false; fail('configurations of ' + shape + ' did not receive the same write: ' + JSON.stringify([...s])); }
  if (violations.size !== 1 || !violations.has(0)) { comparable = false; fail('some configuration modified rows the subject was not entitled to: ' + JSON.stringify([...violations])); }
  if (comparable) {
    console.log();
    console.log('  Every configuration of a given shape touched the same number of rows,');
    console.log('  and in EVERY configuration the request modified NOTHING the subject');
    console.log('  was not entitled to -- checked after each write rather than argued');
    console.log('  from the WHERE clause.  The layouts differ in what is IN REACH, and');
    console.log('  in nothing else the request can see.');
  }

  sectionNC();
  sectionJ();
  sectionK();
  sectionL();

  console.log();
  console.log('END OF PROBE');
  return FAILURES.length ? 1 : 0;
}

process.exit(main());
