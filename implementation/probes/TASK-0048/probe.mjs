// TASK-0048 -- bounded N6 measurement.
//
// Authority: MSG-0161b (Q20 = YES), MSG-0160 (Q19 = YES), EPA-0006 §4.18 (N6),
//            the Lead's task file TASK-0048-n6-measurement.md, and the queue
//            board row that made it READY.
//
// WHAT N6 SAYS (§4.18), quoted so this file is checkable against it:
//   "Resolving a routed subject's request must not cause BYTES of content
//    unauthorized for that subject to become durable, INCLUDING where those
//    bytes are already present in the store's physical history rather than in
//    any structure the traversal may open."
//   N6.1 no history-sourced durability   (freed page / reclaimed extent reused)
//   N6.2 no original-image escape        (pre-image written to an artefact)
//   N6.3 history bounded by the invariant (residue brought within it by the
//                                          N3 transition, not only live entries)
//
// WHAT THIS IS NOT.  Not an engine evaluation.  It selects, adopts, deploys,
// implements and clears NOTHING (MSG-0161b).  It changes no gate and moves no
// candidate verdict.  One subject, one build -- §4.15's rule holds and no
// result here generalizes to SQLite or to an engine class.
//
// THE TRAP THIS FILE IS BUILT AROUND (§4.16 DA-4, restated by N6's boundary):
//   Residue is NOT a finding.  A re-materialised store legitimately carries the
//   previous partition's bytes on its free list; their provenance is the
//   TRANSITION, not a request.  An N6 finding requires that RESOLVING THE
//   REQUEST made such bytes durable.  So every arm measures a BASELINE first,
//   and a finding is only recorded for what the request ADDS.
//
// PRIOR EVIDENCE IS NOT RE-REPORTED.  MSG-0161b: "shall not silently treat
// prior TASK-0046 measurements as new N6 measurements."  Everything below is
// measured in this run; TASK-0046 is cited only where its result is quoted as
// context, and quoted results are labelled as quotations.
//
// Run:  node implementation/probes/TASK-0048/probe.mjs
// Deterministic, offline, no install, no network, no corpus.  Writes stores
// under the OS temp directory and removes them.  Nothing is written in the repo.

import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, rmSync, existsSync, statSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const UNAUTH = 'ZZ-UNAUTH-BYTES-ZZ'
const AUTH   = 'QQ-AUTH-BYTES-QQ'
const ABSENT = 'WW-MARKER-THAT-IS-NEVER-WRITTEN-WW'   // instrument control

const ROWS = 400          // per class; large enough to span many pages
const PAGE = 4096

const FAILURES = []
function fail (m) { FAILURES.push(m); console.log(`  !! ${m}`) }
function head (t) { console.log(`\n${'='.repeat(78)}\n${t}\n${'='.repeat(78)}`) }
function note (k, v) { console.log(`  ${k.padEnd(52)} ${v}`) }

// ---------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------

function countIn (buf, marker) {
  const needle = Buffer.from(marker, 'utf8')
  let n = 0, i = 0
  for (;;) {
    const at = buf.indexOf(needle, i)
    if (at === -1) break
    n++; i = at + 1
  }
  return n
}

function scanFile (path, marker) {
  if (!existsSync(path)) return { exists: false, bytes: 0, hits: 0 }
  const buf = readFileSync(path)
  return { exists: true, bytes: buf.length, hits: countIn(buf, marker) }
}

// Page-level classification of the STORE: how many pages carry the marker.
// This is what distinguishes "the store holds unauthorized rows" from "the
// store holds unauthorized BYTES with no unauthorized row" -- N6.3's question.
function storePages (path, marker) {
  if (!existsSync(path)) return { pages: 0, carrying: 0 }
  const buf = readFileSync(path)
  const n = Math.floor(buf.length / PAGE)
  let carrying = 0
  for (let p = 0; p < n; p++) {
    if (countIn(buf.subarray(p * PAGE, (p + 1) * PAGE), marker) > 0) carrying++
  }
  return { pages: n, carrying }
}

