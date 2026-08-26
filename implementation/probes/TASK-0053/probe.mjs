// TASK-0053 -- re-measure the L4 append arm against a deliberately strong history.
//
// Authority: MSG-0172 §4 (the L4/W-B divergence ruled re-measurable), MSG-0174
//            (defined and queued), MSG-0177 §3 (reconciled READY), and the Lead's
//            task file TASK-0053-l4-wb-re-measurement.md, which is the
//            specification and is not summarised away.
//
// WHAT THIS EXISTS TO SETTLE.  Two runs of the same nominal arm disagree:
//
//     TASK-0046 (MSG-0158)   L4 residue 10 pages   W-B append LEAKED, 15 markers
//     TASK-0048 (MSG-0163)   L4 residue  1 page    W-B append: NO FINDING
//
// MSG-0163 §4 proposed a cause and refused to assert it -- "an append can only
// expose residue if it consumes a residue page, and with one such page the odds
// are small" -- and called its own silence "silence, not exoneration".  THE
// HYPOTHESIS HAS NEVER BEEN TESTED.  This run makes residue population the
// CONTROLLED VARIABLE that neither prior controlled.
//
// THIS IS NOT A RE-RUN, and neither prior record is re-opened, weakened or
// superseded.  Both stand exactly as taken.  This run measures a variable
// neither controlled.
//
// WHAT THIS IS NOT.  It selects, adopts, deploys, implements and clears NOTHING.
// It changes no gate, invariant, criterion or verdict.  One subject, one build --
// §4.6 S10 forbids generalizing any result here to SQLite as a product or to an
// engine class, and §4.15's rule holds: the available subjects differ in the
// BINDING, not the build.
//
// THE TRAP THIS FILE IS BUILT AROUND (§4.16 DA-4).  Residue is NOT a finding.
// A re-materialised store legitimately carries the previous partition's bytes on
// its free list; their provenance is the TRANSITION, not a request (DA-4 row 1).
// A finding requires that RESOLVING THE REQUEST made such bytes durable.  So
// every cell measures a BASELINE first, and no finding is assigned unless the
// store holds ZERO live unauthorized rows.
//
// CONTROLS GATE THIS RUN.  MSG-0169 §2 is the standing correction: TASK-0048's
// harness PRINTED its controls and did not enforce them, which made its validity
// statement an assessment rather than an interlock.  "A printed line is a claim;
// an abort is an interlock."  This harness calls fail() and ABORTS BEFORE ANY
// VERDICT IS PRINTED when a control does not fire.
//
// A CONTROL'S FINDING IS NEVER A FINDING ABOUT THE SUBJECT -- MSG-0156.
//
// Run:  node implementation/probes/TASK-0053/probe.mjs
// Deterministic, offline, no install, no network, no corpus, no host change.
// Fixtures are written under the OS temp directory and removed.  Nothing is
// written inside the repository by this file.

import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

// ---------------------------------------------------------------------------
// Markers and fixture proportions.
//
// TASK-0046's marker strings and row proportions are used deliberately: the arm
// under test is the one TASK-0046 measured, so its fixture is the base against
// which density is varied.  TASK-0048's two other differences -- the transition
// kind and the page-cache setting -- are carried as DECLARED FACTORS below
// rather than being silently fixed at one prior's value.
// ---------------------------------------------------------------------------

const UNAUTH = 'ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ'
const AUTH = 'QQ-AUTHORIZED-PASSAGE-TEXT-QQ'
const ABSENT = 'WW-MARKER-THAT-IS-NEVER-WRITTEN-WW'   // NC-2 instrument control

const AUTH_ROWS = 200      // the successor partition, held constant everywhere
const AUTH_PAD = 0
const PRED_PAD = 200       // wide predecessor rows, as TASK-0046 used

const FAILURES = []
const CONTROL_LOG = []

const head = (t) => { console.log(); console.log('='.repeat(78)); console.log(t); console.log('='.repeat(78)) }
const sub = (t) => { console.log(); console.log('  --- ' + t + ' ' + '-'.repeat(Math.max(0, 70 - t.length))) }
const note = (k, v) => console.log('  ' + (k + ':').padEnd(54) + ' ' + v)
const fail = (m) => { FAILURES.push(m); console.log('  !! CONTROL FAILED: ' + m) }
const ok = (m) => { CONTROL_LOG.push(m); console.log('  ok  ' + m) }

const TMP = os.tmpdir()
const mkdir = (tag) => fs.mkdtempSync(path.join(TMP, 'pci-task-0053-' + tag + '-'))
const rmdir = (d) => { try { fs.rmSync(d, { recursive: true, force: true }) } catch { /* reported by caller */ } }

// ---------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------

/** Count both markers in a buffer.  latin1 so every byte maps to exactly one char. */
function marks (buf) {
  const s = buf.toString('latin1')
  return { u: s.split(UNAUTH).length - 1, a: s.split(AUTH).length - 1 }
}

function countAbsent (buf) {
  return buf.toString('latin1').split(ABSENT).length - 1
}

/** A page is one of four things.  BOTH is page co-residency. */
function classify (m) {
  if (m.u > 0 && m.a > 0) return 'BOTH'
  if (m.u > 0) return 'UNAUTH-only'
  if (m.a > 0) return 'AUTH-only'
  return 'neither'
}

function pageBuffers (file, pageSize) {
  if (!fs.existsSync(file)) return null
  const buf = fs.readFileSync(file)
  const out = []
  for (let i = 0; i * pageSize < buf.length; i++) out.push(buf.subarray(i * pageSize, (i + 1) * pageSize))
  return out
}

/**
 * The STORE, page by page.  `residue` is the number of pages carrying the
 * unauthorized marker.  In an L4 store -- which holds ZERO live unauthorized
 * rows, asserted separately -- every such page is free-list residue left by the
 * predecessor partition.  THIS IS THE INDEPENDENT VARIABLE.
 */
function scanStore (file, pageSize) {
  const bufs = pageBuffers(file, pageSize)
  if (!bufs) return null
  const pages = bufs.map((b, i) => { const m = marks(b); return { pgno: i + 1, ...m, kind: classify(m) } })
  const t = { pages: pages.length, residue: 0, free: 0, coResident: 0, authOnly: 0, neither: 0, u: 0 }
  for (const p of pages) {
    if (p.u > 0) t.residue++
    // THE DECOMPOSITION THAT THE FIRST PASS OF THIS PROBE DID NOT MAKE, and had
    // to.  A page carrying the unauthorized marker is one of two mechanically
    // different things, and counting them together conflates them:
    //   FREE        UNAUTH-only -- a whole page the predecessor left on the free
    //               list.  Only an ALLOCATING write can reach it.
    //   CO-RESIDENT BOTH -- a page the successor partially reused, so live
    //               authorized rows sit alongside the predecessor's dead bytes
    //               in the same page.  Any write that touches an authorized row
    //               on it reaches it; an allocating write never does, because
    //               the page is not free.
    if (p.kind === 'UNAUTH-only') { t.free++; t.neither += 0 }
    if (p.kind === 'BOTH') t.coResident++
    else if (p.kind === 'AUTH-only') t.authOnly++
    else if (p.kind === 'neither') t.neither++
    t.u += p.u
  }
  return { tally: t, pages, buffers: bufs }
}

/**
 * ROLLBACK JOURNAL.  A 28-byte header -- magic, nRec, nonce, dbSize, sector
 * size, page size -- padded to the SECTOR size, then records of (4-byte page
 * number, pageSize bytes of the ORIGINAL page image, 4-byte checksum).
 *
 * Two apparatus facts inherited from the predecessors, both established by
 * measurement there rather than assumed here:
 *
 *  - THE MAGIC IS ZEROED mid-transaction.  The engine writes it last so a torn
 *    journal is not mistaken for a complete one on recovery.  TASK-0046's first
 *    parser required it and declared all four rollback measurements INVALID.
 *    So the parser validates STRUCTURALLY and its output is checked against an
 *    independently read copy of the store -- a stronger check than a header byte.
 *  - RECORDS BEGIN AT THE SECTOR BOUNDARY, and the page size is a header field.
 *    TASK-0048's first parser started at offset 28 with a hard-coded 4096 and
 *    reported "no pre-image" for a journal carrying the marker 800 times.
 */
const isPow2 = (n) => n > 0 && (n & (n - 1)) === 0

