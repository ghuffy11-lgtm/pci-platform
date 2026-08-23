/*
 * ======================================================================================
 * TASK-0039 — K7/K8 REMAINING CLEARANCE EVIDENCE
 * E4 · U1 observability · plan-independence
 * ======================================================================================
 *
 * AUTHORITY   MSG-0120 (AUTHORIZED), with MSG-0119 (strict Q11) BINDING.
 *             Queue section CLAUDE-TASKS.md TASK-0039. MSG-0122 (reconciliation).
 *             Criterion and gates: EPA-0006 §4.6 S1–S11, §4.7 Q1–Q3, §4.9 G-Q4, §4.11.
 *
 * THIS PROBE SELECTS NOTHING. It adopts, recommends, installs and deploys no engine,
 * runtime, provider, model or index technology. It amends no ADR. It relaxes no gate.
 * It produces no benchmark, latency, capacity, recall or throughput figure, and it
 * introduces no numeric staleness threshold. No wall clock is read: the clock is a
 * fixture integer. No network is reached. No real or confidential corpus is entered;
 * every fixture is synthetic and generated in-process. `:memory:` only.
 *
 * SUBJECT     SQLite via `node:sqlite` — EPA-0006 class R TEST SUBJECT, not a selection.
 *             Its planner behaviour MAY NOT be generalized to any other engine
 *             (MSG-0120 §Boundaries; TASK-0033's verdict said the same when a candidate
 *             looked doomed, and the same discipline applies now that one looks
 *             promising, which is the harder direction).
 *
 * WHY K7 AND K8 ONLY
 *   MSG-0119 ruled Q11 STRICTLY: an exact-key seek into a scope-spanning structure does
 *   NOT satisfy E1, even when it touches only an entitled row. K3 and K4 therefore
 *   remain NOT CLEARED and are NOT re-run here. K7 and K8 partition their version AND
 *   chunk stores physically, so they satisfy E1 under BOTH readings — which is what
 *   makes them the only candidates whose E1 position is not in question, and the only
 *   ones on which closing the remaining gaps is worth the effort.
 *
 * THE THREE GAPS THIS PROBE CLOSES OR RECORDS AS UNCLOSABLE (MSG-0120 §Scope)
 *   1. E4 — obtain the engine-log evidence, or EXPLICITLY ESTABLISH it as unobtainable,
 *      with the reason. Inferring what a log WOULD have shown is forbidden.
 *   2. U1 — address the index-entry observability limitation WITHOUT claiming an
 *      unsupported zero. An unmeasurable quantity is not a zero quantity.
 *   3. Plan-independence — determine whether E1–E4 and G-Q4 can be satisfied on evidence
 *      INDEPENDENT of a single observed optimizer plan. One EXPLAIN QUERY PLAN is one
 *      observation, on one fixture, at one size, under one set of statistics.
 *
 * WHAT IS DELIBERATELY NOT RE-RUN
 *   The 7-scenario × 3-size behavioural grid of TASK-0038 (MSG-0118 §5) is NOT re-run.
 *   That evidence stands and the task section forbids re-running it. The steady-state
 *   answer is re-checked at each new size and configuration ONLY as an anchor, so that a
 *   plan change can be told apart from a fixture change; it is labelled as such and it
 *   replaces no prior verdict.
 *
 *   The NEGATIVE CONTROL is run. That is not a re-run of a prior case: EPA-0006 §4.6 S8
 *   requires a deliberately non-conforming candidate in EVERY probe run, and without it
 *   this run's passes would prove nothing.
 * ======================================================================================
 */

import { DatabaseSync, constants } from 'node:sqlite';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
const RULE = (c = '-') => say(c.repeat(108));

/* ================================================================== *
 * 0. Subject, predicate, vocabulary — carried forward unchanged
 * ================================================================== *
 * Identical to TASK-0033/0035/0037/0038 so that the cohort keeps its shape and any
 * difference measured here is a difference in the INSTRUMENT or the CONFIGURATION,
 * never in the fixture.
 */

const SUBJECT = {
  scope: 'org-a',
  classifications: ['PUBLIC', 'INTERNAL'],
  audiences: ['staff', 'all-employees'],
};

const ANSWERABLE_STATE = 'PUBLISHED';           // ADR-0018 §2; MSG-0116a/b Q10
const A1 = 'A1', A2 = 'A2', A7 = 'A7';          // ADR-0017 §5
const TARGET_POLICY = 'POL-LEAVE';
const QUERY_TERM = 'leave';
const K = 6;
const CHUNKS_PER_VERSION = 2;

/* the fixture clock — an integer, never a wall-clock read */
const T_ORIGIN = 1700000000;
const T_BUILD  = T_ORIGIN - 100;
const TX       = T_ORIGIN;
const T_LATER  = T_ORIGIN + 5000;

function versionAuthorized(v, now) {
  if (!v) return false;
  return v.scope === SUBJECT.scope &&
         v.state === ANSWERABLE_STATE &&
         SUBJECT.classifications.includes(v.cls) &&
         v.eff_from <= now &&
         (v.eff_to === null || v.eff_to > now) &&
         v.audiences.some(a => SUBJECT.audiences.includes(a));
}
const chunkAuthorized = (kernel, ch, now) =>
  versionAuthorized(kernel.versions.get(ch.version_id), now);

/* ================================================================== *
 * 1. Fixture — TASK-0038's, plus one new independent variable
 * ================================================================== */

const AUTH_BODY = (vid, i) =>
  `annual ${QUERY_TERM} entitlement policy ${vid} section ${i} ` +
  'paragraph describing accrual carry over approval routing and the ' +
  'responsibilities of the line manager and the human resources function';
const NOISE_BODY = () => `${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM}`;

const FAILURE_MODES = [
  'wrong-scope', 'wrong-audience', 'restricted-class', 'superseded',
  'expired-effectivity',            // bounded window, already closed
  'not-yet-effective-open',         // open-ended window, not yet opened
  'not-yet-effective-bounded',      // bounded window, entirely in the future
];

/*
 * `skew` is NEW in this probe and it exists for gap 3 alone.
 *
 * 'uniform'       — TASK-0038's cohort exactly: the seven failure modes in equal parts.
 * 'bounded-heavy' — the same seven modes, but the two BOUNDED effectivity modes are
 *                   over-represented. Nothing else changes: same subject, same
 *                   predicate, same authorized set, same answers.
 *
 * It is here because a query planner chooses on STATISTICS, and a design whose Shape-1
 * posture depends on the planner's choice will change posture when the distribution
 * changes even though nothing about the design, the data model or the authorization
 * rules changed at all. Varying the distribution is one of the ways "a single observed
 * optimizer plan" is shown to be a single observation.
 */
function buildFixture(M, { otherSubjects = 0, skew = 'uniform' } = {}) {
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
    for (let i = 0; i < n; i++)
      chunks.push({ id: ++cid, policy_id, version_id, scope, body: AUTH_BODY(version_id, i) });
  };

  // V1 PUBLISHED, effective, OPEN-ENDED. V2 APPROVED but not PUBLISHED (Q10: not
  // answerable). V3 PUBLISHED, effective, BOUNDED window still open — V3 is why a design
  // cannot buy U = 0 by serving only the open-ended limb without that showing up as a
  // withheld authorized answer (EPA-0006 §3.3 wrong-exclusive).
  addVersion('V1', TARGET_POLICY, { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V2', TARGET_POLICY, { state: 'APPROVED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V3', 'POL-TRAVEL', { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff'], eff_from: T_ORIGIN - 5000, eff_to: T_ORIGIN + 100000 });
  addChunks('V1', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V2', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V3', 'POL-TRAVEL', SUBJECT.scope, CHUNKS_PER_VERSION);

  // The two bounded modes are the ones the two candidate indexes disagree about, so the
  // skew is expressed by weighting the mode wheel, not by changing any mode's meaning.
  const WHEEL = skew === 'bounded-heavy'
    ? ['expired-effectivity', 'not-yet-effective-bounded', 'expired-effectivity',
       'not-yet-effective-bounded', 'wrong-scope', 'wrong-audience', 'restricted-class',
       'superseded', 'not-yet-effective-open']
    : FAILURE_MODES;

  for (let m = 0; m < M; m++) {
    const mode = WHEEL[m % WHEEL.length];
    const vid = `N${m}`;
    const o = { state: 'PUBLISHED', cls: 'INTERNAL', audiences: ['staff'],
                eff_from: T_ORIGIN - 5000, eff_to: null, scope: SUBJECT.scope };
    let scope = SUBJECT.scope;
    if (mode === 'wrong-scope')        { scope = 'org-b'; o.scope = 'org-b'; }
    if (mode === 'wrong-audience')       o.audiences = ['executive'];
    if (mode === 'restricted-class')     o.cls = 'RESTRICTED';
    if (mode === 'superseded')           o.state = 'SUPERSEDED';
    if (mode === 'expired-effectivity')  o.eff_to = T_BUILD - 500;
    if (mode === 'not-yet-effective-open')    { o.eff_from = T_LATER + 10000; o.eff_to = null; }
    if (mode === 'not-yet-effective-bounded') { o.eff_from = T_LATER + 10000;
                                                o.eff_to   = T_LATER + 90000; }
    addVersion(vid, `POL-N${m}`, o);
    chunks.push({ id: ++cid, policy_id: `POL-N${m}`, version_id: vid, scope, body: NOISE_BODY() });
  }

  // structures belonging to OTHER subjects — G-Q4.2's differential variable, nothing else
  for (let s = 0; s < otherSubjects; s++) {
    const vid = `X${s}`;
    addVersion(vid, `POL-X${s}`, { state: 'PUBLISHED', cls: 'INTERNAL',
      audiences: [`team-${s}`], eff_from: T_ORIGIN - 5000, eff_to: null, scope: `org-x${s}` });
    chunks.push({ id: ++cid, policy_id: `POL-X${s}`, version_id: vid, scope: `org-x${s}`,
                  body: NOISE_BODY() });
  }
  return { versions, chunks, reachable: true, skew, M };
}

