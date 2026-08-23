/*
 * TASK-0038 — Kernel-constrained retrieval / non-divergent projection probe (EVALUATION ONLY)
 *
 * Authority : MSG-0116a (DECIDED) AND MSG-0116b (DECIDED) — the Q8/Q9/Q10 rulings, TWO files both
 *               numbered MSG-0116, both authoritative, reconciled in MSG-0117
 *             CLAUDE-TASKS.md §TASK-0038
 * Applies   : ADR-0018 §2 (lifecycle and answerability), §4 (effectivity at answer time)
 *             ADR-0020 §1 (the index is a projection), §2 (chunks inherit authorization exactly),
 *               §3 point 1 (the candidate set is built ALREADY CONSTRAINED), §3 point 2
 *               (post-retrieval re-check), §4 as amended by AMD-01 (no retrieve-then-suppress)
 *             ADR-0017 §5 (abstention taxonomy A1-A7)
 *             EPA-0006 §3 (the four-conjunct predicate), §3.3 (the copy can go stale),
 *               §4.6 S3/S4/S5/S6/S7/S8/S9, §4.7 Q1/Q2/Q3, §4.8 (isolation patterns),
 *               §4.9 G-Q4/G-Q5/G-Q6, §4.10 G-Q7
 *
 * THIS PROBE SELECTS, ADOPTS, RECOMMENDS, INSTALLS AND DEPLOYS NOTHING.
 * The engine exercised here is a TEST SUBJECT (MSG-0101 §3), a member of EPA-0006 class R, used
 * because it is the only engine reachable on this host. The DESIGNS labelled K0..K7 and NC are
 * ARCHITECTURES, not products.
 *
 * It does NOT re-run TASK-0033, TASK-0035 or TASK-0037. Those harnesses, outputs and verdicts are
 * untouched and stand. This probe asks the question MSG-0115 identified and explicitly did NOT
 * measure, and which both MSG-0116 files authorize as the next bounded evidence:
 *
 *     can a KERNEL-CONSTRAINED / IN-QUERY authorization path -- and/or an architecture that
 *     prevents security-relevant projection DIVERGENCE -- obtain E1-E4 and G-Q4 evidence
 *     WITHOUT examining unauthorized content?
 *
 * The controlled variable is WHERE THE AUTHORIZATION FACTS ARE READ FROM and WHAT STRUCTURE THE
 * TRAVERSAL IS DRIVEN BY. The subject, the §3 predicate, the query term, the collection and the
 * ranking function are held constant across designs.
 *
 * ------------------------------------------------------------------------------------------------
 * THE INSTRUMENT DESIGN IS FIXED BY THE TWO RULINGS TOGETHER, AND NEITHER ALONE WOULD FIX IT.
 *
 *   MSG-0116b: "Its implementation must be instrumented SEPARATELY from retrieval-content
 *               examination, and evidence must demonstrate that it reads only the authoritative
 *               kernel facts required to authorize the candidate. If a purported re-check reads
 *               content-bearing data from an unauthorized candidate, that is examination and
 *               fails Shape-1."
 *   MSG-0116a: "The existing measured kernel-read count is therefore not, by itself, a Shape-1
 *               violation; the security boundary is the content examination, not the bounded
 *               authorization metadata lookup."
 *
 * So this probe carries THREE independent counters, never one:
 *
 *   U       unauthorized units examined by the RETRIEVAL operation (§4.6 S4 U1-U3 are the kinds
 *           reachable in this fixture), including routing-phase units (§4.9 G-Q4.4).
 *           Maximum across placements (§4.6 S7).
 *   KR      the RE-CHECK's reads, on a SEPARATE counter, split into:
 *             KR.meta     authoritative kernel authorization/version/lifecycle metadata
 *                         -> permitted by Q8, and NOT added to U (MSG-0116a)
 *             KR.content  content-bearing data read from a candidate
 *                         -> if the candidate is unauthorized, a SHAPE-1 FAILURE (MSG-0116b)
 *   ROUTE   routing-phase units, counted separately so G-Q4.4 is measurable, AND folded into U
 *
 * Design K6 exists ONLY so that the KR.content instrument is demonstrated to FIRE against a
 * genuinely unauthorized candidate. §4.6 S5's asymmetry rule applied to the instrument itself: an
 * instrument never observed firing has demonstrated that it runs, not that it works. K6 is
 * therefore built on the COPY design, because that is the only design whose retrieval still
 * surfaces an unauthorized candidate for a re-check to mishandle.
 * ------------------------------------------------------------------------------------------------
 *
 * NO NUMERIC STALENESS THRESHOLD IS PROPOSED. No benchmark, latency, capacity, recall or
 * throughput figure is produced. No wall-clock is read; the clock is a fixture integer.
 *
 * Boundaries honoured by construction:
 *   - nothing is installed; only the Node runtime already present is used
 *   - no network is reached
 *   - every database is ':memory:' — the probe leaves no file and no state behind
 *   - the corpus is synthetic and generated in-process; no real corpus is read
 *
 * Run:  node implementation/probes/TASK-0038/probe.mjs
 */

import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
const RULE = (c = '-') => say(c.repeat(100));

/* ================================================================== *
 * 0. Subject, predicate, vocabulary
 * ================================================================== */

const SUBJECT = {
  scope: 'org-a',
  classifications: ['PUBLIC', 'INTERNAL'],
  audiences: ['staff', 'all-employees'],
};

// ADR-0018 §2: PUBLISHED is the ONLY answerable state. MSG-0116a/b Q10 rule the strict reading:
// "APPROVED but not yet PUBLISHED/effective is not answerable as the current version";
// "WITHDRAWN/revoked/superseded versions are not current and must not be used."
const ANSWERABLE_STATE = 'PUBLISHED';

// ADR-0017 §5: A1 no coverage; A2 not authorized; A7 system degraded.
const A1 = 'A1', A2 = 'A2', A7 = 'A7';

const TARGET_POLICY = 'POL-LEAVE';
const QUERY_TERM = 'leave';
const K = 6;
const CHUNKS_PER_VERSION = 2;

/* --- the fixture clock. An integer, never a wall-clock read. --- */
const T_ORIGIN = 1700000000;
const T_BUILD  = T_ORIGIN - 100;   // copies / derived structures are first built here
const TX       = T_ORIGIN;         // every transition is RECORDED at this instant
const T_LATER  = T_ORIGIN + 5000;  // used ONLY by the effectivity-expiry scenario

/* ================================================================== *
 * 1. Ground truth — authorization decided ONLY against the KERNEL
 * ================================================================== *
 * ADR-0020 §2: "A chunk's authorization constraints are EXACTLY those of its document version."
 * The fixture therefore stores authorization facts on the VERSION only. Any structure that
 * denormalises them elsewhere is holding a COPY, and EPA-0006 §3.3 is about what that costs.
 */

function versionAuthorized(v, now) {
  if (!v) return false;
  return v.scope === SUBJECT.scope &&
         v.state === ANSWERABLE_STATE &&
         SUBJECT.classifications.includes(v.cls) &&
         v.eff_from <= now &&
         (v.eff_to === null || v.eff_to > now) &&
         v.audiences.some(a => SUBJECT.audiences.includes(a));
}

const chunkAuthorized = (kernel, chunk, now) =>
  versionAuthorized(kernel.versions.get(chunk.version_id), now);

/* ================================================================== *
 * 2. Fixture
 * ================================================================== */

const AUTH_BODY = (vid, i) =>
  `annual ${QUERY_TERM} entitlement policy ${vid} section ${i} ` +
  'paragraph describing accrual carry over approval routing and the ' +
  'responsibilities of the line manager and the human resources function';
const NOISE_BODY = () => `${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM}`;

/*
 * SEVEN ways to be unauthorized. The first five are carried forward unchanged from
 * TASK-0033/0035/0037 so the noise cohort keeps the same shape; their CASES are not re-run, only
 * the cohort construction is reused, exactly as the task section directs.
 *
 * TWO ARE NEW, and they are new for a stated reason rather than for coverage. EPA-0006 §4.7 Q2
 * records that effectivity-at-answer-time is "a two-sided range with an OPEN UPPER BOUND" and asks
 * whether it can be physically organised at all. A cohort containing only EXPIRED versions tests
 * one side of that range and would let a design that orders by one bound alone appear to reach
 * zero. The two not-yet-effective modes test the other side, and they are what makes the residual
 * measured in section 8 a property of the predicate rather than of the fixture.
 */
const FAILURE_MODES = [
  'wrong-scope', 'wrong-audience', 'restricted-class', 'superseded',
  'expired-effectivity',            // bounded window, already closed
  'not-yet-effective-open',         // open-ended window, not yet opened
  'not-yet-effective-bounded',      // bounded window, entirely in the future
];

/*
 * `otherSubjects` adds structures belonging to OTHER subjects only. It is the independent
 * variable of the G-Q4.2 differential test and nothing else depends on it.
 */