/**
 * APPARATUS DEFECT FOUND IN THIS PROBE'S OWN FIRST PASS, and fixed before any
 * result was reported.
 *
 * The first version read page records to end-of-file, as TASK-0046's parser
 * does.  Exhibiting the images BY PAGE NUMBER -- which the first version did not
 * do -- immediately showed the defect: a zero-residue cell reported page images
 * numbered 0, 138499412 and 1213157961.  The journal file is longer than the
 * records written into it (the engine extends it in sector units), so the
 * parser was reading SLACK as records.
 *
 * TASK-0048 guarded this with a range test on the page number.  A range test
 * would let slack through whenever the slack happened to look like a plausible
 * page number, so this parser validates the RECORD CHECKSUM instead, which is
 * the engine's own integrity field:
 *
 *     cksum = cksumInit; for (i = pageSize-200; i > 0; i -= 200) cksum += page[i]
 *
 * with cksumInit the nonce at journal-header offset 12.  The nonce is written
 * when the header is written, unlike the magic and nRec at offsets 0-11, which
 * the engine zeroes and fills in at commit -- so it IS available during the
 * transaction, which is the only time this artefact exists.
 *
 * WHY IT MATTERED, stated exactly: no FINDING changed, because a finding is
 * taken on the raw byte scan rather than on the parse.  What it corrupted was
 * the image and carrying COUNTS, and NC-6's comparison base -- a slack "record"
 * has no counterpart in the store, so it was silently skipped rather than
 * compared.  A slack image that happened to contain marker bytes would have been
 * counted as a carrying page image.  NC-6 is extended below to fail the run on
 * any image whose page number lies outside the store, which is the interlock
 * that would have caught this without anyone reading the page numbers.
 */
function journalCksum (image, cksumInit) {
  let c = cksumInit >>> 0
  for (let i = image.length - 200; i > 0; i -= 200) c = (c + image[i]) >>> 0
  return c >>> 0
}

function parseJournal (file) {
  if (!fs.existsSync(file)) return { state: 'NEVER CREATED', exists: false }
  const buf = fs.readFileSync(file)
  const raw = marks(buf)
  const absent = countAbsent(buf)
  if (buf.length < 28) {
    return { state: 'PRESENT, ' + buf.length + ' bytes -- too short for a header', exists: true, parsed: false, bytes: buf.length, raw, absent }
  }
  const sectorSize = buf.readUInt32BE(20)
  const pageSize = buf.readUInt32BE(24)
  if (!isPow2(pageSize) || pageSize < 512 || pageSize > 65536 || !isPow2(sectorSize) || sectorSize < 32) {
    return { state: 'PRESENT, ' + buf.length + ' bytes -- header page/sector size not structurally sane', exists: true, parsed: false, bytes: buf.length, raw, absent }
  }
  // A JOURNAL IS A SEQUENCE OF SEGMENTS, NOT ONE HEADER FOLLOWED BY RECORDS.
  //
  // SECOND CORRECTION, recorded because the first one was incomplete rather than
  // wrong.  Validating the record checksum removed the over-read; it then
  // produced an UNDER-read, visible as a cell whose parsed images carried the
  // marker 4 times while a raw scan of the same file showed 14.  The cause is
  // that the pager writes a NEW JOURNAL HEADER after a sync boundary -- which a
  // tiny page cache produces several of within one transaction -- each with its
  // OWN checksum nonce.  Validating every record against the FIRST nonce stops
  // the parse dead at the second header.
  //
  // So the parser walks segments: read a header, read records until one fails
  // validation, advance to the next sector boundary, and try to read another
  // header there.  It stops when a segment yields no valid record, which
  // terminates because every continuing iteration consumes at least one record.
  const records = []
  let stopped = 'end of file'
  let segments = 0
  let off = 0
  for (;;) {
    if (off + 28 > buf.length) { stopped = 'end of file'; break }
    const secSz = buf.readUInt32BE(off + 20)
    const pgSz = buf.readUInt32BE(off + 24)
    if (!isPow2(pgSz) || pgSz < 512 || pgSz > 65536 || !isPow2(secSz) || secSz < 32) {
      stopped = 'no further journal header at offset ' + off; break
    }
    const cksumInit = buf.readUInt32BE(off + 12)
    const recSize = 4 + pgSz + 4
    let p = off + secSz
    let n = 0
    while (p + recSize <= buf.length) {
      const pgno = buf.readUInt32BE(p)
      const image = buf.subarray(p + 4, p + 4 + pgSz)
      const stored = buf.readUInt32BE(p + 4 + pgSz)
      if (pgno < 1) break
      if (journalCksum(image, cksumInit) !== stored) break
      const m = marks(image)
      records.push({ pgno, ...m, kind: classify(m), image })
      n++; p += recSize
    }
    segments++
    if (n === 0) { stopped = 'segment ' + segments + ' at offset ' + off + ' carried no valid record'; break }
    const next = Math.ceil(p / secSz) * secSz
    if (next <= off) { stopped = 'parser made no progress at offset ' + off; break }
    off = next
  }
  return { state: 'PRESENT, ' + buf.length + ' bytes', exists: true, parsed: true, bytes: buf.length, sectorSize, pageSize, records, segments, stopped, raw, absent }
}

/** WAL.  32-byte header, then frames of (24-byte frame header, then the page image AFTER the change). */
function parseWal (file, pageSize) {
  if (!fs.existsSync(file)) return { state: 'NEVER CREATED', exists: false }
  const buf = fs.readFileSync(file)
  const raw = marks(buf)
  const absent = countAbsent(buf)
  if (buf.length === 0) return { state: 'PRESENT BUT EMPTY (0 bytes)', exists: true, parsed: true, bytes: 0, frames: [], raw, absent }
  if (buf.length < 32) return { state: 'PRESENT, ' + buf.length + ' bytes -- too short for a header', exists: true, parsed: false, bytes: buf.length, raw, absent }
  const ps = buf.readUInt32BE(8) || pageSize
  const frames = []
  for (let off = 32; off + 24 + ps <= buf.length; off += 24 + ps) {
    const image = buf.subarray(off + 24, off + 24 + ps)
    const m = marks(image)
    frames.push({ pgno: buf.readUInt32BE(off), ...m, kind: classify(m), image })
  }
  return { state: 'PRESENT, ' + buf.length + ' bytes', exists: true, parsed: true, bytes: buf.length, pageSize: ps, frames, raw, absent }
}

/**
 * NC-6 parser control.  Every page image the parser produced must be
 * byte-identical to the same page in an INDEPENDENTLY READ copy of the store.
 * This is what makes "the parser read the artefact correctly" a measurement
 * rather than a claim, and it is TASK-0046's check kept unchanged.
 */
function verifyImages (label, kind, images, reference) {
  let compared = 0, matched = 0, beyond = 0
  for (const r of images) {
    const ref = reference[r.pgno - 1]
    if (!ref) { beyond++; continue }
    compared++
    if (Buffer.compare(r.image, ref) === 0) matched++
  }
  if (compared === 0) return { compared, matched, beyond, verdict: 'no comparable image' }
  if (matched === compared) return { compared, matched, beyond, verdict: 'ok' }
  fail(label + ': ' + kind + ' parser output did not match the independent copy (' + matched + '/' + compared + ')')
  return { compared, matched, beyond, verdict: 'MISMATCH' }
}

// ---------------------------------------------------------------------------
// Fixtures.
//
// ONE builder, parameterised.  Every cell in the grid comes out of it, so a
// difference between two cells is a difference in the parameters and nothing
// else.  The two prior fixtures are two points in this space.
// ---------------------------------------------------------------------------

const body = (marker, i, pad) => marker + ' body ' + i + (pad ? ' ' + 'x'.repeat(pad) : '')

function createChunk (d, name) {
  d.exec('CREATE TABLE ' + name + ' (id INTEGER PRIMARY KEY, scope TEXT NOT NULL, body TEXT NOT NULL, served INTEGER DEFAULT 0)')
}

function insertRows (d, name, from, count, scope, marker, pad) {
  if (count <= 0) return
  const ins = d.prepare('INSERT INTO ' + name + ' (id, scope, body) VALUES (?,?,?)')
  d.exec('BEGIN')
  for (let i = 0; i < count; i++) ins.run(from + i, scope, body(marker, from + i, pad))
  d.exec('COMMIT')
}

/**
 * L4 -- isolated stores AFTER re-partition.  This store PREVIOUSLY held the
 * other partition and was re-materialised for the routed subject.  §4.13 N3
 * requires partitions to be rebuilt on invalidating events, so this is a
 * topology's normal operating mode rather than an exotic state (§4.18).
 *
 * `predRows` is the knob.  A larger predecessor leaves more pages on the free
 * list once it is removed and the smaller successor is written, so residue
 * density rises with it.  predRows = 0 builds a store with NO history at all --
 * the specificity control, and structurally L3.
 *
 * `transition` is DROP or DELETE.  TASK-0046 used DROP TABLE; TASK-0048 used
 * DELETE FROM.  Carrying both means the reconciliation does not have to assume
 * that difference was immaterial.
 *
 * result_cache is created HERE, before the baseline, for EVERY cell including
 * the W-A cells that never write to it.  Declared: it costs a page, and
 * creating it inside the W-B arm alone would have made the two write shapes
 * meet different stores.
 */