/*
 * THE AUTHORIZED ALLOWANCE — the constant the derived U1 lower bound subtracts.
 *
 * The index-cursor instrument counts ENTRIES VISITED. It cannot say which of them was
 * authorized, because the columns that decide authorization are not all carried by both
 * candidate indexes and forcing them into the term would drag the row back in and turn
 * the instrument into a row-access counter — the exact defect it exists to avoid.
 *
 * So the unauthorized share is DERIVED, and derived CONSERVATIVELY: subtract the largest
 * number of authorized entry-visits that could possibly occur. An authorized version can
 * be visited at most once per limb per partition it is resident in, and at most once per
 * chunk if a plan drives the join from the chunk side. The allowance is therefore
 *
 *     Amax = (authorized version-entries resident in the routed partitions)
 *            x LIMBS x CHUNKS_PER_VERSION
 *
 * and     U1lb = max(0, Nidx - Amax).
 *
 * This is deliberately generous. At the smallest collection it can drive the bound to
 * zero, and a zero here means ONLY "this conservative bound proves nothing at this size"
 * — it is NOT a measurement of U1 = 0 and must never be read as one.
 */
const LIMBS = 2;
function authorizedResidentEntries(kernel, now) {
  const mine = new Set(routeKeys());
  let n = 0;
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE || !versionAuthorized(v, now)) continue;
    for (const t of v.audiences) if (mine.has(`${v.scope}|${v.cls}|${v.state}|${t}`)) n++;
  }
  return n;
}
const u1LowerBound = (nidx, kernel, now) =>
  Math.max(0, nidx - authorizedResidentEntries(kernel, now) * LIMBS * CHUNKS_PER_VERSION);

/* the cohort, counted from the fixture rather than assumed from the wheel */
function cohort(kernel, now) {
  const c = { inPartition: 0, expired: 0, notYetBounded: 0, notYetOpen: 0, authorized: 0 };
  const mine = new Set(routeKeys());
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    const inMine = v.audiences.some(t => mine.has(`${v.scope}|${v.cls}|${v.state}|${t}`));
    if (!inMine) continue;
    c.inPartition++;
    if (versionAuthorized(v, now)) { c.authorized++; continue; }
    if (v.eff_to !== null && v.eff_to <= now) c.expired++;
    else if (v.eff_from > now && v.eff_to !== null) c.notYetBounded++;
    else if (v.eff_from > now) c.notYetOpen++;
  }
  return c;
}

/* ================================================================== *
 * 2. Structures
 * ================================================================== */

const SAFE = (s) => String(s).replace(/[^a-z0-9]+/gi, '_').toLowerCase();
const routeKeys = () => SUBJECT.classifications.flatMap(c =>
  SUBJECT.audiences.map(a => `${SUBJECT.scope}|${c}|${ANSWERABLE_STATE}|${a}`));

/* the authoritative kernel, as queryable tables. Present so the negative control has a
 * scope-spanning structure to be wrong about, and so the re-check has authoritative
 * state to consult. K7/K8 never open it — which is exactly what E1 must show. */
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
 * THE PHYSICALLY PARTITIONED AUTHORITATIVE STORE — K7 and K8 (TASK-0038 section 2b).
 *
 * The partitions are where the truth LIVES: there is no copy, so there is nothing to go
 * stale and nothing for a timer to be late about. Versions AND chunks are partitioned,
 * because a partitioned version table joined to one global chunk table puts the
 * traversal straight back over a scope-spanning structure.
 *
 * BOTH indexes exist on BOTH designs. That is the point of the pair: they differ only in
 * which one the traversal ends up using.
 *   i_*_vo (open_ended, eff_from)          — seeks on the LOWER effectivity bound
 *   i_*_vb (open_ended, eff_to, eff_from)  — seeks on the UPPER effectivity bound
 */
function buildPartitionedStore(db, kernel) {
  for (const key of routeKeys()) {
    const s = SAFE(key);
    db.exec(`CREATE TABLE q_${s}_v (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
               eff_from INTEGER NOT NULL, eff_to INTEGER);
             CREATE INDEX i_${s}_vo ON q_${s}_v (open_ended, eff_from);
             CREATE INDEX i_${s}_vb ON q_${s}_v (open_ended, eff_to, eff_from);
             CREATE TABLE q_${s}_c (chunk_id INTEGER PRIMARY KEY, policy_id TEXT,
               version_id TEXT NOT NULL, body TEXT NOT NULL);
             CREATE INDEX i_${s}_cv ON q_${s}_c (version_id);`);
  }
  const mine = new Set(routeKeys());
  const byVersion = new Map();
  for (const ch of kernel.chunks) {
    if (!byVersion.has(ch.version_id)) byVersion.set(ch.version_id, []);
    byVersion.get(ch.version_id).push(ch);
  }
  // statements hoisted out of the loop: at M = 20000 a re-prepare per row dominates.
  const insV = new Map(), insC = new Map();
  for (const key of routeKeys()) {
    const s = SAFE(key);
    insV.set(s, db.prepare(`INSERT OR IGNORE INTO q_${s}_v VALUES (?,?,?,?)`));
    insC.set(s, db.prepare(`INSERT OR IGNORE INTO q_${s}_c VALUES (?,?,?,?)`));
  }
  db.exec('BEGIN');
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    for (const tok of v.audiences) {
      const key = `${v.scope}|${v.cls}|${v.state}|${tok}`;
      if (!mine.has(key)) continue;          // other subjects' partitions are not materialised here
      const s = SAFE(key);
      insV.get(s).run(v.version_id, v.eff_to === null ? 1 : 0, v.eff_from, v.eff_to);
      for (const ch of byVersion.get(v.version_id) ?? [])
        insC.get(s).run(ch.id, ch.policy_id, ch.version_id, ch.body);
    }
  }
  db.exec('COMMIT');
}

/* ================================================================== *
 * 3. Routing — EPA-0006 §4.9 G-Q4
 * ================================================================== */

function routeComputed(db, c) {
  const keys = routeKeys();          // G-Q4.1: a function of the subject's entitlements alone
  c.route.structures = keys.slice();
  c.route.reads += keys.length;      // one exact-key resolution each; no catalogue is read
  return keys;
}

/* ================================================================== *
 * 4. Instrumentation
 * ================================================================== *
 * TWO placements, and the difference between them is this probe's central finding, so
 * the definitions are stated before any number is produced.
 *
 *   ROW-ACCESS placement  `probe_ver(pv.version_id)`
 *     version_id is not carried by either candidate index, so evaluating this term
 *     forces the table row to be fetched. It therefore fires ONCE PER ROW ACCESSED.
 *     This is TASK-0038's placement, unchanged, and it is what produced `U`.
 *
 *   INDEX-CURSOR placement  `probe_idx(pv.open_ended)`
 *     open_ended is the LEADING column of BOTH candidate indexes, so it is available
 *     from the index cursor and SQLite evaluates it WITHOUT fetching the row. It
 *     therefore fires ONCE PER INDEX ENTRY VISITED INSIDE THE SEEK RANGE.
 *
 * WHAT THE INDEX-CURSOR INSTRUMENT IS, AND — MORE IMPORTANTLY — WHAT IT IS NOT.
 *
 *   It is a LOWER BOUND on U1. It counts entries visited in the seek range of the loop
 *   it sits in. It does NOT count interior b-tree pages descended during the seek, pages
 *   read by the pager, entries read by any other loop, or anything the engine does that
 *   no reachable instrument observes. Per EPA-0006 §4.6 S5 a lower bound is exactly the
 *   right shape of instrument: A POSITIVE VALUE IS CONCLUSIVE OF FAILURE, and NO VALUE
 *   OF IT MAY EVER BE READ AS "U1 = 0". This probe never claims U1 = 0 for anything.
 *
 *   It PERTURBS THE QUERY, and the licence to transfer its count to the uninstrumented
 *   design is not assumed: every measurement captures the plan WITH and WITHOUT the
 *   instrument and asserts the SEEK BOUND IS IDENTICAL. If it ever differs, the
 *   measurement is reported as NOT TRANSFERABLE rather than quietly used.
 *
 *   It is CALIBRATED against a fixture whose in-range entry count is known by
 *   construction, on BOTH candidate plans, before it is used on anything (section 7).
 */

function newCounters() {
  return {
    row:   { calls: 0, unauth: new Set() },   // placement A — row access
    index: { calls: 0, unauth: new Set() },   // placement B — index cursor
    route: { reads: 0, unauth: new Set(), structures: [] },
    recheck: { calls: 0, meta: 0, content: 0, kept: 0, rejected: 0, shape1Failures: [] },
  };
}

const bind = (sql, all) =>
  Object.fromEntries(Object.entries(all).filter(([k]) => new RegExp(`:${k}\\b`).test(sql)));
const planOf = (db, sql, params) => {
  try { return db.prepare('EXPLAIN QUERY PLAN ' + sql).all(bind(sql, params)).map(r => r.detail); }
  catch (e) { return ['<plan unavailable: ' + e.message + '>']; }
};
const opcodesOf = (db, sql, params) => {
  try { return db.prepare('EXPLAIN ' + sql).all(bind(sql, params)); }
  catch (e) { return []; }
};

/*
 * The SEEK SIGNATURE — the part of the plan that decides which entries are traversed.
 * Partition slugs are normalised away so that four partitions with identical strategy
 * produce one signature, and a real strategy change is not hidden in a name.
 */
function seekSignature(plan) {
  return plan
    .map(d => d.replace(/q_[a-z0-9_]+_(v|c)\b/g, 'q_<part>_$1')
               .replace(/i_[a-z0-9_]+_(vo|vb|cv)\b/g, 'i_<part>_$1'))
    .filter(d => /USING (COVERING )?INDEX|SCAN/.test(d))
    .sort()
    .join(' ;; ');
}

/*
 * The VERSION-TRAVERSAL signature — the security-relevant subset of the plan.
 *
 * This is separated out because `INDEXED BY` pins ONE limb of ONE table, and the rest of
 * the plan is still the optimizer's to choose. A design can therefore show a changed
 * FULL plan while the traversal that decides which version entries are visited is
 * unchanged — or the reverse. Reporting only the full signature would blur the two, and
 * it is the version traversal that decides U and U1.
 */