// Rollback-journal parse: page images are [4-byte pgno][page][4-byte checksum]
// after a 28-byte header.  We classify each image and, for provenance, check
// whether the image is byte-identical to the page currently in the store --
// which is what makes "this came from the store's history" a measurement
// rather than an inference.
function journalImages (jPath, storePath, marker) {
  if (!existsSync(jPath)) return { exists: false, images: 0, carrying: 0, identical: 0, checked: 0, raw: 0 }
  const j = readFileSync(jPath)
  const store = existsSync(storePath) ? readFileSync(storePath) : Buffer.alloc(0)
  const raw = countIn(j, marker)
  // APPARATUS FIX 3: the record offset is read from the header, not assumed.
  // The journal header is 28 bytes but page records begin at the next SECTOR
  // boundary -- 512 by default -- and the page size is a header field too.
  // Starting at 28 with a hard-coded 4096 page made the parser read a page
  // number out of padding and stop at zero images, on a file that a raw scan
  // shows carries the marker 800 times.  The parser reported "no pre-image"
  // for a journal full of them.
  const sector = j.length >= 24 ? j.readUInt32BE(20) : 512
  const pageSz = j.length >= 28 ? j.readUInt32BE(24) : PAGE
  const rec = 4 + pageSz + 4
  let off = sector > 0 ? sector : 512
  let images = 0, carrying = 0, identical = 0, checked = 0
  while (off + rec <= j.length) {
    const pgno = j.readUInt32BE(off)
    const img = j.subarray(off + 4, off + 4 + pageSz)
    if (pgno === 0 || pgno > 1 << 20) break
    images++
    if (countIn(img, marker) > 0) carrying++
    const at = (pgno - 1) * pageSz
    if (at + pageSz <= store.length) {
      checked++
      if (Buffer.compare(img, store.subarray(at, at + pageSz)) === 0) identical++
    }
    off += rec
  }
  return { exists: true, images, carrying, identical, checked, raw }
}

// WAL frame parse: 32-byte header, then [24-byte frame header][page].
function walFrames (wPath, marker) {
  if (!existsSync(wPath)) return { exists: false, frames: 0, carrying: 0 }
  const w = readFileSync(wPath)
  let off = 32, frames = 0, carrying = 0
  while (off + 24 + PAGE <= w.length) {
    const img = w.subarray(off + 24, off + 24 + PAGE)
    frames++
    if (countIn(img, marker) > 0) carrying++
    off += 24 + PAGE
  }
  return { exists: true, frames, carrying }
}

function artefacts (dir, base) {
  return {
    store:   join(dir, base),
    journal: join(dir, `${base}-journal`),
    wal:     join(dir, `${base}-wal`),
    shm:     join(dir, `${base}-shm`)
  }
}

// ---------------------------------------------------------------------------
// Fixtures.  Four topologies, built here rather than described.
// ---------------------------------------------------------------------------

function ddl (db) {
  db.exec(`CREATE TABLE chunk (
             id INTEGER PRIMARY KEY, scope TEXT NOT NULL,
             served INTEGER NOT NULL DEFAULT 0, body TEXT NOT NULL)`)
}

function fillClass (db, table, scope, marker) {
  const ins = db.prepare(`INSERT INTO ${table} (scope, served, body) VALUES (?, 0, ?)`)
  for (let i = 0; i < ROWS; i++) ins.run(scope, `${marker} row ${i} ${'x'.repeat(60)}`)
}

// L1  shared projection: both classes interleaved in one table, one store.
function buildL1 (dir, mode) {
  const base = 'L1.db'
  const db = new DatabaseSync(join(dir, base))
  db.exec(`PRAGMA journal_mode = ${mode}`)
  ddl(db)
  const ins = db.prepare('INSERT INTO chunk (scope, served, body) VALUES (?, 0, ?)')
  for (let i = 0; i < ROWS; i++) {
    ins.run('AUTHORIZED', `${AUTH} row ${i} ${'x'.repeat(60)}`)
    ins.run('UNAUTHORIZED', `${UNAUTH} row ${i} ${'x'.repeat(60)}`)
  }
  db.exec('CREATE TABLE result_cache (id INTEGER PRIMARY KEY, body TEXT)')
  return { db, dir, base, reachableUnauthRows: ROWS }
}