function buildL4 (dir, mode, predRows, transition) {
  const file = path.join(dir, 'authorized-partition.db')
  const d = new DatabaseSync(file)
  d.prepare('PRAGMA journal_mode = ' + mode).get()
  createChunk(d, 'chunk')
  insertRows(d, 'chunk', 1, predRows, 'OTHER-TENANT', UNAUTH, PRED_PAD)
  if (transition === 'DROP') {
    d.exec('DROP TABLE chunk')
    createChunk(d, 'chunk')
  } else {
    d.exec('DELETE FROM chunk')
  }
  insertRows(d, 'chunk', 100000, AUTH_ROWS, 'AUTHORIZED', AUTH, AUTH_PAD)
  d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)')
  return { d, file }
}

/**
 * NC-1 mechanism control -- a SHARED projection, both classes interleaved in one
 * structure, holding unauthorized ROWS in reach.  This is the configuration that
 * MUST produce a durability finding.  If it does not, the instrument is not
 * measuring and no silence anywhere else in the run means anything.
 *
 * Its numbers are a CONTROL's numbers and are never reported as a finding about
 * the subject (MSG-0156).
 */
function buildShared (dir, mode) {
  const file = path.join(dir, 'shared-projection.db')
  const d = new DatabaseSync(file)
  d.prepare('PRAGMA journal_mode = ' + mode).get()
  createChunk(d, 'chunk')
  const ins = d.prepare('INSERT INTO chunk (id, scope, body) VALUES (?,?,?)')
  d.exec('BEGIN')
  for (let i = 1; i <= AUTH_ROWS * 2; i++) {
    const authorized = i % 2 === 0
    ins.run(i, authorized ? 'AUTHORIZED' : 'OTHER-TENANT', body(authorized ? AUTH : UNAUTH, i, 0))
  }
  d.exec('COMMIT')
  d.exec('CREATE TABLE result_cache (id INTEGER, scope TEXT, body TEXT)')
  return { d, file }
}

// The two request-induced write shapes, both from MSG-0158 and both re-used by
// MSG-0163, so this run is comparable to each.
const SHAPES = {
  'W-A': {
    name: 'ACCESS ACCOUNTING -- UPDATE over the rows the subject was entitled to',
    sql: "UPDATE chunk SET served = served + 1 WHERE scope = 'AUTHORIZED'",
    violation: (d) => d.prepare("SELECT COUNT(*) c FROM chunk WHERE served <> 0 AND scope <> 'AUTHORIZED'").get().c
  },
  'W-B': {
    name: "CACHE WRITEBACK -- appending INSERT of the subject's OWN authorized results",
    sql: "INSERT INTO result_cache SELECT id, scope, body FROM chunk WHERE scope = 'AUTHORIZED'",
    violation: (d) => d.prepare("SELECT COUNT(*) c FROM result_cache WHERE scope <> 'AUTHORIZED'").get().c
  }
}

const CACHES = [
  { key: 'default', label: 'engine default (TASK-0046 used this)', apply: null },
  { key: 'tiny', label: 'PRAGMA cache_size = -8 (TASK-0048 used this)', apply: 'PRAGMA cache_size = -8' }
]

const TRANSITIONS = ['DROP', 'DELETE']

// ---------------------------------------------------------------------------
// One measurement.
// ---------------------------------------------------------------------------

function measure (spec) {
  const dir = mkdir(spec.tag)
  const out = { ...spec, dir }
  let d = null
  try {
    const built = spec.topology === 'SHARED'
      ? buildShared(dir, spec.mode)
      : buildL4(dir, spec.mode, spec.predRows, spec.transition)
    d = built.d
    const file = built.file
    const pageSize = Object.values(d.prepare('PRAGMA page_size').get())[0]
    out.pageSize = pageSize
    out.secureDelete = Object.values(d.prepare('PRAGMA secure_delete').get())[0]
    out.autoVacuum = Object.values(d.prepare('PRAGMA auto_vacuum').get())[0]
    out.journalMode = Object.values(d.prepare('PRAGMA journal_mode').get())[0]

    // ---- settle, then the provenance baseline (DA-4) --------------------
    const isWal = String(out.journalMode).toLowerCase() === 'wal'
    if (isWal) d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get()

    if (isWal) {
      const w = parseWal(file + '-wal', pageSize)
      out.baselineArtefact = w.state
      out.baselineAttributable = w.parsed === true && w.bytes === 0
    } else {
      const j = parseJournal(file + '-journal')
      out.baselineArtefact = j.state
      out.baselineAttributable = j.state === 'NEVER CREATED'
    }

    // ---- the store: residue, measured, never assumed ---------------------
    const store = scanStore(file, pageSize)
    out.residue = store.tally.residue
    out.freeResidue = store.tally.free
    out.coResident = store.tally.coResident
    out.storePages = store.tally.pages
    out.storeMarkers = store.tally.u
    // Page NUMBERS, not just a count.  §4.19 records that TASK-0046's value lay
    // in exhibiting the mechanism rather than asserting it -- "pages identified,
    // classified and byte-verified".  A count cannot show WHICH page the request
    // consumed; a number can, and section M below needs it.
    out.residuePages = store.pages.filter((p) => p.u > 0).map((p) => p.pgno + ':x' + p.u)
    const preImages = store.buffers          // the independent copy for NC-6

    // ---- provenance: live unauthorized rows, across EVERY user table -----
    // TASK-0048's apparatus fix 2: counting the routed table alone reports a
    // sibling-structure layout as holding zero, which would classify a
    // co-resident-by-design finding as history-sourced.
    const tables = d.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()
    let liveUnauth = 0
    for (const t of tables) {
      const cols = d.prepare('PRAGMA table_info(' + t.name + ')').all().map((c) => c.name)
      if (!cols.includes('body')) continue
      liveUnauth += d.prepare("SELECT COUNT(*) c FROM " + t.name + " WHERE body LIKE '%" + UNAUTH + "%'").get().c
    }
    out.liveUnauth = liveUnauth

    const shape = SHAPES[spec.shape]
    out.entitled = d.prepare("SELECT COUNT(*) c FROM chunk WHERE scope = 'AUTHORIZED'").get().c
    out.unauthInReach = d.prepare("SELECT COUNT(*) c FROM chunk WHERE scope <> 'AUTHORIZED'").get().c

    // ---- the request -----------------------------------------------------
    if (spec.cacheApply) d.exec(spec.cacheApply)
    out.cacheSize = Object.values(d.prepare('PRAGMA cache_size').get())[0]

    d.exec('BEGIN IMMEDIATE')
    d.exec(shape.sql)

    // The rollback journal exists ONLY while the transaction is open.  Reading
    // it after the commit is the false negative DA-5 row 3 refuses to accept as
    // satisfaction, and it is the defect TASK-0048 found in its own apparatus.
    if (!isWal) {
      const j = parseJournal(file + '-journal')
      out.artefact = j.state
      out.artefactExists = j.exists
      out.artefactParsed = j.parsed === true
      out.rawMarkers = j.raw ? j.raw.u : 0
      out.absentHits = j.absent || 0
      if (j.parsed) {
        out.images = j.records.length
        out.carrying = j.records.filter((r) => r.u > 0).length
        out.imageMarkers = j.records.reduce((n, r) => n + r.u, 0)
        out.carryingBoth = j.records.filter((r) => r.kind === 'BOTH').length
        out.carryingUnauthOnly = j.records.filter((r) => r.kind === 'UNAUTH-only').length
        out.durablePages = j.records.map((r) => r.pgno + ':' + r.kind + (r.u ? ':x' + r.u : ''))
        out.parseStopped = j.stopped
        out.parseSegments = j.segments
        out.parserCheck = verifyImages(spec.tag, 'rollback journal', j.records, preImages)
      } else {
        out.images = 0; out.carrying = 0; out.imageMarkers = 0
        out.carryingBoth = 0; out.carryingUnauthOnly = 0
      }
    }
    d.exec('COMMIT')

    out.violations = shape.violation(d)

    if (isWal) {
      const w = parseWal(file + '-wal', pageSize)
      out.artefact = w.state
      out.artefactExists = w.exists
      out.artefactParsed = w.parsed === true
      out.rawMarkers = w.raw ? w.raw.u : 0
      out.absentHits = w.absent || 0
      if (w.parsed && w.frames.length) {
        out.images = w.frames.length
        out.carrying = w.frames.filter((f) => f.u > 0).length
        out.imageMarkers = w.frames.reduce((n, f) => n + f.u, 0)
        out.carryingBoth = w.frames.filter((f) => f.kind === 'BOTH').length
        out.carryingUnauthOnly = w.frames.filter((f) => f.kind === 'UNAUTH-only').length
        out.durablePages = w.frames.map((f) => f.pgno + ':' + f.kind + (f.u ? ':x' + f.u : ''))
        // Independent path, applied AFTER the measurement and recorded as
        // maintenance: checkpoint the frames back and compare the store.
        d.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get()
        const post = pageBuffers(file, pageSize)
        const last = new Map()
        for (const f of w.frames) last.set(f.pgno, f)
        out.parserCheck = verifyImages(spec.tag, 'WAL', [...last.values()], post)
      } else {
        out.images = 0; out.carrying = 0; out.imageMarkers = 0
        out.carryingBoth = 0; out.carryingUnauthOnly = 0
      }
    }

    // Every other in-scope DA-2 artefact, enumerated rather than assumed absent.
    out.otherArtefacts = ['-shm', '-wal', '-journal']
      .map((s) => s + ': ' + (fs.existsSync(file + s) ? fs.statSync(file + s).size + ' bytes' : 'NEVER CREATED'))
      .join('  |  ')

    d.close(); d = null
  } catch (e) {
    out.error = String(e && e.message ? e.message : e)
    fail(spec.tag + ': the measurement threw -- ' + out.error)
  } finally {
    if (d) { try { d.close() } catch { /* nothing further to do */ } }
    rmdir(dir)
  }
  return out
}