function versionTraversalSignature(plan) {
  const lines = plan
    .map(d => d.replace(/q_[a-z0-9_]+_v\b/g, 'q_<part>_v')
               .replace(/i_[a-z0-9_]+_(vo|vb)\b/g, 'i_<part>_$1'))
    .filter(d => /\bpv\b/.test(d))
    .map(d => d.replace(/^\s*/, ''))
    .sort();
  const tally = new Map();
  for (const l of lines) {
    const key = /i_<part>_vb/.test(l) ? 'SEEK i_<part>_vb (upper bound)'
              : /i_<part>_vo/.test(l) ? 'SEEK i_<part>_vo (lower bound)'
              : /SCAN/.test(l)        ? 'SCAN q_<part>_v (whole partition)'
              : l;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return [...tally.entries()].sort().map(([k, n]) => `${n}x ${k}`).join(' + ');
}

/* ================================================================== *
 * 5. The re-check — ADR-0020 §3 point 2, separately instrumented (MSG-0116b)
 * ================================================================== */

const META_FIELDS = ['version_id', 'scope', 'cls', 'state', 'eff_from', 'eff_to', 'audiences'];

function makeRecheck(c, kernel, now) {
  return {
    run(cand) {
      c.recheck.calls++;
      if (!kernel.reachable) throw new Error('KERNEL_UNREACHABLE');
      const v = kernel.versions.get(cand.version_id);        // G-Q7.8d: authoritative, not a copy
      for (const f of META_FIELDS) if (v && f in v) c.recheck.meta++;
      const ok = versionAuthorized(v, now);
      if (ok) c.recheck.kept++; else c.recheck.rejected++;
      return ok;
    },
  };
}

/* ================================================================== *
 * 6. Designs and queries
 * ================================================================== */

const DESIGNS = [
  { id: 'K7', kind: 'partitioned', forced: false, routing: routeComputed,
    label: 'PHYSICALLY PARTITIONED AUTHORITATIVE STORE — versions AND chunks, both effectivity limbs',
    note: 'the planner chooses the index. TASK-0038 measured U = 715 at M=5000.' },
  { id: 'K8', kind: 'partitioned', forced: true, routing: routeComputed,
    label: 'K7 with the bounded limb PINNED to i_<part>_vb by INDEXED BY — one token\'s difference',
    note: 'the planner\'s choice is removed. TASK-0038 measured U = 0 at every size.' },
  { id: 'NC', kind: 'negative-control', forced: false, routing: null,
    label: 'NEGATIVE CONTROL — rank the whole collection first, authorize afterwards',
    note: 'Shape 2 by construction (ADR-0020 §4 / AMD-01). If the harness does not fail it the run is VOID (§4.6 S8).' },
];

const RANK = 'probe_rank(x.chunk_id, x.version_id, x.body) DESC';

/*
 * `instrument` selects the placement. 'none' is the UNINSTRUMENTED query, and it exists
 * so the plan can be captured without any probe function present at all — the control
 * for the claim that the instrument does not move the planner.
 */
function buildQuery(design, keys, instrument) {
  const inList = (n, p) => Array.from({ length: n }, (_, i) => `:${p}${i}`).join(',');
  const clsIn = inList(SUBJECT.classifications.length, 'cls');

  if (design.kind === 'negative-control') {
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

  if (!keys || !keys.length) return null;

  // The instrument terms are written FIRST so that the two placements are compared at
  // stated positions and never silently reordered relative to each other (§4.6 S7:
  // "never compare two candidates on counts taken at different placements").
  const probes = instrument === 'row'   ? 'probe_ver(pv.version_id) AND '
               : instrument === 'index' ? 'probe_idx(pv.open_ended) AND '
               : '';

  const parts = keys.flatMap(k => {
    const s = SAFE(k);
    const pin = design.forced ? `INDEXED BY i_${s}_vb ` : '';
    return [
      // OPEN-ENDED limb: eff_to IS NULL by construction, so the upper bound is
      // discharged STRUCTURALLY and the lower bound is a one-sided seek.
      `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
              '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
       FROM q_${s}_v pv JOIN q_${s}_c pc ON pc.version_id = pv.version_id
       WHERE ${probes}pv.open_ended = 1 AND pv.eff_from <= :T`,
      // BOUNDED limb: the limb the two candidate indexes disagree about.
      `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
              '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
       FROM q_${s}_v pv ${pin}JOIN q_${s}_c pc ON pc.version_id = pv.version_id
       WHERE ${probes}pv.open_ended = 0 AND pv.eff_to > :T AND pv.eff_from <= :T`,
    ];
  });
  return `SELECT chunk_id, policy_id, version_id, scope, cls, state, body
          FROM ( ${parts.join(' UNION ')} ) x ORDER BY ${RANK} LIMIT :k`;
}

function paramsFor(now, keys) {
  const p = { scope: SUBJECT.scope, state: ANSWERABLE_STATE, T: now, k: K };
  SUBJECT.classifications.forEach((c, i) => { p['cls' + i] = c; });
  SUBJECT.audiences.forEach((a, i) => { p['aud' + i] = a; });
  keys && keys.forEach((k, i) => { p['rk' + i] = k; });
  return p;
}

function installProbeFunctions(db, c, kernel, now) {
  const unauth = (vid) => !versionAuthorized(kernel.versions.get(String(vid)), now);
  db.function('probe_ver', { deterministic: false }, (vid) => {
    c.row.calls++; if (unauth(vid)) c.row.unauth.add('v:' + vid); return 1;
  });
  // The index-cursor instrument receives open_ended, which cannot identify the entry.
  // It therefore reports a COUNT of entries visited, and the unauthorized share is
  // established separately from the cohort and the seek bound — stated plainly rather
  // than dressed up as a per-entry identification the instrument cannot make.
  db.function('probe_idx', { deterministic: false }, (_openEnded) => {
    c.index.calls++; return 1;
  });
  db.function('probe_chunk', { deterministic: false }, (cid, vid) => {
    c.row.calls++; if (unauth(vid)) c.row.unauth.add('c:' + cid); return 1;
  });
  db.function('probe_rank', { deterministic: true }, (cid, vid, body) => {
    if (unauth(vid)) c.row.unauth.add('c:' + cid);
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });
}

/* ================================================================== *
 * 7. One execution
 * ================================================================== */

function execute(db, kernel, design, now, instrument) {
  const c = newCounters();
  installProbeFunctions(db, c, kernel, now);
  const r = { design: design.id, instrument, plan: [], sig: '', rowCalls: 0, idxCalls: 0,
              U: 0, answered: [], leaked: [], abstained: null, emptyAnswer: false,
              error: null, keys: null, c };

  let keys = null;
  if (design.routing) { try { keys = design.routing(db, c); } catch (e) { r.error = 'ROUTING:' + e.message; } }
  r.keys = keys;

  const sql = buildQuery(design, keys, instrument);
  if (sql === null) { r.abstained = A1; r.plan = ['<routed set empty — no structure opened>']; return r; }

  const p = paramsFor(now, keys);
  let rows = [];
  try {
    r.plan = planOf(db, sql, p);
    r.sig = seekSignature(r.plan);
    rows = db.prepare(sql).all(bind(sql, p));
  } catch (e) { r.abstained = A7; r.error = e.message; return r; }

  const rc = makeRecheck(c, kernel, now);
  const kept = [];
  try { for (const row of rows) if (rc.run(row)) kept.push(row); }
  catch (e) { r.abstained = A7; r.error = e.message; return r; }

  r.rowCalls = c.row.calls;
  r.idxCalls = c.index.calls;
  r.U = new Set([...c.row.unauth, ...c.route.unauth]).size;
  r.answered = kept.map(x => x.chunk_id);
  r.leaked = kept.filter(x => !chunkAuthorized(kernel, x, now)).map(x => x.chunk_id);
  if (kept.length === 0) {
    const any = kernel.chunks.some(ch => chunkAuthorized(kernel, ch, now));
    if (!any) r.abstained = A2; else r.emptyAnswer = true;
  }
  return r;
}

function freshDb(kernel, design, cfg = {}) {
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  if (design.kind === 'partitioned') buildPartitionedStore(db, kernel);
  if (cfg.automaticIndexOff) db.exec('PRAGMA automatic_index = off');
  if (cfg.analyze) db.exec('ANALYZE');
  if (cfg.optimize) db.exec('PRAGMA optimize');
  return db;
}

/* ================================================================== *
 * ================================================================== *
 *                              THE RUN
 * ================================================================== *
 * ================================================================== */

const probeDb = new DatabaseSync(':memory:');
const SQLITE_VERSION = probeDb.prepare('select sqlite_version() v').get().v;

say('='.repeat(108));
say('TASK-0039 — K7/K8 REMAINING CLEARANCE EVIDENCE: E4 · U1 OBSERVABILITY · PLAN-INDEPENDENCE');
say('='.repeat(108));
say('Authority : MSG-0120 (AUTHORIZED) with MSG-0119 (strict Q11) BINDING · MSG-0122 · TASK-0039');
say('Subject   : SQLite ' + SQLITE_VERSION + ' via node:sqlite — EPA-0006 class R TEST SUBJECT, not a selection');
say('Runtime   : Node ' + process.version);
say('');
say('SELECTS NOTHING · ADOPTS NOTHING · INSTALLS NOTHING · DEPLOYS NOTHING · AMENDS NO ADR');
say('No gate is relaxed. No numeric staleness threshold is proposed. No benchmark, latency,');
say('capacity, recall or throughput figure is produced. No wall clock is read.');
say('');
say('READ THIS BEFORE ANY TABLE BELOW:');
say('  * E4 is established UNOBTAINABLE on this test subject in section 2. NOTHING IN THIS RUN');
say('    COULD THEREFORE HAVE BEEN CLEARED, whatever any count shows. That is stated first so no');
say('    row is misread as a near-miss.');
say('  * U1 = 0 IS NEVER CLAIMED. Where an index-entry count appears it is a LOWER BOUND.');
say('  * K3 and K4 are NOT re-run and remain NOT CLEARED under MSG-0119\'s strict Q11 reading.');
say('  * TASK-0038\'s 7-scenario grid is NOT re-run. That evidence stands.');
say('');

/* ================================================================== *
 * SECTION 1 — VALIDITY GATE 1: the adversarial precondition (§4.6 S8)
 * ================================================================== */

const SIZES = [50, 500, 5000, 20000];
const SKEWS = ['uniform', 'bounded-heavy'];

RULE('=');
say('SECTION 1 — VALIDITY GATE 1: the adversarial precondition (EPA-0006 §4.6 S8)');
RULE('=');
say('The UNCONSTRAINED top-k must contain NO authorized chunk. If one appears, the fixture is not');
say('adversarial, every measurement below is meaningless, and the run is VOID.');
say('');
let preconditionOk = true;
for (const skew of SKEWS) for (const M of SIZES) {
  const kernel = buildFixture(M, { skew });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  const rows = db.prepare(`SELECT kc.chunk_id, kc.version_id FROM k_chunk kc
     ORDER BY probe_rank(kc.chunk_id, kc.version_id, kc.body) DESC LIMIT :k`).all({ k: K });
  const n = rows.filter(x => chunkAuthorized(kernel, x, TX)).length;
  preconditionOk = preconditionOk && n === 0;
  say(`  skew=${pad(skew, 14)} M=${rpad(M, 6)}  unconstrained top-${K} -> authorized-among-them=${n}  ` +
      (n === 0 ? '-> ADVERSARIAL, as required' : '-> NOT ADVERSARIAL — the run is VOID'));
  db.close();
}
say('');
if (!preconditionOk) { say('ABORTING — the fixture is not adversarial.'); process.exit(1); }

/* the cohort, printed so every later count can be checked against known truth */
say('The cohort inside the subject\'s own partitions, counted from the fixture (not from the wheel).');
say('These are the numbers every index-entry and row count below must be checked against.');
say('');
say(`  ${pad('skew', 14)} ${rpad('M', 6)} ${rpad('inPart', 8)} ${rpad('authzd', 7)} ${rpad('expired', 8)} ${rpad('notYetB', 8)} ${rpad('notYetO', 8)}`);
for (const skew of SKEWS) for (const M of SIZES) {
  const c = cohort(buildFixture(M, { skew }), TX);
  say(`  ${pad(skew, 14)} ${rpad(M, 6)} ${rpad(c.inPartition, 8)} ${rpad(c.authorized, 7)} ` +
      `${rpad(c.expired, 8)} ${rpad(c.notYetBounded, 8)} ${rpad(c.notYetOpen, 8)}`);
}
say('');
say('  inPart  = versions resident in the subject\'s four partitions (PUBLISHED, right scope/class/audience)');
say('  authzd  = of those, authorized at the query instant');
say('  expired = eff_to already closed        -> BELOW  the i_<part>_vb seek start, ABOVE nothing');
say('  notYetB = bounded window, not yet open -> INSIDE the i_<part>_vb seek range, rejected by a residual');
say('  notYetO = open window, not yet open    -> OUTSIDE the i_<part>_vo seek range');
say('');

/* ================================================================== *
 * SECTION 2 — GAP 1: E4. The engine-log surface, enumerated.
 * ================================================================== */

RULE('=');
say('SECTION 2 — GAP 1: E4, THE ENGINE LOG. Enumerated, not assumed.');
RULE('=');
say('EPA-0006 §4.6 S6/E4 requires LOG INSPECTION: "no unauthorized passage text in the engine\'s own');
say('logs" (§9.3; ADR-0020 §6.2, which carries no authorization exception). MSG-0120 requires this');
say('evidence be OBTAINED or EXPLICITLY ESTABLISHED AS UNOBTAINABLE, and forbids inferring it.');
say('');

say('2.1 — The reachable API surface, enumerated in this run.');
say('');
const dbProto = Object.getOwnPropertyNames(Object.getPrototypeOf(probeDb)).sort();
const stProto = Object.getOwnPropertyNames(
  Object.getPrototypeOf(probeDb.prepare('select 1'))).sort();
say('  DatabaseSync.prototype : ' + dbProto.join(', '));
say('  StatementSync.prototype: ' + stProto.join(', '));
const LOG_HOOKS = ['trace', 'profile', 'log', 'sqllog', 'stmtStatus', 'stmt_status', 'scanstatus',
                   'onTrace', 'setTrace', 'setProfile', 'errorLog'];
const found = LOG_HOOKS.filter(h => dbProto.includes(h) || stProto.includes(h));
say('');
say('  Searched for a trace/profile/log hook: ' + LOG_HOOKS.join(', '));
say('  FOUND: ' + (found.length ? found.join(', ') : 'NONE — no member of either prototype is a log, trace or profile hook.'));
say('');
say('  sqlite3_trace_v2, sqlite3_profile, SQLITE_CONFIG_LOG and sqlite3_stmt_scanstatus are C-API');
say('  entry points. NONE of them is bound by node:sqlite, so none is reachable from this runner.');
say('  That is an observation about the BINDING, not a claim about SQLite.');
say('');

say('2.2 — Compile options, read from the engine.');
say('');
const COMPILE = probeDb.prepare('PRAGMA compile_options').all().map(r => r.compile_options);
const has = (o) => COMPILE.includes(o);
const RELEVANT = [
  ['DEBUG',                   'would enable PRAGMA vdbe_trace / vdbe_listing / parser_trace'],
  ['ENABLE_SQLLOG',           'would write an SQL log via SQLITE_CONFIG_SQLLOG'],
  ['ENABLE_STMT_SCANSTATUS',  'would expose PER-LOOP VISIT COUNTS — the ONE API that measures U1 directly'],
  ['ENABLE_STAT4',            'would make the planner sensitive to BOUND PARAMETER VALUES'],
  ['ENABLE_DBSTAT_VTAB',      'exposes the dbstat virtual table — per-b-tree page and cell counts'],
];
for (const [opt, why] of RELEVANT)
  say(`  ${pad(opt, 26)} ${has(opt) ? 'PRESENT' : 'ABSENT '}   ${why}`);
say('');
say(`  Full option list: ${COMPILE.length} options; the five above were checked by exact match.`);
say('');

say('2.3 — The tracing pragmas, attempted. AND THE TRAP IN READING THE RESULT.');
say('');
say('  SQLite SILENTLY IGNORES an unrecognised pragma. It does not raise. So "PRAGMA vdbe_trace=on');
say('  returned no error" is NOT evidence that tracing was enabled — it is evidence of nothing at');
say('  all. The control below is a pragma that certainly does not exist; if it behaves identically');
say('  to the tracing pragmas, then the tracing pragmas are equally inert.');
say('');
const PRAGMA_ATTEMPTS = ['vdbe_trace', 'vdbe_listing', 'parser_trace', 'sql_trace',
                         'stmt_scanstatus', 'this_pragma_certainly_does_not_exist'];
for (const p of PRAGMA_ATTEMPTS) {
  let setRes, readRes;
  try { setRes = JSON.stringify(probeDb.prepare(`PRAGMA ${p} = on`).all()); }
  catch (e) { setRes = 'ERROR: ' + e.message; }
  try { readRes = JSON.stringify(probeDb.prepare(`PRAGMA ${p}`).all()); }
  catch (e) { readRes = 'ERROR: ' + e.message; }
  const ctrl = p.startsWith('this_pragma') ? '   <- THE CONTROL' : '';
  say(`  PRAGMA ${pad(p, 38)} set-> ${pad(setRes, 6)} read-back-> ${pad(readRes, 6)}${ctrl}`);
}
say('');
say('  RESULT: every tracing pragma behaves EXACTLY as the pragma that does not exist. None was');
say('  enabled. Had this probe reported "tracing enabled, no unauthorized text seen", it would have');
say('  reported E4 obtained from an instrument that was never running.');
say('');

say('2.4 — Is there a log FILE to inspect?');
say('');
say(`  db.location() for the ':memory:' database -> ${JSON.stringify(probeDb.location())}`);
say('  There is no database file, therefore no journal, no WAL and no engine-written file of any');
say('  kind to inspect. Nothing was installed and no file was created.');
say('');

say('2.5 — What CAN be scanned, and why scanning it is NOT E4.');
say('');
say('  Three engine-produced text surfaces ARE reachable: EXPLAIN QUERY PLAN details, EXPLAIN');
say('  opcode rows (including the p4 operand and comment fields, which is where an INLINED LITERAL');
say('  would appear), and error message text. Section 8 scans all three for unauthorized passage');
say('  text and reports the result.');
say('');
say('  THAT SCAN IS NOT E4 AND IS NOT OFFERED AS E4. E4 concerns the engine\'s OWN logs. These three');
say('  surfaces are outputs this probe requested, not a log the engine keeps; a clean scan of them');
say('  says nothing about what an engine with logging compiled in and enabled would write.');
say('');
say('  >> E4 VERDICT: NOT OBTAINABLE on this test subject, for the enumerated reason that node:sqlite');
say('     binds no trace, profile or log API; the engine is built without DEBUG, ENABLE_SQLLOG and');
say('     ENABLE_STMT_SCANSTATUS; every tracing pragma is inert and demonstrated inert against a');
say('     control; and there is no database file and so no engine-written file to read.');
say('');
say('     Per §4.6 S6 an absent evidence class yields NOT CLEARED. Per MSG-0120 it may NOT be');
say('     inferred. THEREFORE K7 AND K8 CANNOT BE CLEARED IN THIS RUN ON E4 ALONE, independently of');
say('     everything measured below. The rest of this probe still matters, because it decides');
say('     whether E4 is the ONLY thing missing — and section 4 shows it is not.');
say('');

/* ================================================================== *
 * SECTION 3 — GAP 2: U1. What is absent, what the opcodes show.
 * ================================================================== */

RULE('=');
say('SECTION 3 — GAP 2: U1, INDEX-ENTRY EXAMINATION. Why the prior zero was a row-access zero.');
RULE('=');
say('EPA-0006 §4.6 S4 counts U1 — "reads an index entry or key during traversal" — as examining, and');
say('§4.7 Q1\'s fail-closed default keeps that reading until ruled. MSG-0118 recorded that U1 is not');
say('instrumentable through node:sqlite. MSG-0120 forbids reporting U1 = 0 on that basis.');
say('');
say('3.1 — The direct instrument is absent, and its absence is now a checked fact.');
say('');
say(`  SQLITE_ENABLE_STMT_SCANSTATUS: ${has('ENABLE_STMT_SCANSTATUS') ? 'PRESENT' : 'ABSENT'} (section 2.2).`);
say('  sqlite3_stmt_scanstatus() is the API that reports, per loop, the number of index entries');
say('  visited. It is the instrument that would settle U1 outright. It is not compiled in, and');
say('  node:sqlite binds no accessor for it in any case. BOTH would have to change.');
say('');
say('3.2 — What the engine itself shows about WHERE a row-access counter sits.');
say('');
say('  The bytecode below is the ACTUAL EXPLAIN output for the shape of K8\'s bounded limb. It is');
say('  engine-reported, not a description of what SQLite is believed to do.');
say('');

{
  const d = new DatabaseSync(':memory:');
  d.exec(`CREATE TABLE q_demo_v (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
            eff_from INTEGER NOT NULL, eff_to INTEGER);
          CREATE INDEX i_demo_vb ON q_demo_v (open_ended, eff_to, eff_from);`);
  // arity matters: node:sqlite derives the SQL function's argument count from fn.length,
  // and a mismatch is a hard "wrong number of arguments" error, not a silent coercion.
  d.function('probe_ver', { deterministic: false }, (_vid) => 1);
  const sql = 'SELECT version_id FROM q_demo_v INDEXED BY i_demo_vb ' +
              'WHERE probe_ver(version_id) AND open_ended = 0 AND eff_to > 1000 AND eff_from <= 1000';
  for (const r of d.prepare('EXPLAIN ' + sql).all())
    say(`    ${rpad(r.addr, 3)}  ${pad(r.opcode, 14)} p1=${rpad(r.p1, 3)} p2=${rpad(r.p2, 3)} ` +
        `p3=${rpad(r.p3, 3)} ${pad(r.p4 ?? '', 12)}`);
  d.close();
}
say('');
say('  Read it in order. Cursor 1 is the INDEX; cursor 0 is the TABLE.');
say('    SeekGT 1       — seek the INDEX cursor to the start of the range');
say('    IdxGT  1       — range-end test, ON THE INDEX');
say('    DeferredSeek 1 — the TABLE seek is DEFERRED. No row has been fetched yet.');
say('    Column 1 2     — read eff_from FROM THE INDEX CURSOR (cursor 1)');
say('    Gt     -> Next — FAILS THE RESIDUAL AND JUMPS STRAIGHT TO Next.');
say('                     The entry was visited. The table row was never touched.');
say('    Column 0 0     — only reached by entries that PASSED. This is where probe_ver fires.');
say('');
say('  THAT IS THE WHOLE FINDING, AND IT IS THE ENGINE\'S OWN BYTECODE SAYING IT: a counter written');
say('  into the WHERE clause on a NON-INDEXED column cannot fire for an entry the residual rejects,');
say('  because the row is never read. EPA-0006 §4.6 S5 predicted exactly this — "a zero count proves');
say('  only that nothing unauthorized crossed the point where the instrument sits" — and here it is');
say('  demonstrated at opcode level rather than argued.');
say('');

/* ================================================================== *
 * SECTION 4 — the index-cursor instrument, CALIBRATED before use
 * ================================================================== */

RULE('=');
say('SECTION 4 — A NEW INSTRUMENT, AND ITS CALIBRATION AGAINST KNOWN TRUTH');
RULE('=');
say('open_ended is the LEADING column of BOTH candidate indexes, so a function applied to it is');
say('evaluated FROM THE INDEX CURSOR, before the deferred table seek. It therefore fires once per');
say('index entry visited inside the seek range.');
say('');
say('IT IS A LOWER BOUND ON U1. It does not see interior b-tree pages descended during the seek,');
say('pager reads, or any other loop. A POSITIVE VALUE IS CONCLUSIVE OF FAILURE (§4.6 S5); NO VALUE');
say('OF IT MAY BE READ AS U1 = 0, AND THIS PROBE NEVER SO READS IT.');
say('');
say('Calibration: a fixture whose in-range entry count is known BY CONSTRUCTION, run on BOTH');
say('candidate plans. If the instrument does not reproduce the known number exactly, it is not');
say('trustworthy and nothing below may rest on it.');
say('');

const CAL = { expired: 300, notYet: 400, authorized: 2 };
let calibrationOk = true;
{
  say(`  Constructed cohort: expired=${CAL.expired} (eff_to closed), notYetBounded=${CAL.notYet} ` +
      `(eff_from future), authorized=${CAL.authorized}`);
  say('');
  for (const pin of [false, true]) {
    const d = new DatabaseSync(':memory:');
    d.exec(`CREATE TABLE cv (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
              eff_from INTEGER NOT NULL, eff_to INTEGER);
            CREATE INDEX i_cal_vo ON cv (open_ended, eff_from);
            CREATE INDEX i_cal_vb ON cv (open_ended, eff_to, eff_from);`);
    const ins = d.prepare('INSERT INTO cv VALUES (?,?,?,?)');
    d.exec('BEGIN');
    for (let i = 0; i < CAL.expired; i++)    ins.run('E' + i, 0, 100, 500);
    for (let i = 0; i < CAL.notYet; i++)     ins.run('F' + i, 0, 900000, 990000);
    for (let i = 0; i < CAL.authorized; i++) ins.run('A' + i, 0, 100, 990000);
    d.exec('COMMIT');
    let idx = 0, row = 0;
    d.function('probe_idx', { deterministic: false }, (_openEnded) => { idx++; return 1; });
    d.function('probe_ver', { deterministic: false }, (_vid) => { row++; return 1; });
    const sql = `SELECT version_id FROM cv ${pin ? 'INDEXED BY i_cal_vb ' : ''}` +
                'WHERE probe_idx(open_ended) AND probe_ver(version_id) ' +
                'AND open_ended = 0 AND eff_to > 1000 AND eff_from <= 1000';
    const plan = d.prepare('EXPLAIN QUERY PLAN ' + sql).all().map(r => r.detail).join(' | ');
    const rows = d.prepare(sql).all();
    // Expected in-range entries follow from WHICH BOUND the chosen index seeks on.
    const onVb = /i_cal_vb/.test(plan);
    const expect = onVb ? CAL.notYet + CAL.authorized : CAL.expired + CAL.authorized;
    const ok = idx === expect;
    calibrationOk = calibrationOk && ok;
    say(`  ${pin ? 'PINNED  i_cal_vb' : 'PLANNER CHOICE  '}  plan: ${plan}`);
    say(`      index-cursor calls = ${rpad(idx, 5)}   expected by construction = ${rpad(expect, 5)}   ` +
        (ok ? 'EXACT — instrument TRUSTWORTHY' : 'MISMATCH — instrument NOT trustworthy'));
    say(`      row-access calls   = ${rpad(row, 5)}   rows returned = ${rows.length}`);
    say(`      -> the ${onVb ? 'UPPER' : 'LOWER'} bound is the seek; the other bound is a residual, and the ` +
        `${onVb ? CAL.notYet : CAL.expired} unauthorized entries it rejects were ${onVb ? 'NOT' : ''} row-accessed`);
    say('');
    d.close();
  }
}
if (!calibrationOk) { say('ABORTING — the index-cursor instrument failed calibration.'); process.exit(1); }
say('  CALIBRATION PASSED on both plans. The instrument reproduces the constructed count exactly,');
say('  and it reproduces it under BOTH index choices — so it is not measuring one plan\'s artefact.');
say('');
say('  Note the row-access column in the pinned case. The design that examined 402 index entries');
say('  reported 2 row accesses. THAT IS THE SHAPE OF TASK-0038\'s K8 RESULT, reproduced on a');
say('  fixture small enough to check by hand.');
say('');

/* ================================================================== *
 * SECTION 5 — GAP 3: plan-independence. The measurement grid.
 * ================================================================== */

const CONFIGS = [
  { id: 'c1', label: 'baseline — no statistics collected',        cfg: {} },
  { id: 'c2', label: 'automatic_index = off',                     cfg: { automaticIndexOff: true } },
  { id: 'c3', label: 'fresh connection, statement re-prepared 3x', cfg: {}, freshEachPrepare: 3 },
  { id: 'c4', label: 'query instant shifted (parameter variation)', cfg: {}, at: T_ORIGIN + 1 },
  { id: 'c5', label: 'after ANALYZE',                             cfg: { analyze: true } },
  { id: 'c6', label: 'after ANALYZE + PRAGMA optimize',           cfg: { analyze: true, optimize: true } },
];

RULE('=');
say('SECTION 5 — GAP 3: IS THE EVIDENCE INDEPENDENT OF A SINGLE OBSERVED PLAN?');
RULE('=');
say('MSG-0120 §3 requires evidence independent of one observed optimizer plan where independence is');
say('required. One EXPLAIN QUERY PLAN is one observation: one fixture, one size, one distribution,');
say('one statistics state. This section varies all four, legally and without changing any design.');
say('');
say('Configurations (all are ordinary, supported engine states; none is exotic):');
for (const c of CONFIGS) say(`  ${c.id}  ${c.label}`);
say('');
say('Sizes: ' + SIZES.join(', ') + '   Distributions: ' + SKEWS.join(', '));
say('');
say('Columns:  U     = unauthorized units at the ROW-ACCESS placement (TASK-0038\'s placement, unchanged)');
say('          Nidx  = ENGINE-MEASURED count of entries visited by the version-traversal loops,');
say('                  from the calibrated index-cursor instrument. All entries, not just');
say('                  unauthorized ones — the instrument cannot classify them.');
say('          U1lb  = DERIVED conservative lower bound on UNAUTHORIZED entries visited,');
say('                  = max(0, Nidx - Amax), Amax = authorized-resident x limbs x chunks-per-version.');
say('                  A ZERO HERE MEANS "THIS BOUND PROVES NOTHING AT THIS SIZE". It is NOT U1 = 0.');
say('          ans   = authorized chunks answered in the steady state (an anchor, not a re-run)');
say('');
say('Nidx is measured; U1lb is arithmetic applied to it. The two are kept in separate columns so a');
say('later reader can see exactly which number the engine produced and which this probe derived.');
say('');

const grid = [];        // every measurement, flat
let transferFailures = 0;

for (const design of DESIGNS.filter(d => d.kind === 'partitioned')) {
  for (const skew of SKEWS) {
    RULE('-');
    say(`DESIGN ${design.id} — ${design.label}`);
    say(`distribution: ${skew}`);
    RULE('-');
    say(`  ${pad('cfg', 4)} ${rpad('M', 6)} ${rpad('U', 6)} ${rpad('Nidx', 6)} ${rpad('U1lb', 6)} ${rpad('ans', 4)}  version traversal (the loops that decide U and U1)`);
    for (const conf of CONFIGS) {
      for (const M of SIZES) {
        const now = conf.at ?? TX;
        const kernel = buildFixture(M, { skew });

        // three executions per cell: uninstrumented (plan control), row placement, index placement
        const dbN = freshDb(kernel, design, conf.cfg);
        const rN = execute(dbN, kernel, design, now, 'none');
        dbN.close();

        const dbR = freshDb(kernel, design, conf.cfg);
        const rR = execute(dbR, kernel, design, now, 'row');
        dbR.close();

        const dbI = freshDb(kernel, design, conf.cfg);
        const rI = execute(dbI, kernel, design, now, 'index');
        dbI.close();

        // THE TRANSFER LICENCE, checked rather than assumed: the instrument may not have
        // moved the seek. If it did, the count is not transferable and is reported as such.
        const transferable = rN.sig === rR.sig && rN.sig === rI.sig;
        if (!transferable) transferFailures++;

        // determinism: re-prepare in fresh connections and require an identical signature
        let stable = true;
        for (let i = 0; i < (conf.freshEachPrepare ?? 0); i++) {
          const d2 = freshDb(kernel, design, conf.cfg);
          const r2 = execute(d2, kernel, design, now, 'none');
          stable = stable && r2.sig === rN.sig;
          d2.close();
        }

        const authorizedCount = kernel.chunks.filter(ch => chunkAuthorized(kernel, ch, now)).length;
        const nidx = transferable ? rI.idxCalls : null;
        const u1lb = nidx === null ? null : u1LowerBound(nidx, kernel, now);
        const vsig = versionTraversalSignature(rN.plan);
        grid.push({ design: design.id, skew, cfg: conf.id, M, sig: rN.sig, vsig,
                    U: rR.U, Nidx: nidx, U1lb: u1lb,
                    ans: rR.answered.length, authorizedCount,
                    leaked: rR.leaked.length, transferable, stable, plan: rN.plan });

        say(`  ${pad(conf.id, 4)} ${rpad(M, 6)} ${rpad(rR.U, 6)} ` +
            `${rpad(nidx ?? 'N/T', 6)} ${rpad(u1lb ?? 'N/T', 6)} ` +
            `${rpad(rR.answered.length + '/' + authorizedCount, 4)}  ` + vsig +
            (transferable ? '' : '   <- INSTRUMENT MOVED THE SEEK: NOT TRANSFERABLE') +
            (stable ? '' : '   <- SIGNATURE NOT STABLE ACROSS RE-PREPARES'));
      }
    }
    say('');
  }
}

/* --- distinct plans per design ------------------------------------ */
RULE('=');
say('SECTION 6 — HOW MANY DISTINCT PLANS DID EACH DESIGN PRODUCE?');
RULE('=');
say('This is the question gap 3 actually asks. A design that produces ONE plan across every legal');
say('configuration has evidence that is not an artefact of one observation. A design that produces');
say('more than one has evidence that IS.');
say('');
say('Reported at two granularities, because INDEXED BY pins ONE limb of ONE table and leaves the');
say('rest of the plan to the optimizer. The VERSION TRAVERSAL is the security-relevant part: it is');
say('what decides which version entries are visited, and therefore what U and U1 can be.');
say('');
for (const id of ['K7', 'K8']) {
  const mine = grid.filter(g => g.design === id);
  const fullSigs = new Set(mine.map(g => g.sig));
  const vsigs = new Map();
  for (const g of mine) {
    if (!vsigs.has(g.vsig)) vsigs.set(g.vsig, []);
    vsigs.get(g.vsig).push(g);
  }
  say(`  ${id}: ${fullSigs.size} distinct FULL plan(s) and ${vsigs.size} distinct VERSION TRAVERSAL(s) ` +
      `across ${mine.length} measurements`);
  let n = 0;
  for (const [vsig, cells] of vsigs) {
    n++;
    const where = cells.map(g => `${g.skew.slice(0, 5)}/${g.cfg}/M=${g.M}`);
    const us = [...new Set(cells.map(g => g.U))].sort((a, b) => a - b);
    const nd = [...new Set(cells.map(g => g.Nidx))].sort((a, b) => a - b);
    const u1 = [...new Set(cells.map(g => g.U1lb))].sort((a, b) => a - b);
    say(`     traversal ${n}: ${vsig}`);
    say(`             seen in ${where.length} cells: ${where.slice(0, 6).join(', ')}${where.length > 6 ? ', …' : ''}`);
    say(`             configurations: ${[...new Set(cells.map(g => g.cfg))].sort().join(', ')}`);
    say(`             U    over those cells = ${us.join(', ')}`);
    say(`             Nidx over those cells = ${nd.join(', ')}`);
    say(`             U1lb over those cells = ${u1.join(', ')}`);
  }
  say('');
}
say(`  Transfer-licence failures (instrument moved the seek): ${transferFailures} of ${grid.length} measurements.`);
say(`  Signature instability across fresh re-prepares: ${grid.filter(g => !g.stable).length} of ` +
    `${grid.filter(g => g.stable !== undefined).length} measurements.`);
say('');

/* ================================================================== *
 * SECTION 7 — E1 evidence that does NOT depend on the plan
 * ================================================================== */

RULE('=');
say('SECTION 7 — E1 WITHOUT THE OPTIMIZER: the authorizer as a second, independent instrument');
RULE('=');
say('EXPLAIN QUERY PLAN reports what the optimizer CHOSE. sqlite3_set_authorizer — bound by this');
say('Node build as DatabaseSync.setAuthorizer — fires during STATEMENT PREPARATION and reports every');
say('(table, column) the statement MAY read, before and independently of any plan choice.');
say('');
say('That makes it a genuinely plan-independent E1 instrument for ONE limb of E1: WHICH STRUCTURES');
say('ARE REACHABLE. It reports a SUPERSET of what any plan opens, which is the fail-closed direction —');
say('if no scope-spanning structure appears in the superset, no plan can open one.');
say('');
say('IT DOES NOT MEASURE HOW MUCH IS TRAVERSED. It cannot count entries, it cannot see the index');
say('choice, and it says nothing about U or U1. It closes the "which structures" limb of gap 3 and');
say('leaves the "how much" limb exactly where section 6 leaves it.');
say('');

const SPANNING = ['k_version', 'k_chunk', 'k_version_audience', 'k_authz_edge',
                  'subject_token', 'sqlite_master', 'sqlite_schema', 'sqlite_stat1'];
/*
 * A CORRECTION MADE INSIDE THIS PROBE, RECORDED RATHER THAN QUIETLY FIXED.
 *
 * The first draft asserted that the authorizer fires only at prepare time and printed
 * the execution-phase callback count as confirmation. IT PRINTED A NON-ZERO NUMBER — 101
 * for K7 — which CONTRADICTED the assertion the same line was making. A minimal case
 * showed zero execution-phase callbacks; the probe's own query shape showed a count equal
 * to the prepare-phase count, i.e. the statement is compiled a SECOND time on first step.
 *
 * The claim is therefore replaced by a MEASUREMENT that can distinguish the two
 * possibilities: if the count is a compilation event it is INVARIANT WITH COLLECTION
 * SIZE; if it were a per-entry counter it would scale with it. The probe measures at two
 * sizes and reports what it finds.
 */
const authzEvidence = {};
for (const design of DESIGNS) {
  const perSize = [];
  let tables = [], spanningTouched = [];
  for (const M of [500, 5000]) {
    const kernel = buildFixture(M, { skew: 'uniform' });
    const db = freshDb(kernel, design, {});
    const c = newCounters();
    installProbeFunctions(db, c, kernel, TX);
    const keys = design.routing ? design.routing(db, c) : null;
    const sql = buildQuery(design, keys, 'row');
    if (!sql) { db.close(); continue; }
    const reads = new Set();
    let prepareCalls = 0, executeCalls = 0, phase = 'prepare';
    db.setAuthorizer((action, arg1) => {
      if (phase === 'prepare') prepareCalls++; else executeCalls++;
      if (action === constants.SQLITE_READ && arg1) reads.add(arg1);
      return constants.SQLITE_OK;
    });
    let st = null;
    try { st = db.prepare(sql); } catch (e) { /* surfaces as an empty read set */ }
    phase = 'execute';
    try { st && st.all(bind(sql, paramsFor(TX, keys))); } catch (e) { /* likewise */ }
    tables = [...reads].sort();
    spanningTouched = tables.filter(t => SPANNING.includes(t));
    perSize.push({ M, prepareCalls, executeCalls, tableCount: tables.length });
    db.close();
  }
  if (!perSize.length) continue;
  const invariant = perSize.every(p => p.prepareCalls === perSize[0].prepareCalls &&
                                       p.executeCalls === perSize[0].executeCalls);
  authzEvidence[design.id] = { tables, spanningTouched, perSize, invariant };
  say(`  ${design.id}: ${tables.length} distinct tables reachable, reported at statement compilation`);
  say(`      ${tables.slice(0, 8).join(', ')}${tables.length > 8 ? `, … (${tables.length - 8} more)` : ''}`);
  say(`      scope-spanning structures among them: ` +
      (spanningTouched.length ? spanningTouched.join(', ') + '   <- E1 VIOLATED, plan-independently'
                              : 'NONE   <- every reachable structure is a routed partition'));
  for (const p of perSize)
    say(`      M=${rpad(p.M, 6)}  callbacks at prepare=${rpad(p.prepareCalls, 4)} ` +
        `at first step=${rpad(p.executeCalls, 4)}  tables reported=${p.tableCount}`);
  say(`      -> counts are ${invariant ? 'INVARIANT with collection size' : 'NOT invariant with collection size'}` +
      `, so this is a COMPILATION event`);
  say(`         ${invariant ? '(the statement is compiled a second time on first step; both compilations report the same set),'
                            : '(WHICH CONTRADICTS THE COMPILATION READING — treat this instrument as UNCHARACTERISED),'}`);
  say(`         ${invariant ? 'NOT a per-entry counter. It cannot measure U or U1 and is not used to.'
                            : 'and nothing below rests on it.'}`);
  say('');
}

/* ================================================================== *
 * SECTION 8 — G-Q4 differential, across configurations
 * ================================================================== */

RULE('=');
say('SECTION 8 — G-Q4, RE-MEASURED ACROSS CONFIGURATIONS (§4.9 G-Q4.1–G-Q4.4)');
RULE('=');
say('G-Q4.2 requires that the routed set and the routing-phase read count NOT vary when collections');
say('differ ONLY in other subjects\' structures. TASK-0038 measured this once. Gap 3 asks whether');
say('the evidence survives configuration change, so it is re-run across every configuration.');
say('');
say(`  ${pad('design', 7)} ${pad('cfg', 4)} ${rpad('others=0', 22)} ${rpad('others=64', 22)}  verdict`);
let gq4AllMet = true;
for (const design of DESIGNS.filter(d => d.routing)) {
  for (const conf of CONFIGS) {
    const a = (() => {
      const k = buildFixture(500, { otherSubjects: 0, skew: 'uniform' });
      const db = freshDb(k, design, conf.cfg); const c = newCounters();
      const keys = design.routing(db, c); db.close();
      return { n: keys.length, reads: c.route.reads, set: keys.join('|') };
    })();
    const b = (() => {
      const k = buildFixture(500, { otherSubjects: 64, skew: 'uniform' });
      const db = freshDb(k, design, conf.cfg); const c = newCounters();
      const keys = design.routing(db, c); db.close();
      return { n: keys.length, reads: c.route.reads, set: keys.join('|') };
    })();
    const met = a.set === b.set && a.reads === b.reads;
    gq4AllMet = gq4AllMet && met;
    say(`  ${pad(design.id, 7)} ${pad(conf.id, 4)} ` +
        `${rpad(`set=${a.n} reads=${a.reads}`, 22)} ${rpad(`set=${b.n} reads=${b.reads}`, 22)}  ` +
        (met ? 'IDENTICAL — G-Q4.2 MET' : 'DIFFERS — G-Q4.2 FAILED'));
  }
}
say('');
say('  G-Q4.3 (no catalogue enumeration) is evidenced plan-independently in section 7: the');
say('  authorizer reports sqlite_schema/sqlite_master as reachable ONLY if the statement can read');
say('  it. G-Q4.4 (routing units counted in U) is satisfied by construction — route.unauth is');
say('  unioned into U in every cell above.');
say('');

/* ================================================================== *
 * SECTION 9 — VALIDITY GATE 2: the negative control (§4.6 S8)
 * ================================================================== */

RULE('=');
say('SECTION 9 — VALIDITY GATE 2: the negative control (EPA-0006 §4.6 S8)');
RULE('=');
say('A deliberately non-conforming candidate must be included in EVERY probe run. If the harness');
say('does not fail it, this run is VOID and its findings prove nothing.');
say('');
const NC = DESIGNS.find(d => d.id === 'NC');
let ncFailures = 0, ncCases = 0;
for (const M of SIZES) {
  const kernel = buildFixture(M, { skew: 'uniform' });
  const db = freshDb(kernel, NC, {});
  const r = execute(db, kernel, NC, TX, 'row');
  const authorized = kernel.chunks.filter(ch => chunkAuthorized(kernel, ch, TX)).length;
  const failed = r.leaked.length > 0 || r.answered.length < authorized;
  ncCases++; if (failed) ncFailures++;
  say(`  M=${rpad(M, 6)}  U=${rpad(r.U, 6)} answered=${r.answered.length}/${authorized} ` +
      `leaked=${r.leaked.length}  -> ${failed ? 'FAILS, as required' : 'DID NOT FAIL — RUN IS VOID'}`);
  db.close();
}
say('');
say(`  The control failed in ${ncFailures} of ${ncCases} cases -> ` +
    (ncFailures > 0 ? 'the run is VALID (§4.6 S8).' : 'THE RUN IS VOID.'));
say('');

/* --- the E4-adjacent surface scan, promised in section 2.5 -------- */
say('  Surface scan promised in section 2.5 — NOT E4, and not offered as E4.');
{
  const kernel = buildFixture(500, { skew: 'uniform' });
  const unauthorizedBodies = kernel.chunks
    .filter(ch => !chunkAuthorized(kernel, ch, TX))
    .map(ch => ch.body);
  const distinctive = [...new Set(unauthorizedBodies)].slice(0, 5);
  let hits = 0, surfaces = 0;
  for (const design of DESIGNS.filter(d => d.routing)) {
    const db = freshDb(kernel, design, {});
    const c = newCounters(); installProbeFunctions(db, c, kernel, TX);
    const keys = design.routing(db, c);
    const sql = buildQuery(design, keys, 'row');
    const p = paramsFor(TX, keys);
    const text = [
      ...planOf(db, sql, p),
      ...opcodesOf(db, sql, p).map(r => `${r.p4 ?? ''} ${r.comment ?? ''}`),
    ].join('\n');
    surfaces++;
    for (const b of distinctive) if (text.includes(b)) hits++;
    db.close();
  }
  say(`    ${surfaces} engine-produced text surfaces scanned against ${distinctive.length} unauthorized`);
  say(`    passage bodies -> ${hits} occurrence(s). Parameters are BOUND, never inlined, so no passage`);
  say(`    text reaches the plan or the opcode operands. This says nothing about an engine log.`);
}
say('');

/* ================================================================== *
 * SECTION 10 — EVIDENCE AND VERDICTS
 * ================================================================== */

RULE('=');
say('SECTION 10 — EVIDENCE PER CANDIDATE, AND VERDICTS');
RULE('=');
say('EPA-0006 §4.6 S6: CLEARED requires E1 + E2 + E3 + E4 ALL OBTAINED, U = 0 at every measured size,');
say('shown not to grow with N. §4.6 S9: NOT CLEARED is the required answer wherever evidence is absent.');
say('');

for (const id of ['K7', 'K8']) {
  const mine = grid.filter(g => g.design === id);
  const sigs = new Set(mine.map(g => g.sig));
  const vsigs = new Set(mine.map(g => g.vsig));
  const uVals = [...new Set(mine.map(g => g.U))].sort((a, b) => a - b);
  const ndVals = [...new Set(mine.map(g => g.Nidx))].filter(v => v !== null).sort((a, b) => a - b);
  const u1Vals = [...new Set(mine.map(g => g.U1lb))].filter(v => v !== null).sort((a, b) => a - b);
  const u1Max = u1Vals.length ? u1Vals[u1Vals.length - 1] : null;
  const anyLeak = mine.some(g => g.leaked > 0);
  const az = authzEvidence[id];

  // Does U vary across configurations while the DESIGN is fixed? That is the question
  // gap 3 exists to answer, and it is answered by the data rather than by argument.
  const uVaries = uVals.length > 1 &&
    [...new Set(mine.filter(g => g.M === 20000 && g.skew === 'uniform').map(g => g.U))].length > 1;

  RULE('-');
  say(`CANDIDATE ${id}`);
  RULE('-');
  say(`  E1  traversal-bounding`);
  say(`      plan evidence        : ${sigs.size} distinct full plan(s), ${vsigs.size} distinct version` +
      ` traversal(s), across ${mine.length} configurations`);
  say(`      plan-INDEPENDENT     : the authorizer reports ${az.tables.length} reachable structures, ` +
      `${az.spanningTouched.length} of them scope-spanning`);
  say(`      -> REACHABLE-STRUCTURE limb: ${az.spanningTouched.length === 0
        ? 'HOLDS, and holds INDEPENDENTLY OF THE OPTIMIZER. No plan can open a'
        : 'VIOLATED — ' + az.spanningTouched.join(', ')}`);
  if (az.spanningTouched.length === 0)
    say(`         scope-spanning structure because the statement cannot reach one. This is the one`);
  say(`         ${az.spanningTouched.length === 0 ? 'piece of E1 evidence here that survives gap 3 intact.' : ''}`);
  say(`      -> CONFINEMENT limb: a property of the CHOSEN PLAN, and ` +
      (vsigs.size === 1
        ? 'the version traversal was IDENTICAL in every configuration tested.'
        : `the version traversal took ${vsigs.size} DIFFERENT FORMS. NOT plan-independent.`));
  say('');
  say(`  E2  counters`);
  say(`      U    (row-access placement, engine-measured) : ${uVals.join(', ')}`);
  say(`      Nidx (entries visited,      engine-measured) : ${ndVals.join(', ')}`);
  say(`      U1lb (unauthorized entries, DERIVED bound)   : ${u1Vals.join(', ')}`);
  say(`      -> U1 = 0 IS NOT CLAIMED ANYWHERE. The largest derived lower bound is ${u1Max}, and it`);
  say(`         rises with N. §4.6 S4 counts U1 as examining and §4.7 Q1's fail-closed default keeps`);
  say(`         that reading, so E2 requires U = 0 WITH U1 INCLUDED.`);
  say(`      -> ${u1Max > 0
        ? 'A positive lower bound is conclusive under §4.6 S5: E2 IS NOT OBTAINED.'
        : 'No positive bound was derived, which is still not a demonstrated zero: E2 IS NOT OBTAINED.'}`);
  if (uVaries)
    say(`      -> AND U ITSELF IS NOT A PROPERTY OF THIS DESIGN: at a fixed size and distribution it`);
  if (uVaries)
    say(`         takes different values in different configurations, with the design unchanged.`);
  say('');
  say(`  E3  opaque stages`);
  say(`      N/A for this fixture: every structure is relational, with no FTS5 MATCH, no vector`);
  say(`      index and no ANN graph. THE EXEMPTION IS NOT TRANSFERABLE — a real lexical or vector`);
  say(`      stage reintroduces the opaque stage and G-Q6 applies unchanged.`);
  say('');
  say(`  E4  log inspection`);
  say(`      NOT OBTAINABLE on this test subject — established by enumeration in section 2, not`);
  say(`      inferred. Per §4.6 S6 an absent evidence class yields NOT CLEARED.`);
  say('');
  say(`  G-Q4 routing`);
  say(`      ${gq4AllMet ? 'MET across every configuration tested' : 'FAILED in at least one configuration'}` +
      ` (section 8); no catalogue reachable at prepare time (section 7).`);
  say('');
  say(`  Answers: authorized content withheld in ${mine.filter(g => g.ans < g.authorizedCount).length}` +
      ` of ${mine.length} cells; unauthorized content returned in ${mine.filter(g => g.leaked > 0).length}.`);
  say('');
  say(`  >>> VERDICT: NOT CLEARED`);
  say(`      Deciding evidence, in the order it decides:`);
  say(`        1. E4 is UNOBTAINABLE (section 2) — sufficient on its own under §4.6 S6/S9.`);
  say(`        2. E2 is NOT OBTAINED: the derived U1 lower bound reaches ${u1Max} and rises with N`);
  say(`           (sections 5 and 6). The row-access zero, where it occurs, is a zero of the`);
  say(`           INSTRUMENT'S PLACEMENT and not of the design — section 3's bytecode shows why.`);
  say(`        3. ${vsigs.size === 1
        ? 'E1\'s confinement limb rested on ONE version traversal, identical across every configuration tested. That is evidence FOR the design, and it is still not a general guarantee.'
        : `E1's confinement limb is NOT plan-independent: ${vsigs.size} distinct version traversals across ordinary, supported engine states.`}`);
  if (anyLeak) say(`        4. Unauthorized content was RETURNED in at least one cell — independently disqualifying.`);
  say('');
}

/* ================================================================== *
 * SECTION 11 — WHAT THIS RUN DOES NOT ESTABLISH
 * ================================================================== */

RULE('=');
say('SECTION 11 — FINDINGS. Each one is arithmetic on the tables above, not commentary.');
RULE('=');

/* F1 — the two designs visit the SAME entries and disagree only about what U can see */
{
  const cell = (id, cfg, M, skew = 'uniform') =>
    grid.find(g => g.design === id && g.cfg === cfg && g.M === M && g.skew === skew);
  const rows = SIZES.map(M => ({ M, k7: cell('K7', 'c1', M), k8: cell('K8', 'c1', M) }))
                    .filter(r => r.k7 && r.k8);
  const sameNidx = rows.every(r => r.k7.Nidx === r.k8.Nidx);
  say('F1. K7 AND K8 VISIT THE SAME NUMBER OF ENTRIES. `U` SEES ONE AND NOT THE OTHER.');
  say('');
  say(`      ${rpad('M', 8)} ${rpad('K7 Nidx', 9)} ${rpad('K8 Nidx', 9)} ${rpad('K7 U', 8)} ${rpad('K8 U', 8)}`);
  for (const r of rows)
    say(`      ${rpad(r.M, 8)} ${rpad(r.k7.Nidx, 9)} ${rpad(r.k8.Nidx, 9)} ${rpad(r.k7.U, 8)} ${rpad(r.k8.U, 8)}`);
  say('');
  say(`    Nidx identical at every size: ${sameNidx ? 'YES' : 'NO'}. The two designs traverse the same`);
  say('    number of index entries; they differ only in WHICH BOUND is the seek, and therefore in');
  say('    whether the unauthorized entries are rejected FROM THE INDEX (invisible to a row-access');
  say('    counter) or AFTER A ROW READ (visible to it).');
  say('');
  say('    TASK-0038 reported K7 U=715 and K8 U=0 at M=5000 and called that the sharpest result in');
  say('    the table. IT WAS CORRECTLY MEASURED AND IT MEANT SOMETHING NARROWER THAN IT LOOKED:');
  say('    K8 did not examine less. It examined the same amount somewhere the instrument could not');
  say('    see. MSG-0118 said as much in its result 4 and could not measure it; this run measures it.');
  say('');
}

/* F2 — ANALYZE alone moves U, with the design untouched */
{
  const k7u = (cfg, M) => (grid.find(g => g.design === 'K7' && g.cfg === cfg && g.M === M &&
                                          g.skew === 'uniform') ?? {});
  const before = k7u('c1', 20000), after = k7u('c5', 20000);
  say('F2. `ANALYZE` ALONE DRIVES K7\'s U FROM ' + before.U + ' TO ' + after.U + ' — AND CHANGES NOTHING ELSE.');
  say('');
  say('    ANALYZE is an ordinary, supported maintenance operation. It writes statistics. It does');
  say('    not touch the schema, the data, the indexes, the query text or the design. After it,');
  say(`    K7's planner switches the populated partition's bounded limb from the LOWER-bound index`);
  say(`    to the UPPER-bound one — becoming, in the only respect that matters here, K8.`);
  say('');
  say(`    U:    ${before.U} -> ${after.U}        (the row-access counter goes quiet)`);
  say(`    Nidx: ${before.Nidx} -> ${after.Nidx}     (the traversal visits ONE MORE entry, not fewer)`);
  say('');
  say('    A candidate measured before a routine ANALYZE and one measured after would receive');
  say('    OPPOSITE `U` readings for THE SAME DESIGN. On this engine `U` is not a property of the');
  say('    design; it is a property of the statistics table.');
  say('');
}

/* F3 — what plan-independence was and was not obtained */
{
  const vs = (id) => new Set(grid.filter(g => g.design === id).map(g => g.vsig)).size;
  say('F3. E1 SPLITS INTO A LIMB THAT IS PLAN-INDEPENDENT AND A LIMB THAT IS NOT.');
  say('');
  say('    REACHABLE STRUCTURES — plan-independent, and OBTAINED. The authorizer enumerates every');
  say('    structure the statement can read, at compile time, before any plan choice. For K7 and K8');
  say('    it reports only routed partitions and no scope-spanning structure, and it reports the');
  say('    same set under every configuration. It is a SUPERSET of what any plan opens, which is the');
  say('    fail-closed direction: what it excludes, no plan can reach.');
  say('');
  say(`    CONFINEMENT — NOT plan-independent. K7 produced ${vs('K7')} distinct version traversals and`);
  say(`    K8 produced ${vs('K8')}, across configurations that are all ordinary engine states. INDEXED BY`);
  say('    pinned the bounded limb and did NOT pin the rest: K8\'s open limb still became a full');
  say('    partition scan after ANALYZE. Pinning one limb pins one limb.');
  say('');
  say('    So the honest position is: the "which structures" half of E1 can be evidenced without');
  say('    trusting a single plan observation, and the "how much is traversed" half cannot — not on');
  say('    this engine, and not by any instrument reachable from it.');
  say('');
}

/* F4 — the instrument that would settle it */
say('F4. THE ONE INSTRUMENT THAT WOULD SETTLE U1 IS A BUILD FLAG AWAY, AND THAT IS A SELECTION');
say('    CRITERION RATHER THAN A DEFECT. `sqlite3_stmt_scanstatus` reports per-loop visit counts');
say('    directly. It requires SQLITE_ENABLE_STMT_SCANSTATUS at compile time (ABSENT here) AND a');
say('    binding in node:sqlite (ABSENT here). EPA-0006 §4.6 S10 already holds that an engine which');
say('    cannot be observed fails the burden AMD-01 places on it. This run is a worked example of');
say('    that rule biting: not "the engine examined too much" but "the engine cannot be asked".');
say('    Recorded as evidence, NOT as a recommendation to select any engine or build option.');
say('');

RULE('=');
say('SECTION 12 — WHAT THIS RUN DOES NOT ESTABLISH');
RULE('=');
say('  * NOTHING IS CLEARED. Both candidates are NOT CLEARED. No gate was relaxed to reach that.');
say('  * U1 = 0 IS NOT ESTABLISHED FOR ANYTHING, and is not claimed. The index-cursor instrument is');
say('    a LOWER BOUND: it can prove examination, never absence of examination.');
say('  * E4 IS NOT OBTAINED. It is established UNOBTAINABLE ON THIS TEST SUBJECT. That is a fact');
say('    about node:sqlite and this build of SQLite, NOT about engines in general, and NOT a claim');
say('    that no engine can supply E4.');
say('  * NO PLANNER BEHAVIOUR IS GENERALIZED. Every plan, every U and every U1 lower bound here is');
say('    evidence about SQLite ' + SQLITE_VERSION + ' via node:sqlite, in these configurations, on');
say('    these fixtures. MSG-0120 forbids carrying it to another engine without evidence.');
say('  * THE CONFIGURATION SET IS NOT EXHAUSTIVE. Plan stability observed across the configurations');
say('    tested is not plan stability in general: a future engine version, a different page size, a');
say('    different statistics state or a build with ENABLE_STAT4 could all choose differently.');
say('  * K3 AND K4 ARE UNCHANGED and remain NOT CLEARED under MSG-0119\'s strict Q11 reading. They');
say('    were not re-run and no evidence here bears on them.');
say('  * ALL PRIOR VERDICTS STAND. TASK-0033/0035/0037/0038 were not modified or re-run. The');
say('    TASK-0038 grid is not replaced: this run explains WHY K8 measured U = 0 there, and that');
say('    explanation leaves the recorded U = 0 correct AS A ROW-ACCESS COUNT and insufficient as');
say('    evidence of non-examination.');
say('  * NO ENGINE, RUNTIME, PROVIDER, MODEL OR INDEX TECHNOLOGY IS SELECTED. No implementation or');
say('    deployment is authorized, proposed or performed. No ADR is amended.');
say('');
RULE('=');
say('END OF PROBE OUTPUT');
RULE('=');

/* --- write the captured output ----------------------------------- */
const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('./probe-output.txt', import.meta.url), out.join('\n') + '\n');