// L2  isolated structures in ONE store: a table per class.
function buildL2 (dir, mode) {
  const base = 'L2.db'
  const db = new DatabaseSync(join(dir, base))
  db.exec(`PRAGMA journal_mode = ${mode}`)
  db.exec(`CREATE TABLE chunk (id INTEGER PRIMARY KEY, scope TEXT NOT NULL,
             served INTEGER NOT NULL DEFAULT 0, body TEXT NOT NULL)`)
  db.exec(`CREATE TABLE chunk_other (id INTEGER PRIMARY KEY, scope TEXT NOT NULL,
             served INTEGER NOT NULL DEFAULT 0, body TEXT NOT NULL)`)
  fillClass(db, 'chunk', 'AUTHORIZED', AUTH)
  fillClass(db, 'chunk_other', 'UNAUTHORIZED', UNAUTH)
  db.exec('CREATE TABLE result_cache (id INTEGER PRIMARY KEY, body TEXT)')
  return { db, dir, base, reachableUnauthRows: 0 }
}

// L3  isolated stores: the routed store holds only the authorized partition.
function buildL3 (dir, mode) {
  const base = 'L3-auth.db'
  const other = new DatabaseSync(join(dir, 'L3-unauth.db'))
  other.exec(`PRAGMA journal_mode = ${mode}`); ddl(other)
  fillClass(other, 'chunk', 'UNAUTHORIZED', UNAUTH); other.close()
  const db = new DatabaseSync(join(dir, base))
  db.exec(`PRAGMA journal_mode = ${mode}`); ddl(db)
  fillClass(db, 'chunk', 'AUTHORIZED', AUTH)
  db.exec('CREATE TABLE result_cache (id INTEGER PRIMARY KEY, body TEXT)')
  return { db, dir, base, reachableUnauthRows: 0 }
}

// L4  isolated stores AFTER re-partition: this store previously held the
//     unauthorized partition and was re-materialised.  No unauthorized row
//     remains; its pages are on the free list.  This is the history arm.
function buildL4 (dir, mode) {
  const base = 'L4.db'
  const db = new DatabaseSync(join(dir, base))
  db.exec(`PRAGMA journal_mode = ${mode}`); ddl(db)
  fillClass(db, 'chunk', 'UNAUTHORIZED', UNAUTH)      // the previous partition
  db.exec(`DELETE FROM chunk`)                        // the N3 transition
  fillClass(db, 'chunk', 'AUTHORIZED', AUTH)          // re-materialised
  db.exec('CREATE TABLE result_cache (id INTEGER PRIMARY KEY, body TEXT)')
  return { db, dir, base, reachableUnauthRows: 0 }
}

const TOPOLOGIES = [
  { key: 'L1', label: 'shared projection (one structure, both classes)',      build: buildL1 },
  { key: 'L2', label: 'isolated structures in one store',                     build: buildL2 },
  { key: 'L3', label: 'isolated stores (routed store holds one partition)',   build: buildL3 },
  { key: 'L4', label: 'isolated stores AFTER re-partition (history arm)',     build: buildL4 }
]

// Two request-induced write shapes, both from MSG-0158.
const WRITES = [
  { key: 'W-A', label: 'access accounting (UPDATE of entitled rows)',
    run: (db) => db.exec(`UPDATE chunk SET served = served + 1 WHERE scope = 'AUTHORIZED'`) },
  { key: 'W-B', label: 'cache writeback (append INSERT ... SELECT)',
    run: (db) => db.exec(`INSERT INTO result_cache (body)
                          SELECT body FROM chunk WHERE scope = 'AUTHORIZED'`) }
]

// ---------------------------------------------------------------------------
// One measurement.
// ---------------------------------------------------------------------------