// ---------------------------------------------------------------------------
// Verdict for one cell.  DA-5's vocabulary applied to N6's limbs.  Nothing new
// is invented, and BOTH prior scoring bases are reported.
// ---------------------------------------------------------------------------

function verdict (r) {
  // TASK-0046 scored on PARSED page images.  TASK-0048 scored on max(parsed,
  // raw byte scan), because a mid-transaction snapshot catches only what has
  // spilled by the time it is read, so the parse is a LOWER BOUND on what the
  // transaction will journal.  Both are reported here, and the finding is taken
  // on the RAW basis because it is the weaker claim to make a finding on and
  // the stronger claim to make an absence on.
  const byParse = (r.carrying || 0) > 0
  const byRaw = (r.rawMarkers || 0) > 0
  const agree = byParse === byRaw

  if (!r.artefactExists) {
    return { limb: 'NOT CLEARED (DA-6)', finding: false, byParse, byRaw, agree,
      why: 'no durability artefact existed to inspect' }
  }
  if (!r.baselineAttributable) {
    return { limb: 'NOT CLEARED (DA-6)', finding: false, byParse, byRaw, agree,
      why: 'the provenance baseline did not hold, so nothing found could be attributed to the request' }
  }
  if (!byRaw) {
    return { limb: 'no finding (not sufficient alone, DA-5 row 3)', finding: false, byParse, byRaw, agree,
      why: 'the artefact was inspected and carried no unauthorized bytes' }
  }
  if (r.liveUnauth > 0) {
    return { limb: 'FINDING (rows in reach -- not history-sourced)', finding: true, historySourced: false, byParse, byRaw, agree,
      why: 'the artefact carries unauthorized bytes AND the store holds unauthorized rows, so provenance is ordinary content handling' }
  }
  return { limb: 'FINDING (history-sourced) -- N6.1 + N6.2', finding: true, historySourced: true, byParse, byRaw, agree,
    why: 'the artefact carries unauthorized bytes and the store holds ZERO unauthorized rows, so the bytes came from its history' }
}

// N6.3 -- after the N3 transition, is the store's HISTORY within the invariant?
function n63 (r) {
  if (r.liveUnauth > 0) return 'n/a (layout holds unauthorized rows by design)'
  if (r.residue > 0) return 'VIOLATED -- ' + r.residue + ' store page(s) carry unauthorized bytes with 0 unauthorized rows'
  return 'satisfied on this measurement (no residue found)'
}

// ---------------------------------------------------------------------------
// The PRE-REGISTERED verdict rule.  Written and printed BEFORE any result is
// seen, because required outcome 5 forbids rounding an unresolved result to
// either side, and a rule authored after the numbers are in is exactly how that
// rounding happens.
// ---------------------------------------------------------------------------

const SCARCE_MAX = 2      // TASK-0048's regime: 1 residue page
const PLENTIFUL_MIN = 10  // TASK-0046's regime: 10 residue pages

const RULE_TEXT = [
  'Group every L4 / W-B cell by its MEASURED residue, not by its target:',
  '',
  '    SCARCE     1 <= residue <= ' + SCARCE_MAX + '     (TASK-0048 measured 1)',
  '    PLENTIFUL  residue >= ' + PLENTIFUL_MIN + '     (TASK-0046 measured 10)',
  '    ZERO       residue = 0        (the specificity control; excluded from the rule)',
  '    MIDDLE     otherwise          (reported, and not used by the rule)',
  '',
  'Let rSCARCE and rPLENTIFUL be the proportion of cells in each band carrying a',
  'history-sourced finding.  Then:',
  '',
  '    CONFIRMED   iff rPLENTIFUL > 0 AND rSCARCE = 0',
  '                    -- the leak appears when residue is plentiful and is absent',
  '                       when it is scarce, which is exactly the pair of prior',
  '                       results, and density explains the divergence.',
  '',
  '    REFUTED     iff rPLENTIFUL = 0',
  '                    -- a deliberately large residue population does NOT',
  '                       reproduce the leak, so density does not explain',
  '                       TASK-0046\'s finding;',
  '                OR  iff rSCARCE > 0 AND rSCARCE = rPLENTIFUL',
  '                    -- the leak occurs at every density including the scarce',
  '                       one, so density does not explain TASK-0048\'s silence.',
  '',
  '    UNRESOLVED  in every other case, INCLUDING a partial gradient',
  '                (rPLENTIFUL > rSCARCE > 0) and any case where the two journal',
  '                modes disagree.  UNRESOLVED IS REPORTED AS UNRESOLVED.',
  '',
  'A band with no cells makes the result UNRESOLVED: a rule cannot be evaluated',
  'on an empty set, and NC-4 gates that case before this rule is reached.'
]

function band (residue) {
  if (residue === 0) return 'ZERO'
  if (residue <= SCARCE_MAX) return 'SCARCE'
  if (residue >= PLENTIFUL_MIN) return 'PLENTIFUL'
  return 'MIDDLE'
}

function applyRule (cells) {
  const s = cells.filter((c) => band(c.residue) === 'SCARCE')
  const p = cells.filter((c) => band(c.residue) === 'PLENTIFUL')
  if (s.length === 0 || p.length === 0) {
    return { verdict: 'UNRESOLVED', rScarce: null, rPlentiful: null, nScarce: s.length, nPlentiful: p.length,
      why: 'one of the two bands the rule compares contains no cell' }
  }
  const hit = (c) => c.V.finding && c.V.historySourced
  const rS = s.filter(hit).length / s.length
  const rP = p.filter(hit).length / p.length
  let v, why
  if (rP > 0 && rS === 0) { v = 'CONFIRMED'; why = 'the leak reproduces where residue is plentiful and is absent where it is scarce' }
  else if (rP === 0) { v = 'REFUTED'; why = 'a deliberately large residue population did not reproduce the leak' }
  else if (rS > 0 && rS === rP) { v = 'REFUTED'; why = 'the leak occurs at the same rate whether residue is scarce or plentiful' }
  else { v = 'UNRESOLVED'; why = 'a partial gradient -- the leak is denser at higher residue but is not absent at the scarce end' }
  return { verdict: v, rScarce: rS, rPlentiful: rP, nScarce: s.length, nPlentiful: p.length,
    hitScarce: s.filter(hit).length, hitPlentiful: p.filter(hit).length, why }
}

// ---------------------------------------------------------------------------
// Calibration.  Residue density is made a CONTROLLED variable here -- by
// searching a predecessor-size ladder and MEASURING what each one leaves behind,
// rather than by assuming a mapping.  The whole curve is reported, because the
// curve is itself the evidence that the variable is under control.
// ---------------------------------------------------------------------------

const LADDER = [0, 16, 32, 40, 48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160, 176, 200, 300, 450, 700, 1000]