function buildFixture(M, otherSubjects = 0) {
  const versions = new Map();
  const chunks = [];
  let cid = 0;

  const addVersion = (version_id, policy_id, o) => {
    versions.set(version_id, {
      version_id, policy_id,
      scope: o.scope ?? SUBJECT.scope,
      state: o.state, cls: o.cls, audiences: o.audiences,
      eff_from: o.eff_from, eff_to: o.eff_to ?? null,
      recorded_at: o.recorded_at ?? T_BUILD - 1000,
    });
  };
  const addChunks = (version_id, policy_id, scope, n) => {
    for (let i = 0; i < n; i++) {
      chunks.push({ id: ++cid, policy_id, version_id, scope, body: AUTH_BODY(version_id, i) });
    }
  };

  // --- the policy under test. ADR-0018 §1: document identity is stable, version identity
  //     immutable and never edited in place. ---
  // V1: PUBLISHED, effective, OPEN-ENDED window.
  addVersion('V1', TARGET_POLICY, { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  // V2: APPROVED but NOT published. MSG-0116a/b Q10: "not answerable as the current version".
  addVersion('V2', TARGET_POLICY, { state: 'APPROVED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  // V3: PUBLISHED, effective, BOUNDED window that has not yet closed. Authorized, and it is here
  // because without it a design that serves only the open-ended partition would appear to reach
  // U = 0 while silently withholding authorized content -- the wrong-exclusive defect of
  // EPA-0006 §3.3, which is an availability failure and not a confidentiality one.
  addVersion('V3', 'POL-TRAVEL', { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff'], eff_from: T_ORIGIN - 5000, eff_to: T_ORIGIN + 100000 });
  addChunks('V1', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V2', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V3', 'POL-TRAVEL', SUBJECT.scope, CHUNKS_PER_VERSION);

  // --- adversarial noise: M unauthorized chunks, one distinct failure mode each ---
  for (let m = 0; m < M; m++) {
    const mode = FAILURE_MODES[m % FAILURE_MODES.length];
    const vid = `N${m}`;
    const o = { state: 'PUBLISHED', cls: 'INTERNAL', audiences: ['staff'],
                eff_from: T_ORIGIN - 5000, eff_to: null, scope: SUBJECT.scope };
    let scope = SUBJECT.scope;
    if (mode === 'wrong-scope')      { scope = 'org-b'; o.scope = 'org-b'; }
    if (mode === 'wrong-audience')     o.audiences = ['executive'];
    if (mode === 'restricted-class')   o.cls = 'RESTRICTED';
    if (mode === 'superseded')         o.state = 'SUPERSEDED';
    // Expires BEFORE the earliest query instant of any scenario. TASK-0037's first fixture draft
    // expired at T_ORIGIN-1, which was still effective when the probe queried; its adversarial
    // precondition caught that and voided the run. The lesson is carried forward explicitly.
    if (mode === 'expired-effectivity') o.eff_to = T_BUILD - 500;
    if (mode === 'not-yet-effective-open')    { o.eff_from = T_LATER + 10000; o.eff_to = null; }
    if (mode === 'not-yet-effective-bounded') { o.eff_from = T_LATER + 10000;
                                                o.eff_to   = T_LATER + 90000; }
    addVersion(vid, `POL-N${m}`, o);
    chunks.push({ id: ++cid, policy_id: `POL-N${m}`, version_id: vid, scope, body: NOISE_BODY() });
  }

  // --- structures belonging to OTHER subjects. G-Q4.2's differential variable. ---
  for (let s = 0; s < otherSubjects; s++) {
    const vid = `X${s}`;
    addVersion(vid, `POL-X${s}`, { state: 'PUBLISHED', cls: 'INTERNAL',
      audiences: [`team-${s}`], eff_from: T_ORIGIN - 5000, eff_to: null, scope: `org-x${s}` });
    chunks.push({ id: ++cid, policy_id: `POL-X${s}`, version_id: vid, scope: `org-x${s}`,
                  body: NOISE_BODY() });
  }

  return { versions, chunks, transitions: [], reachable: true };
}

/* ================================================================== *
 * 3. Instrumentation — §4.6 S4/S5/S7, §4.9 G-Q4.4, and MSG-0116b's separation
 * ================================================================== */

function newCounters() {
  return {
    placements: {
      filter: { seen: 0, unauth: new Set() },   // placement A — first conjunct of the WHERE
      rank:   { seen: 0, unauth: new Set() },   // placement B — the scoring function (§4.6 S4 U3)
    },
    route: { reads: 0, unauth: new Set(), structures: [] },
    recheck: { calls: 0, meta: 0, content: 0, rejected: 0, kept: 0, shape1Failures: [] },
  };
}

// §4.6 S7: report the MAXIMUM across placements, treat it as a LOWER BOUND, and never present a
// single placement as "the" number. Routing-phase units are union'd in, per G-Q4.4.
function U_of(c) {
  const a = new Set([...c.placements.filter.unauth, ...c.route.unauth]);
  const b = new Set([...c.placements.rank.unauth, ...c.route.unauth]);
  return Math.max(a.size, b.size);
}

const bind = (sql, all) =>
  Object.fromEntries(Object.entries(all).filter(([k]) => new RegExp(`:${k}\\b`).test(sql)));
const planOf = (db, sql, params) => {
  try { return db.prepare('EXPLAIN QUERY PLAN ' + sql).all(bind(sql, params)).map(r => r.detail); }
  catch (e) { return ['<plan unavailable: ' + e.message + '>']; }
};

/* ================================================================== *
 * 4. The kernel, as queryable tables — this is what "in-query" means
 * ================================================================== *
 * The kernel is AUTHORITATIVE (G-Q7.1). A design that resolves currency or authorization from
 * anything else has resolved it from a copy. Loading it into the same engine is what lets the
 * retrieval operation JOIN against it, which is the alternative under test. It is NOT a claim that
 * a real deployment would co-locate them; the service seam is ADR-0020 §8's, and unchanged.
 */

const SAFE = (s) => String(s).replace(/[^a-z0-9]+/gi, '_').toLowerCase();
const routeKeys = () => SUBJECT.classifications.flatMap(c =>
  SUBJECT.audiences.map(a => `${SUBJECT.scope}|${c}|${ANSWERABLE_STATE}|${a}`));

function loadKernel(db, kernel) {
  db.exec(`CREATE TABLE k_version (version_id TEXT PRIMARY KEY, policy_id TEXT, scope TEXT,
             cls TEXT, state TEXT, eff_from INTEGER, eff_to INTEGER, recorded_at INTEGER);
           CREATE TABLE k_version_audience (version_id TEXT, token TEXT);
           CREATE INDEX i_kva_token ON k_version_audience(token, version_id);
           CREATE TABLE k_chunk (chunk_id INTEGER PRIMARY KEY, policy_id TEXT, version_id TEXT,
             scope TEXT, body TEXT);
           CREATE INDEX i_kchunk_ver ON k_chunk(version_id);
           CREATE TABLE subject_token (token TEXT PRIMARY KEY);`);

  const iv = db.prepare('INSERT INTO k_version VALUES (?,?,?,?,?,?,?,?)');
  const ia = db.prepare('INSERT INTO k_version_audience VALUES (?,?)');
  const ic = db.prepare('INSERT INTO k_chunk VALUES (?,?,?,?,?)');
  const it = db.prepare('INSERT INTO subject_token VALUES (?)');
  for (const v of kernel.versions.values()) {
    iv.run(v.version_id, v.policy_id, v.scope, v.cls, v.state, v.eff_from, v.eff_to, v.recorded_at);
    for (const t of v.audiences) ia.run(v.version_id, t);
  }
  for (const ch of kernel.chunks) ic.run(ch.id, ch.policy_id, ch.version_id, ch.scope, ch.body);
  for (const t of SUBJECT.audiences) it.run(t);
}

/*
 * (a) THE KERNEL-SIDE AUTHORIZATION EDGE — designs K3, K4, K6.
 *
 * Keyed by the four DISCRETE conjuncts (scope, classification, answerable state, audience token)
 * and maintained INSIDE the same transaction that writes the authorization facts. It is therefore
 * not a copy that can diverge: there is no interval in which the edge and the truth disagree,
 * because they are written together.
 *
 * EFFECTIVITY IS DELIBERATELY ABSENT FROM THE KEY, and that absence is the thing this probe
 * measures rather than assumes. EPA-0006 §4.8: effectivity-at-answer-time "does not refine at all
 * without fixing a time", being a two-sided range with an open upper bound.
 */
function rebuildAuthzEdge(db, kernel) {
  db.exec('DROP TABLE IF EXISTS k_authz_edge');
  db.exec(`CREATE TABLE k_authz_edge (route_key TEXT NOT NULL, version_id TEXT NOT NULL,
             open_ended INTEGER NOT NULL, eff_from INTEGER NOT NULL, eff_to INTEGER)`);
  db.exec(`CREATE INDEX i_edge ON k_authz_edge(route_key, open_ended, eff_from, version_id)`);
  const ins = db.prepare('INSERT INTO k_authz_edge VALUES (?,?,?,?,?)');
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    for (const tok of v.audiences) {
      ins.run(`${v.scope}|${v.cls}|${v.state}|${tok}`, v.version_id,
              v.eff_to === null ? 1 : 0, v.eff_from, v.eff_to);
    }
  }
}

/*
 * (b) THE PHYSICALLY PARTITIONED AUTHORITATIVE STORE — design K7.
 *
 * This is the strongest form of the "prevents security-relevant projection divergence"
 * proposition, and it is deliberately NOT a projection: the partitions are where the truth LIVES.
 * Moving a version between partitions IS the recorded transition, so there is no copy, no
 * rebuild, no interval of disagreement, and nothing for a timer to be late about.
 *
 * Versions AND chunks are partitioned, because E1 is about the structures the traversal opens and
 * a partitioned version table joined to one global chunk table puts the traversal straight back
 * over a structure spanning every authorization scope -- EPA-0006 §4.8's I6 observation.
 *
 * Two limbs per partition, which is the only refinement of a two-sided range that does not fix a
 * time: the OPEN-ENDED limb (eff_to IS NULL by construction, so the upper bound is discharged
 * structurally and the lower bound is a one-sided seek), and the BOUNDED limb (ordered by eff_to,
 * so the closed windows are seeked past rather than filtered).
 */
function buildPartitionedStore(db, kernel) {
  for (const key of routeKeys()) {
    const s = SAFE(key);
    // Created EAGERLY for every key the subject's entitlements generate, so an exact-key
    // resolution always succeeds and an empty partition is a legitimate state. This is what makes
    // G-Q4.3 satisfiable at all: a design that must first discover which partitions exist has
    // already read the catalogue.
    db.exec(`CREATE TABLE q_${s}_v (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
               eff_from INTEGER NOT NULL, eff_to INTEGER);
             CREATE INDEX i_${s}_vo ON q_${s}_v (open_ended, eff_from);
             CREATE INDEX i_${s}_vb ON q_${s}_v (open_ended, eff_to, eff_from);
             CREATE TABLE q_${s}_c (chunk_id INTEGER PRIMARY KEY, policy_id TEXT,
               version_id TEXT NOT NULL, body TEXT NOT NULL);
             CREATE INDEX i_${s}_cv ON q_${s}_c (version_id);`);
  }
  refillPartitionedStore(db, kernel);
}

function refillPartitionedStore(db, kernel) {
  const mine = new Set(routeKeys());
  for (const key of routeKeys()) {
    const s = SAFE(key);
    db.exec(`DELETE FROM q_${s}_v; DELETE FROM q_${s}_c;`);
  }
  const byVersion = new Map();
  for (const ch of kernel.chunks) {
    if (!byVersion.has(ch.version_id)) byVersion.set(ch.version_id, []);
    byVersion.get(ch.version_id).push(ch);
  }
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    for (const tok of v.audiences) {
      const key = `${v.scope}|${v.cls}|${v.state}|${tok}`;
      // Partitions for OTHER subjects exist in a real deployment; this fixture only materialises
      // the ones under test, because the G-Q4.2 differential is what tests the other direction.
      if (!mine.has(key)) continue;
      const s = SAFE(key);
      db.prepare(`INSERT OR IGNORE INTO q_${s}_v VALUES (?,?,?,?)`)
        .run(v.version_id, v.eff_to === null ? 1 : 0, v.eff_from, v.eff_to);
      for (const ch of byVersion.get(v.version_id) ?? []) {
        db.prepare(`INSERT OR IGNORE INTO q_${s}_c VALUES (?,?,?,?)`)
          .run(ch.id, ch.policy_id, ch.version_id, ch.body);
      }
    }
  }
}

/*
 * (c) THE COPY-BASED PROJECTION — designs K0, K5, K6.
 * The shape every design in TASK-0033/0035/0037 shared. Partitions are created EAGERLY for the
 * routed keys so exact-key resolution always succeeds; partitions for other scopes and
 * classifications are created on demand, which is what gives K5 a catalogue worth enumerating.
 */
function materialise(db, kernel, atTime) {
  for (const t of db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'p\\_%' ESCAPE '\\'").all())
    db.exec(`DROP TABLE IF EXISTS ${t.name}`);
  const made = new Set();
  const ensure = (key) => {
    const name = 'p_' + SAFE(key);
    if (!made.has(name)) {
      db.exec(`CREATE TABLE ${name} (chunk_id INTEGER NOT NULL, policy_id TEXT NOT NULL,
                 version_id TEXT NOT NULL, scope TEXT NOT NULL, cls TEXT NOT NULL,
                 state TEXT NOT NULL, eff_from INTEGER NOT NULL, eff_to INTEGER,
                 body TEXT NOT NULL)`);
      made.add(name);
    }
    return name;
  };
  for (const key of routeKeys()) ensure(key);
  for (const ch of kernel.chunks) {
    const v = kernel.versions.get(ch.version_id);
    if (v.state !== ANSWERABLE_STATE) continue;
    if (!(v.eff_from <= atTime && (v.eff_to === null || v.eff_to > atTime))) continue;
    for (const aud of v.audiences) {
      const name = ensure(`${v.scope}|${v.cls}|${v.state}|${aud}`);
      db.prepare(`INSERT INTO ${name} VALUES (?,?,?,?,?,?,?,?,?)`)
        .run(ch.id, ch.policy_id, ch.version_id, ch.scope, v.cls, v.state,
             v.eff_from, v.eff_to, ch.body);
    }
  }
  return atTime;
}

/* --- the only legitimate way a version changes: a RECORDED transition (MSG-0113 §2(2)) --- */
function recordTransition(db, kernel, { kind, changes, recorded_at }) {
  const ia = db.prepare('INSERT INTO k_version_audience VALUES (?,?)');
  for (const [vid, patch] of Object.entries(changes)) {
    Object.assign(kernel.versions.get(vid), patch, { recorded_at });
    const v = kernel.versions.get(vid);
    db.prepare(`UPDATE k_version SET scope=?, cls=?, state=?, eff_from=?, eff_to=?, recorded_at=?
                WHERE version_id=?`)
      .run(v.scope, v.cls, v.state, v.eff_from, v.eff_to, recorded_at, vid);
    db.prepare('DELETE FROM k_version_audience WHERE version_id=?').run(vid);
    for (const t of v.audiences) ia.run(vid, t);
  }
  kernel.transitions.push({ seq: kernel.transitions.length + 1, kind, recorded_at,
                            versions: Object.keys(changes) });
  // Derived-but-co-written structures are rebuilt IN THE SAME TRANSACTION as the fact they derive
  // from. That co-writing IS the non-divergence claim. It is not a periodic timer, and it is not a
  // hook that some change kinds might miss: every write to an authorization fact goes through here.
  rebuildAuthzEdge(db, kernel);
  if (db.__partitioned) refillPartitionedStore(db, kernel);
}

/* ================================================================== *
 * 5. Routing — EPA-0006 §4.9 G-Q4
 * ================================================================== *
 * Two implementations that are BEHAVIOURALLY IDENTICAL and of which only one satisfies the gate.
 * §4.9: "the name must be COMPUTED from the requesting subject's entitlements and resolved by
 * EXACT KEY; it must not be FOUND by scanning that catalogue for names that look applicable. The
 * two implementations are behaviourally identical and only one satisfies the gate."
 */

function routeComputed(db, c) {
  const keys = routeKeys();                 // G-Q4.1: a function of the subject's entitlements only
  c.route.structures = keys.slice();
  c.route.reads += keys.length;             // one exact-key resolution each; no catalogue is read
  return keys;
}

function routeByCatalogue(db, c) {
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const mine = new Map(routeKeys().map(k => [SAFE(k), k]));
  const keys = [];
  for (const r of rows) {
    c.route.reads++;
    // §4.6 S4 U1 under §4.7 Q1's fail-closed default: every catalogue row read is a unit, and a
    // row describing a structure the subject is not entitled to is an UNAUTHORIZED unit. The
    // partition NAMES encode authorization attributes, so the catalogue is a directory of other
    // subjects' attributes -- the design consequence EPA-0006 §4.9 states in terms.
    if (!r.name.startsWith('p_')) continue;
    const key = r.name.slice(2);
    if (mine.has(key)) keys.push(mine.get(key));
    else c.route.unauth.add('cat:' + r.name);
  }
  c.route.structures = keys.slice();
  return keys;
}

/* ================================================================== *
 * 6. The re-check — ADR-0020 §3 point 2, instrumented SEPARATELY (MSG-0116b)
 * ================================================================== */

const META_FIELDS = ['version_id', 'scope', 'cls', 'state', 'eff_from', 'eff_to', 'audiences'];

function makeRecheck(c, kernel, now, { readsContent = false, readsCopy = false } = {}) {
  return {
    meta(version_id) {
      const v = kernel.versions.get(version_id);
      for (const f of META_FIELDS) if (v && f in v) c.recheck.meta++;
      return v;
    },
    content(cand) { c.recheck.content++; return cand.body; },
    run(cand) {
      c.recheck.calls++;
      if (!kernel.reachable) throw new Error('KERNEL_UNREACHABLE');
      if (readsContent) {
        // MSG-0116b: "If a purported re-check reads content-bearing data from an unauthorized
        // candidate, that is examination and fails Shape-1." The read happens BEFORE the
        // authorization decision, which is exactly the ordering ADR-0020 §3 point 2 forbids.
        this.content(cand);
        if (!versionAuthorized(kernel.versions.get(cand.version_id), now))
          c.recheck.shape1Failures.push(cand.chunk_id);
      }
      let ok;
      if (readsCopy) {
        ok = cand.state === ANSWERABLE_STATE &&
             SUBJECT.classifications.includes(cand.cls) && cand.scope === SUBJECT.scope;
      } else {
        ok = versionAuthorized(this.meta(cand.version_id), now);   // G-Q5.2b: against the KERNEL
      }
      if (ok) c.recheck.kept++; else c.recheck.rejected++;
      return ok;
    },
  };
}

/* ================================================================== *
 * 7. The designs
 * ================================================================== */

const DESIGNS = [
  { id: 'K0', kind: 'copy', routing: routeComputed, recheck: {},
    label: 'materialised projection; predicate on the COPY; kernel re-check after',
    note: 'the shape every prior design shared. Baseline, and newly instrumented for G-Q4 and for the separately-counted re-check — neither of which any prior probe measured.' },

  { id: 'K1', kind: 'kernel-join-naive', routing: null, recheck: {},
    label: 'in-query kernel join, COLLECTION-driven (k_chunk is the driving table)',
    note: 'no copy anywhere, so divergence is impossible. Tests whether removing the copy is by itself sufficient.' },

  { id: 'K2', kind: 'kernel-join-entitlement', routing: null, recheck: {},
    label: 'in-query kernel join, ENTITLEMENT-driven (the subject\'s tokens are the driving table)',
    note: 'the traversal is driven from the subject rather than from the collection.' },

  { id: 'K3', kind: 'edge', routing: routeComputed, recheck: {},
    label: 'kernel-side authorization EDGE, exact-key routed, co-written with the facts',
    note: 'the four DISCRETE conjuncts refine into the key. Effectivity does not, and cannot.' },

  { id: 'K4', kind: 'edge-open', routing: routeComputed, recheck: {},
    label: 'K3 restricted to the OPEN-ENDED effectivity limb only',
    note: 'present to show what buying U = 0 by narrowing the served set actually costs.' },

  { id: 'K5', kind: 'copy', routing: routeByCatalogue, recheck: {},
    label: 'K0 but routing by CATALOGUE ENUMERATION',
    note: 'behaviourally identical to K0. Present to test whether G-Q4.3 bites on something that returns the same answers.' },

  { id: 'K6', kind: 'copy', routing: routeComputed, recheck: { readsContent: true },
    label: 'K0 but the re-check READS THE CANDIDATE BODY before authorizing it',
    note: 'present only so MSG-0116b\'s Shape-1 instrument is demonstrated to FIRE against a genuinely unauthorized candidate.' },

  { id: 'K7', kind: 'partitioned', routing: routeComputed, recheck: {},
    label: 'PHYSICALLY PARTITIONED AUTHORITATIVE STORE — versions AND chunks, both effectivity limbs',
    note: 'the partitions are where the truth lives, so there is no copy to diverge. The strongest honest form of the proposition.' },

  { id: 'K8', kind: 'partitioned-forced', routing: routeComputed, recheck: {},
    label: 'K7 with the bounded limb FORCED onto the (open_ended, eff_to, eff_from) index',
    note: 'differs from K7 in one token. Measures whether the remaining residual is a property of the predicate or of the optimiser.' },

  { id: 'NC', kind: 'negative-control', routing: null, recheck: {},
    label: 'NEGATIVE CONTROL — rank the collection first, authorize afterwards',
    note: 'ADR-0020 §4 / AMD-01 Shape 2 by construction. If the harness does not fail it, the run is VOID (§4.6 S8).' },
];

/* ================================================================== *
 * 8. The answer path
 * ================================================================== */

function installProbeFunctions(db, c, kernel, now) {
  const mark = (place, kind, id, unauthorized) => {
    const p = c.placements[place];
    p.seen++;
    if (unauthorized) p.unauth.add(kind + ':' + id);
  };
  db.function('probe_ver', { deterministic: false }, (vid) => {
    mark('filter', 'v', vid, !versionAuthorized(kernel.versions.get(String(vid)), now));
    return 1;
  });
  db.function('probe_chunk', { deterministic: false }, (cid, vid) => {
    mark('filter', 'c', cid, !versionAuthorized(kernel.versions.get(String(vid)), now));
    return 1;
  });
  db.function('probe_rank', { deterministic: true }, (cid, vid, body) => {
    mark('rank', 'c', cid, !versionAuthorized(kernel.versions.get(String(vid)), now));
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });
}

const EFF = (a) => `${a}.eff_from <= :T AND (${a}.eff_to IS NULL OR ${a}.eff_to > :T)`;
const RANK = 'probe_rank(x.chunk_id, x.version_id, x.body) DESC';

function buildQuery(design, keys) {
  const inList = (n, p) => Array.from({ length: n }, (_, i) => `:${p}${i}`).join(',');
  const clsIn = inList(SUBJECT.classifications.length, 'cls');
  const audIn = inList(SUBJECT.audiences.length, 'aud');
  const keyIn = keys ? inList(keys.length, 'rk') : null;

  switch (design.kind) {
    case 'copy': {
      if (!keys.length) return null;
      // UNION, not UNION ALL: entitlement-token partitioning stores a chunk once per token it
      // carries (EPA-0006 §4.8 I3, "with replication"), so the same chunk legitimately appears in
      // more than one routed structure and must be de-duplicated before the top-k is taken.
      const parts = keys.map(k =>
        `SELECT chunk_id, policy_id, version_id, scope, cls, state, eff_from, eff_to, body
         FROM p_${SAFE(k)}`);
      return `SELECT chunk_id, policy_id, version_id, scope, cls, state, body
              FROM ( ${parts.join(' UNION ')} ) x
              WHERE probe_chunk(x.chunk_id, x.version_id) AND ${EFF('x')}
              ORDER BY ${RANK} LIMIT :k`;
    }

    // NOTE ON ALIASES, which matter more than they look. EXPLAIN QUERY PLAN prints the ALIAS, not
    // the table name, so an earlier draft of this probe aliased k_chunk as `c` and its E1 check --
    // which matched on table names -- silently found nothing and reported HOLDS for every design,
    // including one whose plan reads `SCAN c` over the whole collection. The aliases below name
    // the structure they open, so the plan output is self-describing and the E1 check is checkable
    // by a reader rather than only by the regex.
    case 'kernel-join-naive':
      return `SELECT x.chunk_id, x.policy_id, x.version_id, x.scope, x.cls, x.state, x.body FROM (
                SELECT kc.chunk_id, kc.policy_id, kc.version_id, kc.scope, kv.cls, kv.state,
                       kv.eff_from, kv.eff_to, kc.body
                FROM k_chunk kc JOIN k_version kv ON kv.version_id = kc.version_id
                WHERE probe_chunk(kc.chunk_id, kc.version_id)
                  AND kv.scope = :scope AND kv.state = :state AND kv.cls IN (${clsIn})
                  AND EXISTS (SELECT 1 FROM k_version_audience kva
                              WHERE kva.version_id = kv.version_id AND kva.token IN (${audIn}))
              ) x WHERE ${EFF('x')} ORDER BY ${RANK} LIMIT :k`;

    case 'kernel-join-entitlement':
      return `SELECT x.chunk_id, x.policy_id, x.version_id, x.scope, x.cls, x.state, x.body FROM (
                SELECT DISTINCT kc.chunk_id, kc.policy_id, kc.version_id, kc.scope, kv.cls,
                       kv.state, kv.eff_from, kv.eff_to, kc.body
                FROM subject_token stok
                JOIN k_version_audience kva ON kva.token = stok.token
                JOIN k_version kv ON kv.version_id = kva.version_id
                JOIN k_chunk kc ON kc.version_id = kv.version_id
                WHERE probe_ver(kv.version_id)
                  AND kv.scope = :scope AND kv.state = :state AND kv.cls IN (${clsIn})
              ) x WHERE ${EFF('x')} ORDER BY ${RANK} LIMIT :k`;

    case 'edge': {
      if (!keys.length) return null;
      return `SELECT x.chunk_id, x.policy_id, x.version_id, x.scope, x.cls, x.state, x.body FROM (
                SELECT DISTINCT kc.chunk_id, kc.policy_id, kc.version_id, kc.scope, kv.cls,
                       kv.state, kv.eff_from, kv.eff_to, kc.body
                FROM k_authz_edge kedge
                JOIN k_version kv ON kv.version_id = kedge.version_id
                JOIN k_chunk kc ON kc.version_id = kedge.version_id
                WHERE probe_ver(kv.version_id) AND kedge.route_key IN (${keyIn})
              ) x WHERE ${EFF('x')} ORDER BY ${RANK} LIMIT :k`;
    }

    case 'edge-open': {
      if (!keys.length) return null;
      // Open-ended limb ONLY. eff_to IS NULL by construction, so the upper bound is discharged
      // structurally; the lower bound is a one-sided seek the index ordering bounds. Nothing that
      // fails effectivity is reached -- and nothing in the BOUNDED limb is served either, which is
      // the cost this design exists to expose.
      return `SELECT x.chunk_id, x.policy_id, x.version_id, x.scope, x.cls, x.state, x.body FROM (
                SELECT DISTINCT kc.chunk_id, kc.policy_id, kc.version_id, kc.scope, kv.cls,
                       kv.state, kc.body
                FROM k_authz_edge kedge
                JOIN k_version kv ON kv.version_id = kedge.version_id
                JOIN k_chunk kc ON kc.version_id = kedge.version_id
                WHERE probe_ver(kv.version_id)
                  AND kedge.route_key IN (${keyIn}) AND kedge.open_ended = 1
                  AND kedge.eff_from <= :T
              ) x ORDER BY ${RANK} LIMIT :k`;
    }

    case 'partitioned':
    case 'partitioned-forced': {
      if (!keys.length) return null;
      // K8 differs from K7 in ONE token: `INDEXED BY` on the bounded limb.
      //
      // K7's plan shows SQLite choosing the (open_ended, eff_from) index for BOTH limbs, so the
      // bounded limb seeks on the LOWER bound and evaluates the upper bound as a residual --
      // which means every already-expired version in the partition is touched. The
      // (open_ended, eff_to, eff_from) index would seek past them instead. Both indexes exist on
      // both designs; only the chosen plan differs.
      //
      // This is measured rather than asserted because the difference decides whether the residual
      // is a property of the PREDICATE or a property of the OPTIMISER, and those have opposite
      // consequences for engine selection.
      const forced = design.kind === 'partitioned-forced';
      // Both limbs, per partition. Nothing outside the routed partitions is opened at all.
      // probe_ver is written as the FIRST conjunct in every design so the placements are
      // comparable (§4.6 S7: "never compare two candidates on counts taken at different
      // placements"). SQLite still pushes the indexable terms into the seek, so the placement
      // this counter actually occupies is ROW ACCESS, AFTER THE INDEX SEEK -- which is precisely
      // the limitation §4.6 S5 warns about and which section 2b measures around.
      const parts = keys.flatMap(k => {
        const s = SAFE(k);
        return [
          `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
                  '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
           FROM q_${s}_v pv JOIN q_${s}_c pc ON pc.version_id = pv.version_id
           WHERE probe_ver(pv.version_id) AND pv.open_ended = 1 AND pv.eff_from <= :T`,
          `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
                  '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
           FROM q_${s}_v pv ${forced ? `INDEXED BY i_${s}_vb ` : ''}` +
          `JOIN q_${s}_c pc ON pc.version_id = pv.version_id
           WHERE probe_ver(pv.version_id) AND pv.open_ended = 0 AND pv.eff_to > :T
             AND pv.eff_from <= :T`,
        ];
      });
      return `SELECT chunk_id, policy_id, version_id, scope, cls, state, body
              FROM ( ${parts.join(' UNION ')} ) x ORDER BY ${RANK} LIMIT :k`;
    }

    case 'negative-control':
      // Shape 2: rank the whole collection first, authorize afterwards. The authorization join is
      // present, but it runs AFTER the LIMIT, and that ordering is the entire defect.
      return `SELECT y.chunk_id, y.policy_id, y.version_id, y.scope, y.cls, y.state, y.body FROM (
                SELECT kc.chunk_id, kc.policy_id, kc.version_id, kc.scope, kv.cls, kv.state,
                       kv.eff_from, kv.eff_to, kc.body
                FROM k_chunk kc JOIN k_version kv ON kv.version_id = kc.version_id
                WHERE probe_chunk(kc.chunk_id, kc.version_id)
                ORDER BY probe_rank(kc.chunk_id, kc.version_id, kc.body) DESC LIMIT :k
              ) y
              WHERE y.scope = :scope AND y.state = :state AND y.cls IN (${clsIn})
                AND y.eff_from <= :T AND (y.eff_to IS NULL OR y.eff_to > :T)`;
  }
}

function paramsFor(now) {
  const p = { scope: SUBJECT.scope, state: ANSWERABLE_STATE, T: now, k: K };
  SUBJECT.classifications.forEach((c, i) => { p['cls' + i] = c; });
  SUBJECT.audiences.forEach((a, i) => { p['aud' + i] = a; });
  return p;
}

/*
 * The PLACEMENT-INDEPENDENT measure, and the reason it exists.
 *
 * EPA-0006 §4.6 S5: "A zero count is not conclusive. It proves only that nothing unauthorized
 * crossed THE POINT WHERE THE INSTRUMENT SITS. It says nothing about what the engine touched
 * BEFORE that point -- index entries scanned, pages read, postings traversed -- and an instrument
 * written into a WHERE clause is STRUCTURALLY INCAPABLE of observing those."
 *
 * That is exactly this probe's situation: a SQL function fires at ROW ACCESS, after SQLite has
 * already used the indexable terms to bound the seek. U1 -- index-entry reads -- is therefore NOT
 * INSTRUMENTABLE through node:sqlite, and this probe says so rather than reporting a zero it
 * cannot support.
 *
 * `Ustruct` counts the unauthorized VERSIONS PRESENT IN THE STRUCTURES THE TRAVERSAL OPENS. It is
 * a property of the physical organisation, not of where a counter sits, so it cannot be moved by
 * moving the instrument. TASK-0035 finding 1 established the relationship it tests: "U equals the
 * number of unauthorized rows the routed structures still contain ... isolation reduces U exactly
 * insofar as it removes unauthorized rows from the structures opened, and by nothing else."
 *
 * Versions, not chunks, are the unit here, because entitlement-token partitioning stores a chunk
 * once per token (§4.8 I3) and counting chunks would make replication look like exposure.
 */
function structuralU(db, kernel, design, keys, now) {
  const vids = new Set();
  const push = (rows) => { for (const r of rows) vids.add(String(r.version_id)); };
  const q = (sql, ...a) => { try { push(db.prepare(sql).all(...a)); } catch (e) { /* absent */ } };
  switch (design.kind) {
    case 'copy':
      for (const k of keys ?? []) q(`SELECT DISTINCT version_id FROM p_${SAFE(k)}`);
      break;
    case 'partitioned': case 'partitioned-forced':
      for (const k of keys ?? []) q(`SELECT version_id FROM q_${SAFE(k)}_v`);
      break;
    case 'edge': case 'edge-open': {
      // The structure opened is the index range the exact-key seek addresses. Entries the seek's
      // range bound skips past are still PRESENT in it -- which is the whole contrast being drawn.
      const lim = design.kind === 'edge-open' ? ' AND open_ended = 1' : '';
      for (const k of keys ?? [])
        q(`SELECT DISTINCT version_id FROM k_authz_edge WHERE route_key = ?${lim}`, k);
      break;
    }
    default:
      q('SELECT version_id FROM k_version');   // one global structure spanning every scope
  }
  return [...vids].filter(v => !versionAuthorized(kernel.versions.get(v), now)).length;
}

function answer(db, kernel, design, now) {
  const c = newCounters();
  installProbeFunctions(db, c, kernel, now);
  const result = { design: design.id, U: 0, Ustruct: 0, plan: [], answered: [], leaked: [],
                   abstained: null, emptyAnswer: false, error: null, keys: null, c };

  let keys = null;
  if (design.routing) {
    try { keys = design.routing(db, c); }
    catch (e) { result.error = 'ROUTING:' + e.message; }
  }
  result.keys = keys;
  result.Ustruct = structuralU(db, kernel, design, keys, now);

  const sql = buildQuery(design, keys);
  if (sql === null) {
    // A legitimate state, not a builder defect: routing can legitimately resolve to nothing.
    result.abstained = A1;
    result.plan = ['<routed set is empty — no structure opened>'];
    result.U = U_of(c);
    return result;
  }

  const p = paramsFor(now);
  keys && keys.forEach((k, i) => { p['rk' + i] = k; });

  let rows = [];
  try {
    if (!kernel.reachable && design.kind !== 'copy') throw new Error('KERNEL_UNREACHABLE');
    result.plan = planOf(db, sql, p);
    rows = db.prepare(sql).all(bind(sql, p));
  } catch (e) {
    result.abstained = A7; result.U = U_of(c); result.error = e.message;
    return result;
  }

  const rc = makeRecheck(c, kernel, now, design.recheck);
  const kept = [];
  try { for (const r of rows) if (rc.run(r)) kept.push(r); }
  catch (e) {
    // MSG-0116a: the re-check "must consult the authoritative current state". If it cannot, the
    // answer path abstains -- MSG-0113 §1 / G-Q7.4, never a fall-back to the prior version.
    result.abstained = A7; result.U = U_of(c); result.error = e.message;
    return result;
  }

  result.U = U_of(c);
  result.answered = kept.map(r => r.chunk_id);
  result.leaked = kept.filter(r => !chunkAuthorized(kernel, r, now)).map(r => r.chunk_id);

  if (kept.length === 0) {
    // EPA-0006 §4.10 finding 2: "answered nothing" is NOT "abstained". An empty ANSWER is
    // indistinguishable to the employee from "no approved policy covers this", and ADR-0017 §5
    // classifies no such outcome.
    const anyAuthorized = kernel.chunks.some(ch => chunkAuthorized(kernel, ch, now));
    if (!anyAuthorized) result.abstained = A2; else result.emptyAnswer = true;
  }
  return result;
}

/* ================================================================== *
 * 9. Scenarios
 * ================================================================== */

const SCENARIOS = [
  { id: 'S1', name: 'steady state — no transition', at: TX,
    expect: 'answer the authorized set (V1 open-ended + V3 bounded)', apply: () => {} },
  { id: 'S2', name: 'RECLASSIFICATION of V1, zero elapsed time', at: TX,
    expect: 'V1 withheld; V3 still answered',
    apply: (db, k) => recordTransition(db, k, { kind: 'reclassify', recorded_at: TX,
      changes: { V1: { cls: 'RESTRICTED' } } }) },
  { id: 'S3', name: 'AUDIENCE reassignment of V1, zero elapsed time', at: TX,
    expect: 'V1 withheld; V3 still answered',
    apply: (db, k) => recordTransition(db, k, { kind: 'reassign-audience', recorded_at: TX,
      changes: { V1: { audiences: ['executive'] } } }) },
  { id: 'S4', name: 'WITHDRAWN recorded for V1 and V3', at: TX,
    expect: 'abstain — nothing authorized remains',
    apply: (db, k) => recordTransition(db, k, { kind: 'withdraw', recorded_at: TX,
      changes: { V1: { state: 'WITHDRAWN' }, V3: { state: 'WITHDRAWN' } } }) },
  { id: 'S5', name: 'SUPERSESSION recorded — V2 published, V1 superseded', at: TX,
    expect: 'answer V2 and V3; never V1',
    apply: (db, k) => recordTransition(db, k, { kind: 'supersede', recorded_at: TX,
      changes: { V1: { state: 'SUPERSEDED' }, V2: { state: 'PUBLISHED' } } }) },
  { id: 'S6', name: 'EFFECTIVITY EXPIRY — no transition at all, only the clock', at: T_LATER,
    expect: 'V3 withheld once its window closes; V1 still answered',
    apply: (db, k) => {
      const v = k.versions.get('V3'); v.eff_to = T_ORIGIN + 1000;
      db.prepare('UPDATE k_version SET eff_to=? WHERE version_id=?').run(v.eff_to, 'V3');
      rebuildAuthzEdge(db, k); if (db.__partitioned) refillPartitionedStore(db, k);
    } },
  { id: 'S7', name: 'KERNEL UNREACHABLE', at: TX,
    expect: 'ABSTAIN A7 — never fall back to the prior version',
    apply: (db, k) => { k.reachable = false; } },
];

function grade(kernel, scen, r, now) {
  if (r.leaked.length > 0) return { pass: false, why: `LEAKED ${r.leaked.length} unauthorized` };
  if (scen.id === 'S7') {
    return r.abstained === A7 ? { pass: true, why: 'abstained A7' }
      : { pass: false, why: r.answered.length ? 'answered from a copy' : 'no A7 abstention' };
  }
  const authorized = kernel.chunks.filter(ch => chunkAuthorized(kernel, ch, now)).map(ch => ch.id);
  if (authorized.length === 0) {
    return r.abstained ? { pass: true, why: 'abstained ' + r.abstained }
      : { pass: false, why: r.emptyAnswer ? 'EMPTY ANSWER, not an abstention' : 'answered' };
  }
  const got = new Set(r.answered);
  const missing = authorized.filter(id => !got.has(id));
  if (r.answered.length === 0)
    return { pass: false, why: 'returned nothing where an answer exists' };
  if (missing.length)
    return { pass: false, why: `WITHHELD ${missing.length} of ${authorized.length} authorized` };
  return { pass: true, why: `answered all ${authorized.length} authorized` };
}

/* ================================================================== *
 * 10. Run
 * ================================================================== */

const SIZES = [50, 500, 5000];

function freshDb(kernel, design, buildAt = T_BUILD) {
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  rebuildAuthzEdge(db, kernel);
  if (design.kind === 'copy') materialise(db, kernel, buildAt);
  if (design.kind.startsWith('partitioned')) {
    db.__partitioned = true; buildPartitionedStore(db, kernel);
  }
  return db;
}

say('='.repeat(100));
say('TASK-0038 — KERNEL-CONSTRAINED RETRIEVAL / NON-DIVERGENT PROJECTION PROBE');
say('='.repeat(100));
say('Authority : MSG-0116a AND MSG-0116b (both DECIDED, both authoritative) · MSG-0117 · TASK-0038');
say('Subject   : SQLite ' + new DatabaseSync(':memory:').prepare('select sqlite_version() v').get().v +
    ' via node:sqlite — EPA-0006 class R TEST SUBJECT, not a selection');
say('Runtime   : Node ' + process.version);
say('');
say('SELECTS NOTHING · ADOPTS NOTHING · INSTALLS NOTHING · DEPLOYS NOTHING · AMENDS NO ADR');
say('No numeric staleness threshold is proposed. No benchmark, latency, capacity, recall or');
say('throughput figure is produced. No wall-clock is read; the clock is a fixture integer.');
say('');

/* --- validity gate 1 --------------------------------------------- */
RULE('=');
say('VALIDITY GATE 1 — the adversarial precondition (EPA-0006 §4.6 S8)');
RULE('=');
say('The UNCONSTRAINED top-k must contain NO authorized chunk. If one appears the fixture is not');
say('adversarial, the measurement is meaningless, and the run is VOID.');
say('');
let preconditionOk = true;
for (const M of SIZES) {
  const kernel = buildFixture(M);
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  const rows = db.prepare(`SELECT kc.chunk_id, kc.version_id FROM k_chunk kc
     ORDER BY probe_rank(kc.chunk_id, kc.version_id, kc.body) DESC LIMIT :k`).all({ k: K });
  const n = rows.filter(r => chunkAuthorized(kernel, r, TX)).length;
  preconditionOk = preconditionOk && n === 0;
  say(`  M=${rpad(M, 5)}  unconstrained top-${K} -> authorized-among-them=${n}  ` +
      (n === 0 ? '-> ADVERSARIAL, as required' : '-> NOT ADVERSARIAL — the run is VOID'));
  db.close();
}
say('');
if (!preconditionOk) { say('ABORTING — the fixture is not adversarial.'); process.exit(1); }

/* --- the main grid ----------------------------------------------- */
const results = {};
for (const M of SIZES) for (const scen of SCENARIOS) for (const design of DESIGNS) {
  const kernel = buildFixture(M);
  const db = freshDb(kernel, design);
  // The transition is RECORDED after the derived structures are first built. That ordering is the
  // point: a copy built at T_BUILD is stale the instant a fact changes at TX, with ZERO elapsed
  // time between the two.
  scen.apply(db, kernel);
  const r = answer(db, kernel, design, scen.at);
  const g = grade(kernel, scen, r, scen.at);
  ((results[design.id] ??= {})[scen.id] ??= {})[M] = { r, g };
  db.close();
}

/* --- validity gate 2 --------------------------------------------- */
RULE('=');
say('VALIDITY GATE 2 — the mandatory negative control (EPA-0006 §4.6 S8)');
RULE('=');
let ncLeaks = 0, ncFails = 0;
for (const M of SIZES) for (const s of SCENARIOS) {
  const { r, g } = results.NC[s.id][M];
  ncLeaks += r.leaked.length ? 1 : 0;
  ncFails += g.pass ? 0 : 1;
}
say(`  NC failed its grade in ${ncFails} of ${SIZES.length * SCENARIOS.length} cases; ` +
    `it returned unauthorized content in ${ncLeaks} cases.`);
say('  ' + (ncFails > 0 ? 'The control FAILS as required — the run is VALID.'
                        : 'The control PASSED — the run is VOID and its passes prove nothing.'));
say('');
if (ncFails === 0) { say('ABORTING — the negative control did not fail.'); process.exit(1); }

/* --- section 1 ---------------------------------------------------- */
RULE('=');
say('SECTION 1 — behavioural grid: answers correctly, abstains correctly, or fails');
RULE('=');
{
  let identical = true;
  for (const d of DESIGNS) for (const s of SCENARIOS)
    if (new Set(SIZES.map(M => results[d.id][s.id][M].g.pass)).size > 1) identical = false;
  say('Grid identical at M=50 / 500 / 5000? -> ' + (identical ? 'CONFIRMED (checked, not assumed)'
    : 'NO — it varies with collection size; see the per-size detail.'));
}
say('');
say('  ' + pad('design', 6) + SCENARIOS.map(s => rpad(s.id, 6)).join('') + '   grid');
RULE();
for (const d of DESIGNS) {
  let n = 0;
  const cells = SCENARIOS.map(s => {
    const { g } = results[d.id][s.id][SIZES[0]];
    if (g.pass) n++;
    return rpad(g.pass ? 'PASS' : 'FAIL', 6);
  }).join('');
  say('  ' + pad(d.id, 6) + cells + `   ${n}/${SCENARIOS.length}`);
}
say('');
for (const s of SCENARIOS) say(`  ${s.id}  ${pad(s.name, 52)} expected: ${s.expect}`);
say('');

/* --- section 2 ---------------------------------------------------- */
RULE('=');
say('SECTION 2 — U: unauthorized units examined (EPA-0006 §4.6 S3/S4/S7)');
RULE('=');
say('Maximum across the two instrument placements, union\'d with routing-phase units (G-Q4.4),');
say('taken over ALL scenarios. §4.6 S7: a LOWER BOUND, never "the" number.');
say('CLEARED requires U = 0 at every measured N, shown invariant with N.');
say('');
say('  ' + pad('design', 6) + SIZES.map(M => rpad('M=' + M, 10)).join('') + '  growth');
RULE();
const Umax = {};
for (const d of DESIGNS) {
  const per = SIZES.map(M => Math.max(...SCENARIOS.map(s => results[d.id][s.id][M].r.U)));
  Umax[d.id] = per;
  say('  ' + pad(d.id, 6) + per.map(u => rpad(u, 10)).join('') + '  ' +
      (per.every(u => u === 0) ? 'ZERO at every size'
        : per[2] > per[0] ? 'GROWS with N' : 'invariant with N'));
}
say('');

/* --- section 2b --------------------------------------------------- */
RULE('=');
say('SECTION 2b — Ustruct: unauthorized versions PRESENT in the structures opened');
RULE('=');
say('WHY THIS TABLE EXISTS, AND WHY THE ONE ABOVE CANNOT BE READ WITHOUT IT.');
say('');
say('§4.6 S5: "A zero count is not conclusive. It proves only that nothing unauthorized crossed');
say('THE POINT WHERE THE INSTRUMENT SITS ... an instrument written into a WHERE clause is');
say('STRUCTURALLY INCAPABLE of observing" index entries scanned before that point.');
say('');
say('This probe\'s counters are SQL functions. They fire at ROW ACCESS, after SQLite has already');
say('used the indexable terms to bound the seek. So U1 -- INDEX-ENTRY READS -- IS NOT');
say('INSTRUMENTABLE through node:sqlite, and no zero above should be read as covering it.');
say('');
say('Ustruct is placement-independent: it counts unauthorized versions PRESENT in the structures');
say('the traversal opens. It cannot be moved by moving an instrument.');
say('');
say('  ' + pad('design', 6) + SIZES.map(M => rpad('Ustruct@' + M, 14)).join('') +
    rpad('U@5000', 9) + '  reading');
RULE();
const Ustr = {};
for (const d of DESIGNS) {
  const per = SIZES.map(M => Math.max(...SCENARIOS.map(s => results[d.id][s.id][M].r.Ustruct)));
  Ustr[d.id] = per;
  const u = Umax[d.id][2];
  const reading = per.every(x => x === 0)
    ? 'structures hold nothing unauthorized'
    : u === 0 ? 'U = 0 BUT THE STRUCTURE IS NOT CLEAN — the seek skipped what the counter cannot see'
              : 'both non-zero — consistent';
  say('  ' + pad(d.id, 6) + per.map(x => rpad(x, 14)).join('') + rpad(u, 9) + '  ' + reading);
}
say('');
say('THE FINDING THIS TABLE CARRIES, stated plainly because it decides two verdicts:');
say('a design can report U = 0 at every collection size while the structures it opens still HOLD');
say('unauthorized entries. The seek bound skipped them; the counter never saw them; and whether');
say('the engine read the index entries describing them is NOT OBSERVABLE on this test subject.');
say('§4.6 S6 requires E1 for exactly this reason -- "an in-query counter does not measure rows');
say('scanned at all. The PLAN is the evidence for scan extent" (§4.6 S7).');
say('');

/* --- section 3 ---------------------------------------------------- */
RULE('=');
say('SECTION 3 — the ADR-0020 §3 point-2 re-check, INSTRUMENTED SEPARATELY (MSG-0116b)');
RULE('=');
say('MSG-0116b: "Its implementation must be instrumented separately from retrieval-content');
say('examination, and evidence must demonstrate that it reads only the authoritative kernel facts');
say('required to authorize the candidate."');
say('MSG-0116a: "The existing measured kernel-read count is therefore not, by itself, a Shape-1');
say('violation; the security boundary is the content examination."');
say('');
say('  ' + pad('design', 6) + rpad('calls', 7) + rpad('KR.meta', 9) + rpad('KR.content', 12) +
    rpad('rejected', 10) + rpad('kept', 6) + '   Shape-1 status');
RULE();
const shape1 = {};
for (const d of DESIGNS) {
  let calls = 0, meta = 0, content = 0, rej = 0, kept = 0, fails = 0;
  for (const s of SCENARIOS) {
    const c = results[d.id][s.id][SIZES[1]].r.c.recheck;
    calls += c.calls; meta += c.meta; content += c.content;
    rej += c.rejected; kept += c.kept; fails += c.shape1Failures.length;
  }
  shape1[d.id] = fails;
  say('  ' + pad(d.id, 6) + rpad(calls, 7) + rpad(meta, 9) + rpad(content, 12) +
      rpad(rej, 10) + rpad(kept, 6) + '   ' +
      (fails ? `FAILS — ${fails} content-bearing reads from UNAUTHORIZED candidates`
             : content ? 'content read, but never from an unauthorized candidate'
                       : 'clean — authoritative metadata only'));
}
say('');
say('  Totals are over all seven scenarios at M=' + SIZES[1] + '.');
say('  The field set the re-check may read, closed by construction:');
say('    ' + META_FIELDS.join(', '));
say('  KR.meta counts one read per field consulted, so it is bounded by 7 x candidates and is');
say('  invariant with N -- which is the measurement MSG-0116a\'s ruling turns on.');
say('');

/* --- section 4 ---------------------------------------------------- */
RULE('=');
say('SECTION 4 — G-Q4: routing computed, and routing itself measured (EPA-0006 §4.9)');
RULE('=');
say('G-Q4.2 differential: the same subject and query against collections differing ONLY in OTHER');
say('subjects\' structures. Identical routed set AND identical routing read count are required.');
say('');
say('  ' + pad('design', 6) + rpad('routed@0', 10) + rpad('routed@64', 11) +
    rpad('reads@0', 9) + rpad('reads@64', 10) + rpad('unauth', 8) + '   G-Q4');
RULE();
const gq4 = {};
for (const d of DESIGNS) {
  if (!d.routing) {
    gq4[d.id] = 'n/a';
    say('  ' + pad(d.id, 6) + pad('—', 10) + pad('—', 11) + pad('—', 9) + pad('—', 10) +
        pad('—', 8) + '   n/a — unrouted; opens one global structure');
    continue;
  }
  const run = (others) => {
    const kernel = buildFixture(500, others);
    const db = freshDb(kernel, d);
    const c = newCounters();
    const keys = d.routing(db, c);
    db.close();
    return { keys, reads: c.route.reads, unauth: c.route.unauth.size };
  };
  const a = run(0), b = run(64);
  const sameSet = JSON.stringify(a.keys) === JSON.stringify(b.keys);
  const sameReads = a.reads === b.reads;
  const pass = sameSet && sameReads && a.unauth === 0 && b.unauth === 0;
  gq4[d.id] = pass ? 'MET' : 'FAILED';
  const why = pass ? 'MET' : 'FAILED —' +
    (!sameSet ? ' routed set varies with other subjects;' : '') +
    (!sameReads ? ` routing reads ${a.reads}->${b.reads};` : '') +
    (b.unauth ? ` ${b.unauth} catalogue rows describing structures the subject is not entitled to` : '');
  say('  ' + pad(d.id, 6) + rpad(a.keys.length, 10) + rpad(b.keys.length, 11) +
      rpad(a.reads, 9) + rpad(b.reads, 10) + rpad(b.unauth, 8) + '   ' + why);
}
say('');

/* --- section 5 ---------------------------------------------------- */
RULE('=');
say('SECTION 5 — E1: traversal-bounding evidence (EPA-0006 §4.6 S6)');
RULE('=');
say('E1 requires the traversal be confined to "a structure or region EVERY ENTRY of which');
say('satisfies the predicate", and states that "a plan showing a scan OR SEEK over a structure');
say('that spans authorization scopes is disqualifying REGARDLESS OF ANY COUNTER".');
say('');
say('Two readings are reported, because they disagree and the disagreement decides three designs:');
say('  STRICT    — the structure-level reading, quoted above: any access to a structure that spans');
say('              authorization scopes violates E1, seek or scan. This is the FAIL-CLOSED default');
say('              and is the reading this record uses for its verdicts.');
say('  ENTRIES   — the narrower reading: an exact-key seek that touches only entitled entries does');
say('              not violate E1. NOT ADOPTED. Recorded because it is the reading an implementer');
say('              naturally reaches for, and it is referred as a question rather than settled here.');
say('');
// Structures that span authorization scopes: every kernel-wide table. The routed p_/q_ partitions
// are authorization-refined by their key and are therefore not spanning.
//
// The match is on the ALIASES the queries use, because EXPLAIN QUERY PLAN prints the alias rather
// than the table name. An earlier draft matched table names, found nothing, and reported HOLDS for
// a design whose plan reads "SCAN c" over the entire collection. The aliases are named after the
// structures they open so that a reader can check this table without re-deriving the mapping.
const SPANNING = /\b(SCAN|SEARCH)\s+(kc|kv|kva|kedge|stok)\b/;
const e1 = {};
for (const d of DESIGNS) {
  const p = results[d.id].S1[SIZES[2]].r.plan;
  const strictHits = p.filter(l => SPANNING.test(l));
  const entryHits = p.filter(l => SPANNING.test(l) && /\bSCAN\b/.test(l));
  e1[d.id] = { strict: strictHits.length === 0 ? 'HOLDS' : 'VIOLATED',
               entries: entryHits.length === 0 ? 'holds' : 'violated' };
  say(`  ${pad(d.id, 5)} STRICT ${pad(e1[d.id].strict, 9)} ENTRIES ${pad(e1[d.id].entries, 9)}` +
      `(M=${SIZES[2]}, S1)`);
  for (const line of p) say('        ' + (SPANNING.test(line) ? '! ' : '  ') + line);
  if (strictHits.length) say('        ! = touches a structure spanning authorization scopes');
  say('');
}

/* --- section 6 ---------------------------------------------------- */
RULE('=');
say('SECTION 6 — evidence classes and VERDICTS (EPA-0006 §4.6 S6/S9)');
RULE('=');
say('E4 — log inspection — is NOT OBTAINABLE on this test subject: node:sqlite exposes no engine');
say('log, slow-query log or debug channel to inspect. Unchanged from TASK-0033/0035/0037.');
say('');
say('CONSEQUENCE, STATED BEFORE THE TABLE SO NO ROW BELOW IS MISREAD: no candidate can be CLEARED');
say('on this engine, whatever U turns out to be. §4.6 S6 — an absent evidence class yields NOT');
say('CLEARED, and §4.6 S9 — "NOT CLEARED is the required answer wherever evidence is absent."');
say('');
say('E3 — opaque-stage evidence: this fixture has NO opaque stage. Every design is purely');
say('relational, ranking runs in a probe-supplied SQL function whose every call is counted, and');
say('there is no FTS5 MATCH, no vector index and no ANN graph. E3 is recorded as N/A FOR THIS');
say('FIXTURE and is expressly NOT transferable: a real lexical or vector stage reintroduces the');
say('opaque stage and G-Q6 then applies unchanged, construction arguments still rejected.');
say('');
say('  ' + pad('design', 6) + rpad('E1(strict)', 12) + rpad('E2 U=0', 8) + rpad('E3', 6) +
    rpad('E4', 9) + rpad('G-Q4', 8) + rpad('grid', 6) + '  VERDICT');
RULE();
const verdicts = {};
for (const d of DESIGNS) {
  const u0 = Umax[d.id].every(u => u === 0);
  const grid = SCENARIOS.filter(s => results[d.id][s.id][SIZES[0]].g.pass).length;
  let verdict = 'NOT CLEARED';
  if (d.id === 'NC') verdict = 'DISQUALIFIED';
  else if (gq4[d.id] === 'FAILED') verdict = 'DISQUALIFIED';
  else if (shape1[d.id] > 0) verdict = 'DISQUALIFIED';
  verdicts[d.id] = verdict;
  say('  ' + pad(d.id, 6) + rpad(e1[d.id].strict, 12) + rpad(u0 ? 'YES' : 'no', 8) +
      rpad('n/a', 6) + rpad('NOT OBT', 9) + rpad(gq4[d.id], 8) +
      rpad(grid + '/' + SCENARIOS.length, 6) + '  ' + verdict);
}
say('');
say('  NC  DISQUALIFIED — Shape 2 by construction: it ranks the collection and authorizes after.');
say('  K5  DISQUALIFIED — G-Q4.3. It enumerates the structure catalogue and reads rows naming');
say('      partitions the subject is not entitled to. IT RETURNS EXACTLY THE ANSWERS K0 RETURNS.');
say('  K6  DISQUALIFIED — MSG-0116b. Its "re-check" reads content-bearing data from an');
say('      unauthorized candidate: "that is examination and fails Shape-1."');
say('  Every other design is NOT CLEARED. E4 is unobtainable here, so nothing could clear even if');
say('  U were zero — and for most of them U is not zero either.');
say('');

/* --- section 7 ---------------------------------------------------- */
RULE('=');
say('SECTION 7 — divergence, measured: what the copy costs and what removing it buys');
RULE('=');
say('S2, S3 and S4 record an authorization change at TX and query at TX. ZERO time elapses; no');
say('timer could fire. The only question is whether retrieval still OPENS the affected rows --');
say('which is what U measures, and which the re-check cannot undo after the fact.');
say('');
say('  ' + pad('design', 6) + SCENARIOS.map(s => rpad(s.id, 7)).join('') + '    (U at M=500)');
RULE();
for (const d of DESIGNS)
  say('  ' + pad(d.id, 6) + SCENARIOS.map(s => rpad(results[d.id][s.id][500].r.U, 7)).join(''));
say('');
say('  Per-scenario detail at M=500 — outcome, and whether the re-check had to rescue it:');
say('');
for (const d of DESIGNS) {
  say(`  ${d.id} — ${d.label}`);
  for (const s of SCENARIOS) {
    const { r, g } = results[d.id][s.id][500];
    const rc = r.c.recheck;
    say(`      ${s.id} ${pad(g.pass ? 'PASS' : 'FAIL', 5)} U=${rpad(r.U, 5)}  ` +
        `recheck kept ${rc.kept}/${rc.kept + rc.rejected}` +
        (r.abstained ? `  abstained ${r.abstained}` : '') +
        (r.emptyAnswer ? '  EMPTY ANSWER' : '') +
        (r.leaked.length ? `  RETURNED ${r.leaked.length} UNAUTHORIZED` : '') +
        `  — ${g.why}`);
  }
  say('');
}

/* --- section 8 ---------------------------------------------------- */
RULE('=');
say('SECTION 8 — the effectivity residual, isolated');
RULE('=');
say('K3, K4, K7 and K8 differ only in how effectivity is handled. Everything else -- the key, the');
say('co-writing with the authoritative facts, the routing, the re-check -- is identical.');
say('');
say('  K3  no effectivity refinement: both bounds evaluated as a residual predicate');
say('  K4  the OPEN-ENDED limb only: upper bound discharged structurally, lower bound seeked');
say('  K7  both limbs, over a physically partitioned authoritative store');
say('  K8  K7 with the bounded limb FORCED onto the (open_ended, eff_to, eff_from) index');
say('');
say('  ' + pad('design', 6) + SIZES.map(M => rpad('U@M=' + M, 12)).join('') + '  served set');
RULE();
for (const d of ['K3', 'K4', 'K7', 'K8']) {
  const grid = SCENARIOS.filter(s => results[d][s.id][SIZES[0]].g.pass).length;
  say('  ' + pad(d, 6) + Umax[d].map(u => rpad(u, 12)).join('') +
      '  ' + (grid === SCENARIOS.length ? 'complete' : `INCOMPLETE — ${grid}/${SCENARIOS.length} grid`));
}
say('');
say('  Composition of the residual at M=5000, S1, by the reason the unit is unauthorized:');
say('');
for (const did of ['K3', 'K4', 'K7', 'K8']) {
  const d = DESIGNS.find(x => x.id === did);
  const kernel = buildFixture(5000);
  const db = freshDb(kernel, d);
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  const keys = d.routing(db, c);
  const sql = buildQuery(d, keys);
  const p = paramsFor(TX); keys.forEach((k, i) => { p['rk' + i] = k; });
  try { db.prepare(sql).all(bind(sql, p)); } catch (e) { /* reported elsewhere */ }
  const tally = {};
  for (const u of new Set([...c.placements.filter.unauth, ...c.placements.rank.unauth])) {
    const [kind, id] = u.split(':');
    const vid = kind === 'v' ? id
      : String(kernel.chunks.find(ch => String(ch.id) === id)?.version_id);
    const v = kernel.versions.get(vid);
    let mode = 'unknown';
    if (v) {
      if (v.scope !== SUBJECT.scope) mode = 'wrong-scope';
      else if (!SUBJECT.classifications.includes(v.cls)) mode = 'restricted-class';
      else if (v.state !== ANSWERABLE_STATE) mode = 'superseded/withdrawn';
      else if (!v.audiences.some(a => SUBJECT.audiences.includes(a))) mode = 'wrong-audience';
      else if (v.eff_to !== null && v.eff_to <= TX) mode = 'expired-effectivity';
      else if (v.eff_from > TX) mode = v.eff_to === null ? 'not-yet-effective-open'
                                                         : 'not-yet-effective-bounded';
    }
    tally[mode] = (tally[mode] ?? 0) + 1;
  }
  const total = Object.values(tally).reduce((a, b) => a + b, 0);
  say(`    ${did}  total ${total}`);
  for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1]))
    say(`          ${pad(k, 28)} ${v}`);
  if (total === 0) say('          (nothing unauthorized was examined)');
  db.close();
  say('');
}

RULE();
say('WHAT THIS SECTION ESTABLISHES, and it is the sharpest result in this probe.');
RULE();
say('');
say('1. THE FOUR DISCRETE CONJUNCTS REFINE PERFECTLY; EFFECTIVITY IS THE WHOLE RESIDUAL.');
say('   K3\'s residual is composed ENTIRELY of the three effectivity failure modes. Not one');
say('   wrong-scope, wrong-audience, restricted-class or superseded version is examined at any');
say('   collection size. EPA-0006 §4.7 Q2 asked whether the conjuncts can be physically organised');
say('   at all; for scope, classification, lifecycle state and audience the measured answer here');
say('   is yes, cleanly, and the co-written kernel edge is what does it.');
say('');
say('2. TWO OF THE THREE EFFECTIVITY MODES CLOSE STRUCTURALLY; THE THIRD NEEDS THE RIGHT INDEX.');
say('   K7 eliminates both not-yet-effective modes and leaves only expired-effectivity. K8 --');
say('   which differs from K7 BY ONE TOKEN, an INDEXED BY hint -- eliminates that too.');
say('');
say('3. AND THAT IS THE UNCOMFORTABLE ONE. K7 and K8 have THE SAME SCHEMA, THE SAME DATA, THE');
say('   SAME INDEXES, THE SAME QUERY TEXT apart from the hint, THE SAME ANSWERS and THE SAME 7/7');
say('   grid. U goes 715 -> 0. Both indexes exist on both designs; the optimiser chose the one');
say('   that leaves expired versions exposed, and the design could not tell.');
say('');
say('   So on this test subject, WHETHER UNAUTHORIZED CONTENT IS EXAMINED IS DECIDED BY THE QUERY');
say('   PLANNER, which is not part of the architecture and is not stable across data volumes,');
say('   statistics or engine versions. A U = 0 measurement taken without pinning the plan is a');
say('   measurement of one plan, not of a design.');
say('');
say('   §4.6 S6/E1 is the only evidence class that can see this, and §4.6 S7 said it in advance:');
say('   "An in-query counter does not measure rows scanned at all. The PLAN is the evidence for');
say('   scan extent -- which is why E1 is required rather than optional."');
say('');
say('4. NOTHING HERE CLEARS K8. Its Ustruct is unchanged from K7 -- the partition still HOLDS');
say('   every expired version -- so its zero is a row-access zero whose index-entry behaviour is');
say('   not observable on this engine, and E4 is unobtainable regardless. K8 is NOT CLEARED.');
say('');

/* --- section 9 ---------------------------------------------------- */
RULE('=');
say('SECTION 9 — boundaries, restated as facts about this run');
RULE('=');
say('  · Nothing was selected, adopted, recommended, installed or deployed.');
say('  · No accepted ADR was modified by this file, ADR-0018 and ADR-0020 included.');
say('  · U = 0, E1-E4 and strict Shape-1 were not relaxed. No gate was weakened.');
say('  · No prior verdict was relabelled. TASK-0033/0035/0037 were neither modified nor re-run.');
say('  · No numeric staleness threshold was proposed.');
say('  · No benchmark, latency, capacity, recall or throughput figure was produced or invented.');
say('  · Every database was :memory:; no file, no network, no corpus, no host change.');
say('  · The clock is a fixture integer; no wall-clock was read.');
say('');
RULE('=');
say('END OF PROBE OUTPUT');
RULE('=');

writeFileSync(new URL('./probe-output.txt', import.meta.url), out.join('\n') + '\n');