function measure (root, topo, mode, write) {
  const dir = mkdtempSync(join(root, `${topo.key}-${mode}-${write.key}-`))
  const fx = topo.build(dir, mode)
  const a = artefacts(dir, fx.base)
  const db = fx.db

  // Bring the store to a defined state so the baseline means something:
  // checkpoint (WAL) or commit-and-settle (DELETE), then read every artefact.
  if (mode === 'wal') db.exec(`PRAGMA wal_checkpoint(TRUNCATE)`)
  db.exec(`PRAGMA journal_mode`)   // no-op read; keeps the connection warm

  // How many unauthorized rows the STORE holds -- across every user table, not
  // only the routed one.  APPARATUS FIX 2: counting `chunk` alone reported L2
  // as holding zero unauthorized rows, because L2 keeps the other partition in
  // `chunk_other` in the same store BY DESIGN.  That would have classified an
  // L2 finding as "history-sourced" when the rows are co-resident on purpose --
  // the presence/provenance error DA-4 exists to prevent, in a new costume.
  const tables = db.prepare(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`).all()
  let liveUnauth = 0
  for (const t of tables) {
    const cols = db.prepare(`PRAGMA table_info(${t.name})`).all().map(c => c.name)
    if (!cols.includes('body')) continue
    liveUnauth += db.prepare(
      `SELECT count(*) AS n FROM ${t.name} WHERE body LIKE '%${UNAUTH}%'`).get().n
  }

  const baseStore   = storePages(a.store, UNAUTH)
  const baseJournal = scanFile(a.journal, UNAUTH)
  const baseWal     = scanFile(a.wal, UNAUTH)

  // THE REQUEST.  Reads only entitled rows, then performs the write shape.
  //
  // APPARATUS FIX 1: the write runs inside an EXPLICIT transaction and the
  // artefacts are read WHILE IT IS OPEN.  A rollback journal exists only for
  // the life of the transaction and is deleted at commit, so the first version
  // of this probe -- which scanned after an autocommitted write -- found no
  // journal in ANY delete-mode arm and recorded DA-6 sixteen times.  That would
  // have reported an instrument gap as a property of the subject.  DA-6 is for
  // an artefact that CANNOT be inspected, not for one the probe looked at after
  // the engine had removed it.
  const returned = db.prepare(
    `SELECT id FROM chunk WHERE scope = 'AUTHORIZED'`).all().length
  // APPARATUS FIX 1b: the page cache is deliberately tiny (PRAGMA cache_size
  // below), because SQLite writes journal page images when a dirty page must be
  // SPILLED -- with a default cache the whole write fits in memory and the
  // journal holds only a header until commit, at which point it is written,
  // synced and deleted faster than any scan can see it.  A tiny cache forces the
  // spill during the statement, which is what makes the pre-image observable at
  // all.  TASK-0045 used the same setting for the same reason.
  db.exec('PRAGMA cache_size = -8')
  db.exec('BEGIN IMMEDIATE')
  write.run(db)

  // Read the rollback journal WHILE THE TRANSACTION IS OPEN -- it exists only
  // for that window.
  const afterJournal = journalImages(a.journal, a.store, UNAUTH)
  // Instrument control, taken on the journal while it still exists.
  const ctrlJournal = scanFile(a.journal, ABSENT).hits

  db.exec('COMMIT')

  // The WAL survives commit until a checkpoint, so it is read AFTER commit --
  // the point at which the frames the transaction produced are all present.
  const afterWal     = walFrames(a.wal, UNAUTH)
  const afterWalRaw  = scanFile(a.wal, UNAUTH)
  const afterStore   = storePages(a.store, UNAUTH)
  const ctrlWal      = scanFile(a.wal, ABSENT).hits

  db.close()
  const closedJournal = scanFile(a.journal, UNAUTH)
  const closedWal     = scanFile(a.wal, UNAUTH)

  const result = {
    topo: topo.key, mode, write: write.key,
    liveUnauth, returned,
    baseStorePages: baseStore.pages, baseStoreCarrying: baseStore.carrying,
    baseJournalHits: baseJournal.exists ? baseJournal.hits : null,
    baseWalHits: baseWal.exists ? baseWal.hits : null,
    journal: afterJournal, wal: afterWal, walRawHits: afterWalRaw.hits,
    afterStoreCarrying: afterStore.carrying,
    ctrlJournal, ctrlWal,
    residualJournal: closedJournal.exists ? closedJournal.hits : null,
    residualWal: closedWal.exists ? closedWal.hits : null,
    dir
  }
  rmSync(dir, { recursive: true, force: true })
  return result
}

// ---------------------------------------------------------------------------
// Verdicts.  DA-5's vocabulary, applied to N6's limbs.  Nothing new invented.
// ---------------------------------------------------------------------------

function verdicts (r) {
  // APPARATUS FIX 4: the journal's contribution is taken from the RAW byte scan
  // as well as the parsed page images.  The mid-transaction snapshot catches
  // only what has spilled by the time it is read, so `images` is a LOWER BOUND
  // on what the transaction will journal -- and scoring the verdict on the
  // parse alone scored L4/delete/W-A as "no finding" while a raw scan of the
  // same file showed the unauthorized marker 20 times.  The parse says WHERE;
  // the raw scan says WHETHER, and the verdict needs the second.
  const journalCarrying = r.journal.exists
    ? Math.max(r.journal.carrying, r.journal.raw > 0 ? 1 : 0) : 0
  const artefactCarrying = journalCarrying + (r.wal.exists ? r.wal.carrying : 0)

  // N6.1 / N6.2 -- did resolving the request make unauthorized bytes durable?
  // The baseline was measured and, where an artefact did not exist at baseline,
  // everything in it afterwards was written by the request.
  let n61, n62, why
  if (artefactCarrying > 0) {
    if (r.liveUnauth > 0) {
      // Bytes are durable, but the store still holds unauthorized ROWS, so the
      // provenance is not separable from ordinary content handling.
      n61 = 'FINDING (shared layout: rows in reach)'
      n62 = 'FINDING'
      why = 'artefact carries unauthorized bytes; unauthorized rows are also in reach'
    } else {
      n61 = 'FINDING (history-sourced)'
      n62 = 'FINDING'
      why = 'artefact carries unauthorized bytes and NO unauthorized row exists -- the bytes came from the store history'
    }
  } else if (!r.journal.exists && !r.wal.exists) {
    n61 = 'NOT CLEARED (DA-6)'; n62 = 'NOT CLEARED (DA-6)'
    why = 'no durability artefact was available to inspect'
  } else {
    n61 = 'no finding (not sufficient alone, DA-5 row 3)'
    n62 = 'no finding (not sufficient alone, DA-5 row 3)'
    why = 'artefacts inspected and carried no unauthorized bytes'
  }

  // N6.3 -- after the transition, is the store's HISTORY within the invariant?
  // Only meaningful where the topology claims to hold no unauthorized entry.
  let n63
  if (r.liveUnauth > 0) n63 = 'n/a (topology holds unauthorized rows by design)'
  else if (r.baseStoreCarrying > 0) n63 = `VIOLATED -- ${r.baseStoreCarrying} store pages carry unauthorized bytes with 0 unauthorized rows`
  else n63 = 'satisfied on this measurement (no residue found)'

  return { n61, n62, n63, why, artefactCarrying }
}

// ---------------------------------------------------------------------------

function main () {
  console.log('TASK-0048 -- bounded N6 measurement (EPA-0006 §4.18)')
  console.log('Authority: MSG-0161b (Q20 = YES).  Selects nothing, clears nothing.')
  console.log('One subject, one build.  No result here generalizes to an engine class.')

  head('A. SUBJECT AND RUNTIME')
  const v = new DatabaseSync(':memory:')
  note('sqlite_version', v.prepare('SELECT sqlite_version() AS v').get().v)
  note('node', process.version)
  note('platform', process.platform)
  v.close()
  note('topologies under test', TOPOLOGIES.map(t => t.key).join(', '))
  note('journal modes', 'delete, wal')
  note('write shapes', WRITES.map(w => `${w.key} (${w.label})`).join(' | '))
  note('rows per class', ROWS)
  console.log('\n  PRIOR TASK-0046 MEASUREMENTS ARE NOT RE-REPORTED (MSG-0161b).')
  console.log('  Every number below was measured in this run.')

  const root = mkdtempSync(join(tmpdir(), 'pci-task-0048-'))
  const results = []

  for (const topo of TOPOLOGIES) {
    for (const mode of ['delete', 'wal']) {
      for (const write of WRITES) {
        results.push(measure(root, topo, mode, write))
      }
    }
  }

  head('B. BASELINE -- what each topology holds BEFORE any request')
  console.log('  DA-4: residue whose provenance is the TRANSITION is not a finding.')
  console.log('  It is measured first so that what the request ADDS can be separated.\n')
  for (const r of results.filter(x => x.write === 'W-A' && x.mode === 'delete')) {
    note(`${r.topo}  live unauthorized rows`, r.liveUnauth)
    note(`${r.topo}  store pages carrying unauthorized bytes`,
      `${r.baseStoreCarrying} of ${r.baseStorePages}`)
  }

  head('C. PER-MEASUREMENT RESULTS (criteria 1, 3, 5)')
  console.log('  topo mode    write  liveRows  baseResidPages  jImages/carry  walFrames/carry  identical')
  for (const r of results) {
    const j = r.journal.exists ? `${r.journal.images}/${r.journal.carrying}/raw${r.journal.raw}` : "-"
    const w = r.wal.exists ? `${r.wal.frames}/${r.wal.carrying}` : '-'
    const id = r.journal.exists ? `${r.journal.identical}/${r.journal.checked}` : '-'
    console.log(`  ${r.topo.padEnd(4)} ${r.mode.padEnd(7)} ${r.write.padEnd(6)} ` +
      `${String(r.liveUnauth).padEnd(9)} ${String(r.baseStoreCarrying).padEnd(15)} ` +
      `${j.padEnd(14)} ${w.padEnd(16)} ${id}`)
  }

  head('D. N6 VERDICTS, PER LIMB (criteria 1, 5)')
  for (const r of results) {
    const V = verdicts(r)
    console.log(`\n  ${r.topo} / ${r.mode} / ${r.write}`)
    note('  N6.1 history-sourced durability', V.n61)
    note('  N6.2 original-image escape', V.n62)
    note('  N6.3 history within the invariant', V.n63)
    note('  basis', V.why)
    r.V = V
  }

  head('E. NEGATIVE CONTROLS (criterion 2) -- kept separate from subject findings')
  const mech = results.filter(r => r.topo === 'L1')
  const mechFired = mech.filter(r => r.V.artefactCarrying > 0).length
  note('NC-1 mechanism control: L1 shared layout arms', mech.length)
  note('NC-1 arms that produced a durability finding', mechFired)
  if (mechFired === 0) fail('NC-1 did not fire: the shared layout produced no finding; the instrument is not measuring')
  const ctrlHits = results.reduce((n, r) => n + r.ctrlJournal + r.ctrlWal, 0)
  note('NC-2 instrument control: hits for a marker never written', ctrlHits)
  if (ctrlHits !== 0) fail('NC-2 failed: the scanner matched a marker that is never written')

  head('F. RUN VALIDITY')
  const valid = FAILURES.length === 0
  note('failures recorded', FAILURES.length)
  note('RUN VALIDITY', valid ? 'VALID' : 'INVALID -- verdicts above are not to be relied on')

  head('G. WHAT THIS RUN DOES NOT ESTABLISH')
  console.log('  - No engine is selected, adopted, deployed, implemented or cleared.')
  console.log('  - No candidate verdict moves; N1-N5, DA-1..DA-7, E1-E4 and strict')
  console.log('    Shape-1 are untouched.')
  console.log('  - One subject and one build only.  §4.6 S10 forbids generalizing this')
  console.log('    to SQLite as a product or to an engine class.')
  console.log('  - Byte-scanning sees literal markers; re-encoded or compressed content')
  console.log('    would be missed.  Absence is "not sufficient alone" (DA-5 row 3).')
  console.log('  - Filesystem- and device-level residue is outside DA-3 scope and was')
  console.log('    not measured.')

  rmSync(root, { recursive: true, force: true })
  note('\n  temp root removed', !existsSync(root))
  console.log('\nEND OF PROBE')
  return valid ? 0 : 1
}

process.exit(main())