// TARGETS.  `on` names WHICH measured quantity the level is calibrated against.
//
// D0-D3 were registered before the first pass and are calibrated on TOTAL
// residue -- the quantity both priors reported, so they are the levels the
// pre-registered rule is evaluated over.
//
// F1 and F2 were ADDED AFTER THE FIRST PASS, and the reason is recorded rather
// than buried: the first pass exhibited its findings by page number, and that
// showed the D1 level's single "residue page" was a CO-RESIDENT page -- one the
// successor had partially reused, holding live authorized rows -- and NOT a free
// page at all.  So the low end of the ladder did not measure what it was built
// to measure, and no cell in the whole first grid held a small number of FREE
// residue pages.  F1 and F2 fill that gap.
//
// THE PRE-REGISTERED RULE IS APPLIED TO EVERY W-B CELL INCLUDING THE ADDED ONES.
// Excluding them to protect a verdict already seen would be the post-hoc move the
// pre-registration exists to prevent.
const TARGETS = [
  { key: 'D0', target: 0, on: 'residue', added: false, label: 'no predecessor at all -- the specificity control' },
  { key: 'D1', target: 1, on: 'residue', added: false, label: "TASK-0048's regime, as both priors counted residue" },
  { key: 'D2', target: 10, on: 'residue', added: false, label: "TASK-0046's regime" },
  { key: 'D3', target: 40, on: 'residue', added: false, label: 'a deliberately strong history' },
  { key: 'F1', target: 1, on: 'free', added: true, label: 'ONE free-list residue page -- added after the first pass' },
  { key: 'F2', target: 3, on: 'free', added: true, label: 'a few free-list residue pages -- added after the first pass' },
  { key: 'F3', target: 5, on: 'free', added: true, label: 'between F2 and D2 -- added to narrow the wal-mode threshold' },
  { key: 'F4', target: 7, on: 'free', added: true, label: 'between F2 and D2 -- added to narrow the wal-mode threshold' }
]

function calibrate (transition) {
  const curve = []
  for (const predRows of LADDER) {
    const dir = mkdir('cal-' + transition.toLowerCase() + '-' + predRows)
    let d = null
    try {
      const built = buildL4(dir, 'delete', predRows, transition)
      d = built.d
      const pageSize = Object.values(d.prepare('PRAGMA page_size').get())[0]
      const store = scanStore(built.file, pageSize)
      const live = d.prepare("SELECT COUNT(*) c FROM chunk WHERE scope <> 'AUTHORIZED'").get().c
      curve.push({
        predRows, residue: store.tally.residue, free: store.tally.free,
        coResident: store.tally.coResident, pages: store.tally.pages, liveUnauth: live
      })
      d.close(); d = null
    } catch (e) {
      fail('calibration ' + transition + '/' + predRows + ' threw -- ' + String(e && e.message ? e.message : e))
    } finally {
      if (d) { try { d.close() } catch { /* nothing further to do */ } }
      rmdir(dir)
    }
  }
  const chosen = {}
  for (const t of TARGETS) {
    if (t.target === 0 && t.on === 'residue') { chosen[t.key] = 0; continue }
    let best = null
    for (const c of curve) {
      if (c.predRows === 0) continue
      const value = t.on === 'free' ? c.free : c.residue
      const dist = Math.abs(value - t.target)
      if (best === null || dist < best.dist || (dist === best.dist && c.predRows < best.predRows)) {
        best = { predRows: c.predRows, dist }
      }
    }
    chosen[t.key] = best ? best.predRows : null
  }
  return { curve, chosen }
}

// ---------------------------------------------------------------------------

function main () {
  console.log('TASK-0053 -- re-measure the L4 append arm against a deliberately strong history')
  console.log('Authority: MSG-0172 §4; the Lead task file TASK-0053-l4-wb-re-measurement.md.')
  console.log('It settles a contradiction in the evidence base.  It selects, adopts, deploys,')
  console.log('implements and clears NOTHING, and it changes no gate, invariant or verdict.')
  console.log('One subject, one build.  §4.6 S10 forbids generalizing any result here.')

  head('A. SUBJECT, RUNTIME AND THE SETTINGS THAT ARE LOAD-BEARING')
  const v = new DatabaseSync(':memory:')
  const sqliteVersion = v.prepare('SELECT sqlite_version() v').get().v
  note('subject / runtime', 'SQLite ' + sqliteVersion + ' via node:sqlite, node ' + process.version)
  note('platform', process.platform)
  const defPage = Object.values(v.prepare('PRAGMA page_size').get())[0]
  const defSecure = Object.values(v.prepare('PRAGMA secure_delete').get())[0]
  const defVacuum = Object.values(v.prepare('PRAGMA auto_vacuum').get())[0]
  const defCache = Object.values(v.prepare('PRAGMA cache_size').get())[0]
  note('default page_size', defPage)
  note('default secure_delete', defSecure)
  note('default auto_vacuum', defVacuum)
  note('default cache_size', defCache)
  v.close()
  console.log()
  console.log('  secure_delete AND auto_vacuum ARE LOAD-BEARING (§4.18; MSG-0158).  A')
  console.log('  deployment that zeroes freed pages, or that vacuums after re-partition,')
  console.log('  would not hold residue at all and the variable under test would not exist.')
  console.log('  They are READ here rather than assumed, and the run aborts if either is on.')
  if (defSecure !== 0) fail('PRECONDITION: secure_delete is ' + defSecure + ', not 0 -- freed pages are zeroed and there is no residue to vary')
  if (defVacuum !== 0) fail('PRECONDITION: auto_vacuum is ' + defVacuum + ', not 0 -- freed pages are reclaimed and there is no residue to vary')

  console.log()
  console.log('  THE SAME SUBJECT AND BUILD AS BOTH PRIORS.  MSG-0158 and MSG-0163 both')
  console.log('  record "SQLite 3.51.3 via node:sqlite, node v24.15.0".  That is what makes')
  console.log('  this run comparable to each of them rather than a third unrelated result.')

  head('B. THE CONTRADICTION THIS RUN EXISTS TO SETTLE (quoted, not re-measured)')
  console.log('                             TASK-0046 / MSG-0158     TASK-0048 / MSG-0163')
  console.log('  L4 residue pages           10, each at UNAUTH x15   1')
  console.log('  L4 append (W-B) finding    LEAKED, 15 occurrences   no finding, any topology')
  console.log()
  console.log('  Both figures are QUOTATIONS from the prior records.  Nothing in section B')
  console.log('  was measured here, and neither prior record is re-opened or weakened.')
  console.log()
  console.log('  RESIDUE DENSITY IS NOT THE ONLY VARIABLE THAT DIFFERED, and this run says')
  console.log('  so before it starts.  Read from the two committed harnesses:')
  console.log('    transition kind     TASK-0046 DROP TABLE      TASK-0048 DELETE FROM')
  console.log('    page cache          TASK-0046 default         TASK-0048 cache_size = -8')
  console.log('    verdict basis       TASK-0046 parsed images   TASK-0048 max(parsed, raw)')
  console.log('  All three are carried here as declared factors or as reported bases, so the')
  console.log('  reconciliation does not have to assume any of them was immaterial.')

  head('C. THE PRE-REGISTERED VERDICT RULE -- stated BEFORE any result is seen')
  for (const line of RULE_TEXT) console.log('  ' + line)

  head('D. CALIBRATION -- making residue density a controlled variable, by measurement')
  console.log('  Predecessor size is swept; the residue each one leaves is MEASURED.  The')
  console.log('  whole curve is printed because the curve is the evidence that the variable')
  console.log('  is under control, and because a reader can check the chosen points against')
  console.log('  it rather than take them on trust.')
  console.log('  Successor partition held constant at ' + AUTH_ROWS + ' rows; predecessor rows padded to ' + PRED_PAD + '.')
  const cal = {}
  for (const transition of TRANSITIONS) {
    cal[transition] = calibrate(transition)
    sub('transition = ' + transition + (transition === 'DROP' ? "   (TASK-0046's)" : "   (TASK-0048's)"))
    console.log('    predecessor rows   store pages   RESIDUE   of which FREE   of which CO-RESIDENT   live unauth rows')
    for (const c of cal[transition].curve) {
      console.log('    ' + String(c.predRows).padStart(14) + String(c.pages).padStart(14) +
        String(c.residue).padStart(10) + String(c.free).padStart(16) +
        String(c.coResident).padStart(23) + String(c.liveUnauth).padStart(18))
    }
    for (const t of TARGETS) {
      console.log('    ' + t.key.padEnd(4) + ' target ' + String(t.target).padStart(2) + ' ' + (t.on === 'free' ? 'FREE   ' : 'residue') +
        ' -> predRows ' + String(cal[transition].chosen[t.key]).padStart(5) +
        (t.added ? '   [ADDED after the first pass]' : ''))
    }
  }

  head('E. THE GRID')
  const specs = []
  for (const t of TARGETS) {
    for (const transition of TRANSITIONS) {
      for (const mode of ['delete', 'wal']) {
        for (const shapeKey of Object.keys(SHAPES)) {
          for (const cache of CACHES) {
            specs.push({
              topology: 'L4', density: t.key, targetResidue: t.target, transition, mode,
              shape: shapeKey, cache: cache.key, cacheApply: cache.apply,
              predRows: cal[transition].chosen[t.key],
              tag: [t.key, transition, mode, shapeKey, cache.key].join('-')
            })
          }
        }
      }
    }
  }
  const controlSpecs = []
  for (const mode of ['delete', 'wal']) {
    for (const cache of CACHES) {
      controlSpecs.push({
        topology: 'SHARED', density: 'NC1', targetResidue: null, transition: 'n/a', mode,
        shape: 'W-A', cache: cache.key, cacheApply: cache.apply, predRows: null,
        tag: ['NC1', mode, cache.key].join('-')
      })
    }
  }
  note('L4 measurement cells', specs.length + '   (' + TARGETS.length + ' densities x ' + TRANSITIONS.length +
    ' transitions x 2 journal modes x 2 write shapes x ' + CACHES.length + ' cache settings)')
  note('NC-1 mechanism control cells', controlSpecs.length + '   (shared projection, W-A; kept structurally separate)')
  note('total measurements', specs.length + controlSpecs.length)

  const results = specs.map(measure)
  const controls = controlSpecs.map(measure)
  for (const r of [...results, ...controls]) r.V = verdict(r)

  head('F. PER-CELL RESULTS -- residue is reported for EVERY cell (required outcome 1)')
  console.log('  dens transition mode    shape cache    RESIDUE free co-res storePg live  images/carry  markers(parse/raw)  finding')
  for (const r of results) {
    const f = r.V.finding ? (r.V.historySourced ? 'HISTORY-SOURCED' : 'rows-in-reach') : (r.V.limb.startsWith('NOT CLEARED') ? 'DA-6' : '-')
    console.log('  ' + r.density.padEnd(5) + r.transition.padEnd(11) + r.mode.padEnd(8) + r.shape.padEnd(6) +
      r.cache.padEnd(9) + String(r.residue).padStart(7) + String(r.freeResidue).padStart(5) +
      String(r.coResident).padStart(7) + String(r.storePages).padStart(8) +
      String(r.liveUnauth).padStart(6) + ('  ' + (r.images || 0) + '/' + (r.carrying || 0)).padEnd(14) +
      ('  ' + (r.imageMarkers || 0) + '/' + (r.rawMarkers || 0)).padEnd(20) + f)
  }

  head('G. THE ARM UNDER TEST -- L4 / W-B, the appending write, by residue band')
  const wb = results.filter((r) => r.shape === 'W-B')
  const wa = results.filter((r) => r.shape === 'W-A')
  for (const [label, set] of [['W-B  (append -- the arm under test)', wb], ['W-A  (access accounting -- carried for comparability)', wa]]) {
    sub(label)
    console.log('    band        cells   history-sourced findings   residue range')
    for (const b of ['ZERO', 'SCARCE', 'MIDDLE', 'PLENTIFUL']) {
      const cells = set.filter((c) => band(c.residue) === b)
      if (!cells.length) { console.log('    ' + b.padEnd(12) + '0'.padStart(5) + '      --'); continue }
      const hits = cells.filter((c) => c.V.finding && c.V.historySourced).length
      const lo = Math.min(...cells.map((c) => c.residue)), hi = Math.max(...cells.map((c) => c.residue))
      console.log('    ' + b.padEnd(12) + String(cells.length).padStart(5) + String(hits).padStart(26) +
        '   ' + (lo === hi ? String(lo) : lo + '-' + hi))
    }
    sub(label + ' -- by journal mode')
    for (const mode of ['delete', 'wal']) {
      for (const b of ['SCARCE', 'PLENTIFUL']) {
        const cells = set.filter((c) => c.mode === mode && band(c.residue) === b)
        const hits = cells.filter((c) => c.V.finding && c.V.historySourced).length
        console.log('    ' + mode.padEnd(8) + b.padEnd(12) + hits + ' of ' + cells.length)
      }
    }
  }

  head('H. N6 LIMBS, PER CELL (DA-5 vocabulary, unchanged)')
  for (const r of results) {
    console.log()
    console.log('  ' + r.tag + '   residue ' + r.residue + ' page(s), live unauthorized rows ' + r.liveUnauth)
    note('  artefact', r.artefact || '(none)')
    note('  baseline attributable (DA-4)', r.baselineAttributable ? 'YES -- ' + r.baselineArtefact + ' before the request' : 'NO -- ' + r.baselineArtefact)
    note('  N6.1 + N6.2', r.V.limb)
    note('  N6.3 history within the invariant', n63(r))
    note('  scoring bases agree (parse vs raw)', r.V.agree ? 'yes' : 'NO -- parse says ' + r.V.byParse + ', raw says ' + r.V.byRaw)
    note('  basis', r.V.why)
    note('  residue pages in the store (pgno:markers)', (r.residuePages && r.residuePages.length) ? r.residuePages.join('  ') : 'none')
    note('  page images the request made durable', (r.durablePages && r.durablePages.length) ? r.durablePages.join('  ') : 'none')
    if (r.parserCheck) note('  NC-6 parser check', r.parserCheck.matched + ' of ' + r.parserCheck.compared + ' images byte-identical to an independent copy')
    note('  other in-scope artefacts', r.otherArtefacts || '(not enumerated)')
  }

  // -------------------------------------------------------------------------
  head('G2. THE SAME CELLS, GROUPED BY *FREE* RESIDUE INSTEAD OF TOTAL RESIDUE')
  console.log('  Total residue counts two mechanically different things together:')
  console.log('    FREE        a whole page on the free list.  Only an ALLOCATING write')
  console.log('                reaches it.')
  console.log('    CO-RESIDENT a page the successor partially reused, so live authorized')
  console.log('                rows and the predecessor\'s dead bytes share it.  A write')
  console.log('                that touches an authorized row on it reaches it; an')
  console.log('                allocating write never does, because it is not free.')
  console.log()
  console.log('  Both priors, and the pre-registered rule, count TOTAL.  This grouping is')
  console.log('  reported ALONGSIDE, not instead of, and it changes no verdict by itself.')
  for (const [label, set] of [['W-B  (append)', wb], ['W-A  (access accounting)', wa]]) {
    sub(label + ' -- by FREE residue pages, split by journal mode')
    console.log('    free residue   co-resident   delete: findings/cells   wal: findings/cells')
    const buckets = [...new Set(set.map((c) => c.freeResidue))].sort((a, b) => a - b)
    for (const f of buckets) {
      const cells = set.filter((c) => c.freeResidue === f)
      const co = [...new Set(cells.map((c) => c.coResident))].join('/')
      const row = ['delete', 'wal'].map((mode) => {
        const m = cells.filter((c) => c.mode === mode)
        return m.filter((c) => c.V.finding && c.V.historySourced).length + ' of ' + m.length
      })
      console.log('    ' + String(f).padStart(12) + String(co).padStart(14) +
        ('    ' + row[0]).padStart(26) + ('    ' + row[1]).padStart(22))
    }
  }
  console.log()
  console.log('  THE TWO MODES ARE NOT MEASURING THE SAME EXPOSURE, and the page-level')
  console.log('  listing in section H shows why in the cells themselves rather than by')
  console.log('  argument: a rollback journal records the page image BEFORE the write, so')
  console.log('  ANY reuse of a residue page exposes the predecessor\'s content in full; a')
  console.log('  WAL frame records the image AFTER, so a page that the write FULLY overwrote')
  console.log('  exposes nothing.  Compare the "page images the request made durable" lines')
  console.log('  for the F1 and D2 wal/W-B cells: the same page 3 is "AUTH-only" in one and')
  console.log('  "UNAUTH-only:x15" in the other.')

  // -------------------------------------------------------------------------
  head('H2. THE MECHANISM, EXHIBITED BY PAGE NUMBER RATHER THAN ASSERTED')
  console.log('  §4.19 records what made TASK-0046\'s evidence worth promoting: the pages were')
  console.log('  identified, classified individually and byte-verified, so the mechanism was')
  console.log('  exhibited rather than re-asserted.  The same is done here, and it is what')
  console.log('  turns "the append consumed a residue page" from a story into a measurement.')
  console.log()
  console.log('  For each density, one representative cell of each write shape, delete mode,')
  console.log('  default cache, DROP transition.  Read the two columns against each other:')
  console.log('  a finding exists exactly where a page number appears in BOTH.')
  for (const t of TARGETS) {
    sub(t.key + '  (target residue ' + t.target + ')  --  ' + t.label)
    for (const shapeKey of Object.keys(SHAPES)) {
      const r = results.find((c) => c.density === t.key && c.shape === shapeKey &&
        c.mode === 'delete' && c.cache === 'default' && c.transition === 'DROP')
      if (!r) continue
      console.log('    ' + shapeKey + '  residue pages : ' + ((r.residuePages && r.residuePages.length) ? r.residuePages.join('  ') : 'none'))
      console.log('    ' + '   '.padEnd(4) + 'made durable  : ' + ((r.durablePages && r.durablePages.length) ? r.durablePages.join('  ') : 'none'))
      console.log('    ' + '   '.padEnd(4) + 'finding       : ' + (r.V.finding ? (r.V.historySourced ? 'HISTORY-SOURCED' : 'rows-in-reach') : 'none'))
    }
  }

  // -------------------------------------------------------------------------
  head('I. CONTROLS -- THESE GATE THE RUN')
  console.log('  MSG-0169 §2: "a fail() on a silent control is an interlock; a printed line')
  console.log('  is a claim."  Every control below aborts the run when it does not fire, and')
  console.log('  NO VERDICT IS PRINTED IF ANY OF THEM FAILS.')
  console.log('  A control\'s finding is NEVER reported as a finding about the subject -- MSG-0156.')

  sub('NC-1  mechanism control -- a shared projection MUST produce a finding')
  for (const mode of ['delete', 'wal']) {
    const cells = controls.filter((c) => c.mode === mode)
    const fired = cells.filter((c) => c.V.finding).length
    note('  ' + mode + ': control cells that produced a finding', fired + ' of ' + cells.length +
      '   (markers seen: ' + cells.map((c) => c.rawMarkers).join(', ') + ')')
    if (fired === 0) fail('NC-1 (' + mode + '): the shared layout produced no finding; the instrument is not measuring in this mode')
    else ok('NC-1 (' + mode + '): the instrument demonstrably detects a durability leak')
  }

  sub('NC-2  instrument control -- a marker that is never written')
  const absentHits = [...results, ...controls].reduce((n, r) => n + (r.absentHits || 0), 0)
  note('  hits for ' + ABSENT, absentHits)
  if (absentHits !== 0) fail('NC-2: the scanner matched a marker that is never written -- its counts cannot be trusted')
  else ok('NC-2: the scanner reports zero for content that was never written')

  sub('NC-3  specificity control -- a store with NO history must produce no history-sourced finding')
  const zero = results.filter((r) => r.residue === 0)
  const zeroHits = zero.filter((r) => r.V.finding && r.V.historySourced)
  note('  cells with 0 residue pages', zero.length)
  note('  of those, history-sourced findings', zeroHits.length)
  if (zero.length === 0) fail('NC-3: no zero-residue cell was built, so the attribution logic was never challenged')
  else if (zeroHits.length > 0) fail('NC-3: ' + zeroHits.length + ' cell(s) with no residue produced a history-sourced finding -- attribution is unsound (' + zeroHits.map((r) => r.tag).join(', ') + ')')
  else ok('NC-3: with no history present, no history-sourced finding was produced')

  sub('NC-4  independent-variable control -- the densities must actually differ')
  const byDensity = TARGETS.map((t) => {
    const cells = results.filter((r) => r.density === t.key)
    const lo = Math.min(...cells.map((c) => c.residue)), hi = Math.max(...cells.map((c) => c.residue))
    return { key: t.key, target: t.target, lo, hi }
  })
  for (const b of byDensity) note('  ' + b.key + ' target ' + b.target + ' -> measured residue', b.lo === b.hi ? String(b.lo) : b.lo + '-' + b.hi)
  const maxResidue = Math.max(...results.map((r) => r.residue))
  const scarceCells = results.filter((r) => band(r.residue) === 'SCARCE')
  const plentifulCells = results.filter((r) => band(r.residue) === 'PLENTIFUL')
  note('  highest residue measured anywhere', maxResidue)
  note('  cells landing in SCARCE (1-' + SCARCE_MAX + ')', scarceCells.length)
  note('  cells landing in PLENTIFUL (>=' + PLENTIFUL_MIN + ')', plentifulCells.length)
  if (scarceCells.length === 0) fail('NC-4: no cell reproduced the scarce-residue regime TASK-0048 measured; the low end of the variable does not exist in this run')
  if (plentifulCells.length === 0) fail('NC-4: no cell reached the plentiful-residue regime TASK-0046 measured; the deliberately strong history was not built')
  if (scarceCells.length > 0 && plentifulCells.length > 0) ok('NC-4: the independent variable spans both prior regimes')

  // NC-4b gates the levels ADDED after the first pass.  They exist to cover the
  // free-residue regime the first grid turned out not to contain, and if they
  // did not achieve that, the gap is still there and the run must say so rather
  // than report a decomposition it never actually measured.
  const freeBuckets = (lo, hi) => results.filter((r) => r.freeResidue >= lo && r.freeResidue <= hi).length
  note('  cells with 0 free residue but residue > 0 (co-resident only)', results.filter((r) => r.freeResidue === 0 && r.residue > 0).length)
  note('  cells with 1-3 free residue pages', freeBuckets(1, 3))
  note('  cells with >= 10 free residue pages', results.filter((r) => r.freeResidue >= 10).length)
  if (results.filter((r) => r.freeResidue === 0 && r.residue > 0).length === 0) fail('NC-4b: no cell holds residue that is purely co-resident, so the decomposition is untested at that end')
  if (freeBuckets(1, 3) === 0) fail('NC-4b: the added F1/F2 levels did not produce a cell with a small number of FREE residue pages, which is the regime they were added to cover')
  if (results.filter((r) => r.freeResidue >= 10).length === 0) fail('NC-4b: no cell holds a large free-residue population')
  if (freeBuckets(1, 3) > 0 && results.filter((r) => r.freeResidue >= 10).length > 0 &&
      results.filter((r) => r.freeResidue === 0 && r.residue > 0).length > 0) ok('NC-4b: free residue is itself spanned -- co-resident-only, few, and many')

  sub('NC-5  provenance control -- every L4 cell must hold ZERO live unauthorized rows')
  const live = results.filter((r) => r.liveUnauth !== 0)
  note('  L4 cells holding a live unauthorized row', live.length)
  if (live.length > 0) fail('NC-5: ' + live.length + ' L4 cell(s) hold live unauthorized rows, so no finding there could be called history-sourced (' + live.map((r) => r.tag).join(', ') + ')')
  else ok('NC-5: no L4 cell holds a live unauthorized row, so provenance is separable')

  sub('NC-6  parser control -- page images must match an independently read copy')
  const checks = [...results, ...controls].filter((r) => r.parserCheck)
  const bad = checks.filter((r) => r.parserCheck.verdict === 'MISMATCH')
  note('  cells whose parser output was checked', checks.length)
  note('  mismatches', bad.length)
  if (checks.length === 0) fail('NC-6: no parser output was checked against an independent copy')
  else if (bad.length === 0) ok('NC-6: every checked page image was byte-identical to an independently read copy')

  sub('NC-6b  parser over-read control -- no image may lie outside the store')
  // This is the interlock for the defect this probe found in its own first pass.
  // A parser that reads journal slack as records produces images whose page
  // number has no counterpart in the store; the comparison in NC-6 SKIPS those
  // rather than failing on them, so NC-6 alone did not catch it.  This does.
  const overRead = checks.filter((r) => r.parserCheck.beyond > 0)
  note('  cells with an image beyond the end of the store', overRead.length)
  if (overRead.length > 0) {
    for (const r of overRead.slice(0, 6)) console.log('      ' + r.tag + ': ' + r.parserCheck.beyond + ' image(s) beyond; stop reason "' + (r.parseStopped || 'n/a') + '"')
    fail('NC-6b: ' + overRead.length + ' cell(s) produced a page image outside the store -- the parser is reading slack as records')
  } else ok('NC-6b: every parsed image corresponds to a page that exists in the store')

  sub('NC-6c  parser under-read control -- the parse must account for every marker')
  // NC-6 and NC-6b both pass on a parser that reads too LITTLE: skipping records
  // produces no mismatch and no out-of-range page.  This compares the markers the
  // parse accounts for against a raw byte scan of the whole artefact.  A parse
  // that accounts for fewer markers than the file contains has left journal
  // content unread, and every image and carrying count taken from it understates.
  const underRead = [...results, ...controls].filter((r) => r.mode === 'delete' && (r.imageMarkers || 0) < (r.rawMarkers || 0))
  note('  delete-mode cells where parsed markers < raw markers', underRead.length)
  if (underRead.length > 0) {
    for (const r of underRead.slice(0, 6)) console.log('      ' + r.tag + ': parsed ' + r.imageMarkers + ' vs raw ' + r.rawMarkers +
      '; segments ' + (r.parseSegments || '?') + '; stop reason "' + (r.parseStopped || 'n/a') + '"')
    fail('NC-6c: ' + underRead.length + ' cell(s) contain journal markers the parse did not account for -- the parser is reading too little')
  } else ok('NC-6c: every marker in every rollback journal is accounted for by a parsed page image')

  sub('NC-7  entitlement control -- the request must touch nothing it was not entitled to')
  const viol = [...results, ...controls].filter((r) => r.violations !== 0)
  note('  cells where the request touched an unentitled row', viol.length)
  if (viol.length > 0) fail('NC-7: ' + viol.length + ' cell(s) modified rows the subject was not entitled to; that is not the shape under test')
  else ok('NC-7: no request touched a row it was not entitled to')

  sub('errors')
  const errs = [...results, ...controls].filter((r) => r.error)
  note('  cells that threw', errs.length)
  if (errs.length) for (const e of errs) console.log('    ' + e.tag + ': ' + e.error)

  // ---- THE INTERLOCK ------------------------------------------------------
  head('J. RUN VALIDITY -- the interlock')
  note('control failures recorded', FAILURES.length)
  if (FAILURES.length > 0) {
    for (const f of FAILURES) console.log('    !! ' + f)
    console.log()
    console.log('  RUN VALIDITY: INVALID.')
    console.log()
    console.log('  NO VERDICT IS STATED.  The hypothesis section is NOT printed, because a')
    console.log('  run whose controls did not fire has measured nothing, and printing a')
    console.log('  verdict under it would be the exact defect MSG-0169 §2 corrected.')
    console.log('  The per-cell numbers above are retained for diagnosis and are NOT to be')
    console.log('  relied on as evidence about the subject.')
    console.log()
    console.log('END OF PROBE -- INVALID')
    return 1
  }
  console.log('  RUN VALIDITY: VALID -- every control fired, enforced by abort rather than reported.')

  head('K. THE HYPOTHESIS -- CONFIRMED, REFUTED or UNRESOLVED (required outcome 5)')
  console.log('  Hypothesis (MSG-0163 §4, never previously tested): the L4/W-B divergence is')
  console.log('  explained by residue density -- "an append can only expose residue if it')
  console.log('  consumes a residue page, and with one such page the odds are small".')
  console.log()
  console.log('  DECLARED BEFORE THE NUMBERS: four density levels were ADDED after the first')
  console.log('  pass of this probe, and both reasons are recorded rather than buried.')
  console.log('    F1, F2  because the first pass showed the LOW END OF THE LADDER was')
  console.log('            holding CO-RESIDENT residue -- a page the successor had partly')
  console.log('            reused -- rather than a FREE page, so the regime the rule calls')
  console.log('            SCARCE was not in the grid at all.  See section D.')
  console.log('    F3, F4  to narrow a threshold the second pass exposed between 3 and 9')
  console.log('            free residue pages in wal mode.  It changes no verdict; it')
  console.log('            replaces an interpolation with a measurement.')
  console.log('  THE RULE BELOW IS APPLIED TO EVERY W-B CELL, INCLUDING THE ADDED ONES.')
  console.log('  Excluding them to protect a verdict already seen would be exactly the')
  console.log('  post-hoc move the pre-registration exists to prevent -- and it would have')
  console.log('  mattered: on the first pass the rule returned CONFIRMED, and it is the')
  console.log('  added cells that make it UNRESOLVED.')
  console.log()
  const overall = applyRule(wb)
  const perMode = {}
  for (const mode of ['delete', 'wal']) perMode[mode] = applyRule(wb.filter((c) => c.mode === mode))
  note('rSCARCE    (history-sourced findings / cells)', overall.rScarce === null ? 'n/a' : overall.hitScarce + ' of ' + overall.nScarce)
  note('rPLENTIFUL (history-sourced findings / cells)', overall.rPlentiful === null ? 'n/a' : overall.hitPlentiful + ' of ' + overall.nPlentiful)
  note('delete-mode verdict', perMode.delete.verdict + '   (' + perMode.delete.why + ')')
  note('wal-mode verdict', perMode.wal.verdict + '   (' + perMode.wal.why + ')')
  const modesAgree = perMode.delete.verdict === perMode.wal.verdict
  note('the two journal modes agree', modesAgree ? 'yes' : 'NO -- the rule makes this UNRESOLVED')
  const finalVerdict = modesAgree ? overall.verdict : 'UNRESOLVED'
  console.log()
  console.log('  VERDICT: ' + finalVerdict)
  console.log('  BASIS:   ' + (modesAgree ? overall.why : 'the two journal modes produced different verdicts, and the pre-registered rule makes that UNRESOLVED rather than rounding it'))
  console.log()
  console.log('  This verdict was produced by the rule printed in section C BEFORE any')
  console.log('  measurement was taken.  It is not an assessment of the numbers above.')

  head('K2. THE SECOND FACE OF THE DIVERGENCE -- W-A, whose gradient runs the OTHER WAY')
  console.log('  The record so far describes the contradiction in one direction only: TASK-0046')
  console.log('  saw the append leak, TASK-0048 saw nothing.  BUT THE SAME TWO RUNS ALSO')
  console.log('  DISAGREE ON W-A, THE OPPOSITE WAY ROUND -- TASK-0048 found an L4/W-A finding')
  console.log('  (MSG-0163 §3: wal 1 of 11 frames carrying, delete journal marker x20) where')
  console.log('  TASK-0046 found none.  That is visible only by reading the two outputs side')
  console.log('  by side, and this run measured it rather than leaving it unexamined.')
  console.log()
  const waRule = applyRule(wa)
  const waPerMode = {}
  for (const mode of ['delete', 'wal']) waPerMode[mode] = applyRule(wa.filter((c) => c.mode === mode))
  note('W-A  rSCARCE', waRule.rScarce === null ? 'n/a' : waRule.hitScarce + ' of ' + waRule.nScarce)
  note('W-A  rPLENTIFUL', waRule.rPlentiful === null ? 'n/a' : waRule.hitPlentiful + ' of ' + waRule.nPlentiful)
  note('W-A  delete-mode / wal-mode', waPerMode.delete.verdict + ' / ' + waPerMode.wal.verdict)
  console.log()
  console.log('  THE PRE-REGISTERED RULE IS NOT APPLIED TO W-A AS A VERDICT, and saying so')
  console.log('  matters: the rule was written for the append arm, which is the arm MSG-0172')
  console.log('  §4 authorised re-measuring.  Applying a rule to a series it was not written')
  console.log('  for, after seeing that series, is the post-hoc move the pre-registration')
  console.log('  exists to prevent.  The NUMBERS are reported; the verdict is not claimed.')
  console.log()
  console.log('  WHAT THE NUMBERS SHOW, STATED FLATLY:  the two write shapes have OPPOSITE')
  console.log('  relationships to residue density on this subject.  W-B leaks only where')
  console.log('  residue is plentiful; W-A leaks only where it is scarce.  Both are absent at')
  console.log('  zero residue, which is the specificity control and is the one thing both')
  console.log('  shapes agree on.')
  console.log()
  console.log('  THIS IS AN OBSERVATION, NOT AN EXPLANATION.  The page numbers in section H2')
  console.log('  show WHICH page carried it; they do not establish WHY the allocator reaches a')
  console.log('  residue page under one shape at one density and not the other.  Establishing')
  console.log('  that would require instrumenting the allocator, which this task is not')
  console.log('  authorised to do and which no available instrument reaches.  IT IS REFERRED,')
  console.log('  NOT EXPLAINED AWAY.')
  console.log()
  console.log('  What it does NOT do: it does not weaken, re-open or supersede either prior')
  console.log('  record.  Both stand as taken.  It does not move a verdict, and it does not')
  console.log('  change the CONFIRMED result in section K, which concerns W-B alone.')

  head('L. WHAT THIS RUN DOES NOT ESTABLISH')
  console.log('  - No engine is selected, adopted, deployed, implemented or cleared.')
  console.log('  - No candidate verdict moves.  N1-N6, DA-1..DA-7, E1-E4, EV1-EV13,')
  console.log('    G-Q4..G-Q7.8 and strict Shape-1 are untouched.')
  console.log('  - Neither prior record is re-opened, weakened or superseded.  Both stand as')
  console.log('    taken; this run measures a variable neither controlled.')
  console.log('  - One subject and one build.  §4.6 S10 forbids generalizing this to SQLite')
  console.log('    as a product or to an engine class.')
  console.log('  - Byte-scanning sees literal markers.  Re-encoded, compressed or partially')
  console.log('    overwritten content would be missed, and absence remains "not sufficient')
  console.log('    alone" (DA-5 row 3).')
  console.log('  - Filesystem-, block-device- and encryption-at-rest residue is outside DA-3')
  console.log('    scope and was not measured.')
  console.log('  - The residue itself is NOT a violation of N6.1 (DA-4 row 1: its provenance')
  console.log('    is the transition).  The finding is what the request then did with it.')

  console.log()
  console.log('END OF PROBE -- VALID')
  return 0
}

process.exit(main())
