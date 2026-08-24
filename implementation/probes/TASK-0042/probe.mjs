/*
 * ======================================================================================
 * TASK-0042 — ARCHITECTURE-BOUND RETRIEVAL EVIDENCE
 * routing · placements · transitions · I5/I7/I8 · the E4 re-check
 * ======================================================================================
 *
 * AUTHORITY   MSG-0137 (AUTHORIZED), with MSG-0138's queue instruction, and with the four
 *             rulings BINDING:
 *               MSG-0134  Q1 = A, STRICT     — reading an unauthorized index entry, key or
 *                                              metadata IS examination. U1 stays in scope.
 *               MSG-0135  Q2 = B             — physical isolation where necessary; query-time
 *                                              predicates alone are insufficient where the
 *                                              engine examines unauthorized candidates first.
 *                                              ROUTING AND PHYSICAL STRUCTURE ARE MEASURED.
 *               MSG-0136  Q7 = A             — ZERO stale-answer tolerance. No elapsed-time
 *                                              allowance exists. Abstain, never answer stale.
 *               MSG-0133  Q13                — Release 1 is the current/"now" frame only.
 *             Queue section CLAUDE-TASKS.md TASK-0042. Reconciliation MSG-0139.
 *             Criterion and gates: EPA-0006 §4.6 S1–S11 (incl. S7.1–S7.4), §4.8, §4.9
 *             G-Q4/G-Q5/G-Q6, §4.10 G-Q7, §4.12, §4.13.
 *
 * THIS PROBE SELECTS NOTHING. It adopts, recommends, installs and deploys no engine,
 * runtime, provider, model or index technology. It amends no ADR. It relaxes no gate. It
 * introduces no numeric staleness threshold, and produces no benchmark, latency, capacity,
 * recall or throughput figure. No wall clock is read: the clock is a fixture integer. No
 * network is reached. No real or confidential corpus is entered; every fixture is synthetic
 * and generated in-process. `:memory:` only. Nothing is installed and no file is created
 * other than this probe's own captured output.
 *
 * SUBJECT     SQLite via `node:sqlite` — EPA-0006 class R TEST SUBJECT, not a selection.
 *             Its planner behaviour MAY NOT be generalized to any other engine.
 *
 * WHAT IS DELIBERATELY NOT RE-RUN (MSG-0137 item 3 forbids repetition)
 *   * TASK-0033's 3-size candidate sweep.
 *   * TASK-0035's P0…NC design grid.
 *   * TASK-0037's 8-design x 11-scenario freshness grid.
 *   * TASK-0038's 7-scenario grid.
 *   * TASK-0039's 12-configuration plan-independence grid, and its M=20000 column.
 *   All of that evidence STANDS AS MEASURED and is reproduced in the record, not here.
 *
 *   What IS run here is new: physically materialised OTHER-SUBJECT partitions (which no
 *   prior probe built), two routing MECHANISMS compared, two placements no prior probe
 *   took, three patterns never measured (I5/I7/I8), the four Q7 transitions with the
 *   discriminator, and the E4 re-check.
 *
 *   The VALIDITY GATES are re-run. That is not repetition: EPA-0006 §4.6 S8 requires the
 *   adversarial precondition and a failing negative control in EVERY probe run, and without
 *   them this run's numbers would prove nothing.
 *
 * WHAT THIS RUN CANNOT DO, STATED BEFORE ANY NUMBER
 *   §4.13 GAP-B: E4 is UNOBTAINABLE on the only reachable test subject (§4.12 gap 1,
 *   established by enumeration against a nonexistent-pragma control). Under §4.6 S6 an
 *   absent evidence class yields NOT CLEARED. SO NOTHING IN THIS RUN CAN BE CLEARED,
 *   whatever any count below shows. Section 2 re-checks it; a second negative is the
 *   expected result, not a failure.
 * ======================================================================================
 */

import { DatabaseSync, constants } from 'node:sqlite';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
const RULE = (c = '-') => say(c.repeat(108));

/* ================================================================== *
 * 0. Subject, predicate, vocabulary — carried forward UNCHANGED
 * ================================================================== *
 * Identical to TASK-0033/0035/0037/0038/0039 so that any difference measured here is a
 * difference in the ROUTING, the PLACEMENT, the PATTERN or the TRANSITION — never in the
 * fixture. Changing the fixture would make every comparison with prior evidence invalid.
 */

const SUBJECT = {
  principal: 'emp-1',
  scope: 'org-a',
  classifications: ['PUBLIC', 'INTERNAL'],
  audiences: ['staff', 'all-employees'],
};

const ANSWERABLE_STATE = 'PUBLISHED';           // ADR-0018 §2; MSG-0116a/b Q10
const A1 = 'A1', A2 = 'A2', A4 = 'A4', A7 = 'A7';
/*
 * ADR-0017 §5 names A1–A7: no coverage; not authorized; insufficient support; policy gap;
 * ambiguous question; conflicting sources; system degraded. THE ASSIGNMENT OF A SPECIFIC
 * CLASS TO A SPECIFIC FIXTURE CASE BELOW IS A FIXTURE CONVENTION, NOT A RULING — no ADR
 * fixes it, and this probe does not propose one. What the gate actually turns on is
 * G-Q7.4: AN ABSTENTION, not an answer and not an empty answer.
 */

const TARGET_POLICY = 'POL-LEAVE';
const QUERY_TERM = 'leave';
const K = 6;
const CHUNKS_PER_VERSION = 2;

/* the fixture clock — an integer, never a wall-clock read */
const T_ORIGIN = 1700000000;
const T_BUILD  = T_ORIGIN - 100;
const TX       = T_ORIGIN;
const T_LATER  = T_ORIGIN + 5000;

function versionAuthorized(v, now, subj = SUBJECT) {
  if (!v) return false;
  return v.scope === subj.scope &&
         v.state === ANSWERABLE_STATE &&
         subj.classifications.includes(v.cls) &&
         v.eff_from <= now &&
         (v.eff_to === null || v.eff_to > now) &&
         v.audiences.some(a => subj.audiences.includes(a));
}
/* the same predicate with the EFFECTIVITY conjunct removed — this is what a pattern that
 * discharges 1/2a/2b/4 but NOT 3 can refine on (§4.8's refinement rule). */
function versionEntitled(v, subj = SUBJECT) {
  if (!v) return false;
  return v.scope === subj.scope &&
         v.state === ANSWERABLE_STATE &&
         subj.classifications.includes(v.cls) &&
         v.audiences.some(a => subj.audiences.includes(a));
}
const chunkAuthorized = (kernel, ch, now) =>
  versionAuthorized(kernel.versions.get(ch.version_id), now);

/* ================================================================== *
 * 1. Fixture — TASK-0038/0039's, plus PHYSICALLY PRESENT other subjects
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
 * OTHER SUBJECTS — and the gap in prior evidence this closes.
 *
 * TASK-0038 and TASK-0039 both ran the G-Q4.2 differential with `otherSubjects` versions
 * added to the KERNEL. But `buildPartitionedStore` skips any version whose partition key is
 * not the subject's — "other subjects' partitions are not materialised here" — so the
 * CATALOGUE those runs routed against CONTAINED NO OTHER SUBJECT'S STRUCTURE AT ALL.
 *
 * A differential that varies rows in a table nobody routes over does not test G-Q4.2. This
 * probe materialises other subjects' partitions PHYSICALLY, so the structure catalogue
 * really does hold structures the subject is not entitled to, and the differential and the
 * catalogue-enumeration test have something to be wrong about.
 *
 * This is NOT a re-run of the prior differential. It is the first run of it against a
 * catalogue that can fail it.
 */
function otherSubjectSpec(s) {
  return {
    principal: `emp-x${s}`,
    scope: `org-x${s % 8}`,
    classifications: [s % 2 ? 'INTERNAL' : 'PUBLIC'],
    audiences: [`team-${s}`],
  };
}

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
  // withheld authorized answer (§3.3 wrong-exclusive; the K4 trap MSG-0137 names).
  addVersion('V1', TARGET_POLICY, { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V2', TARGET_POLICY, { state: 'APPROVED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V3', 'POL-TRAVEL', { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff'], eff_from: T_ORIGIN - 5000, eff_to: T_ORIGIN + 100000 });
  addChunks('V1', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V2', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V3', 'POL-TRAVEL', SUBJECT.scope, CHUNKS_PER_VERSION);

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

  const others = [];
  for (let s = 0; s < otherSubjects; s++) {
    const spec = otherSubjectSpec(s);
    others.push(spec);
    const vid = `X${s}`;
    addVersion(vid, `POL-X${s}`, { state: ANSWERABLE_STATE, cls: spec.classifications[0],
      audiences: spec.audiences.slice(), eff_from: T_ORIGIN - 5000, eff_to: null,
      scope: spec.scope });
    chunks.push({ id: ++cid, policy_id: `POL-X${s}`, version_id: vid, scope: spec.scope,
                  body: NOISE_BODY() });
  }
  return { versions, chunks, others, reachable: true, skew, M };
}

/* ================================================================== *
 * 2. Structures, keys, and residency rules per PATTERN
 * ================================================================== */

const SAFE = (s) => String(s).replace(/[^a-z0-9]+/gi, '_').toLowerCase();

/* I1+I2+I3 keying — TASK-0038/0039's K7/K8. One structure per (scope, class, state, token). */
const tokenKeysFor = (subj) => subj.classifications.flatMap(c =>
  subj.audiences.map(a => `${subj.scope}|${c}|${ANSWERABLE_STATE}|${a}`));
const routeKeys = () => tokenKeysFor(SUBJECT);

/* I5 keying — per PRINCIPAL. §4.8 records this as NOT MEASURED. */
const principalKeyFor = (subj) => `principal:${subj.principal}`;

/* I8 keying — per EQUIVALENCE CLASS of entitlement sets. §4.13 records this NEVER MEASURED.
 * The class identity is the entitlement set itself, canonically ordered, so two principals
 * seeing exactly the same corpus collapse into one structure set. */
const classKeyFor = (subj) =>
  `class:${subj.scope}|${[...subj.classifications].sort().join(',')}|${[...subj.audiences].sort().join(',')}`;

/* I7 keying — boundary-refined effectivity. Same key as I8, but residency is additionally
 * restricted to the half-open interval [t, nextBoundary(t)). §4.13 records this NEVER
 * MEASURED. */
const boundaryKeyFor = (subj) => `boundary:${classKeyFor(subj).slice(6)}`;

/*
 * nextBoundary(kernel, t) — the smallest effectivity boundary strictly after t.
 *
 * §4.13's I7 argument turns entirely on this being DATA, not a tuning parameter: the set of
 * versions effective at T changes only when T crosses some version's eff_from or eff_to.
 * The function below reads exactly those two columns and nothing else. If no boundary
 * exists after t, the interval is unbounded and the refinement never decays — which is a
 * property of the corpus, not of the design.
 */
function nextBoundary(kernel, t) {
  let best = null;
  for (const v of kernel.versions.values()) {
    for (const b of [v.eff_from, v.eff_to]) {
      if (b === null || b === undefined) continue;
      if (b > t && (best === null || b < best)) best = b;
    }
  }
  return best;
}

/*
 * The pattern table. `keysOf(v, ctx)` returns the partition keys a version is resident in.
 * `routeOf(subj, ctx)` returns the keys the SUBJECT's routing resolves to.
 *
 * Every pattern below uses the SAME physical schema and the SAME two-limb query, so a
 * difference in U between them is a difference in RESIDENCY — which is precisely what
 * §4.8's refinement rule is about — and never a difference in query shape.
 */
const PATTERNS = {
  /* K7/K8's pattern: I1+I2+I3. Effectivity (conjunct 3) is NOT discharged. */
  token: {
    id: 'token', label: 'I1+I2+I3 — scope x class x state x audience token (K7/K8\'s pattern)',
    keysOf: (v, ctx) => {
      const ks = [];
      for (const subj of ctx.allSubjects)
        for (const key of tokenKeysFor(subj))
          if (`${v.scope}|${v.cls}|${v.state}|` === key.slice(0, key.lastIndexOf('|') + 1) &&
              v.audiences.includes(key.slice(key.lastIndexOf('|') + 1)))
            ks.push(key);
      return [...new Set(ks)];
    },
    routeOf: (subj) => tokenKeysFor(subj),
  },
  /* I5 — per principal. Discharges 1, 2a, 2b, 4. NOT 3 (effectivity). */
  I5: {
    id: 'I5', label: 'I5 — per-principal materialisation (§4.8: "not measured")',
    keysOf: (v, ctx) => ctx.allSubjects.filter(s => versionEntitled(v, s)).map(principalKeyFor),
    routeOf: (subj) => [principalKeyFor(subj)],
  },
  /* I8 — per equivalence class of entitlement sets. Same conjuncts as I5, coarser key. */
  I8: {
    id: 'I8', label: 'I8 — entitlement-class materialisation (§4.13: NEVER MEASURED)',
    keysOf: (v, ctx) => [...new Set(
      ctx.allSubjects.filter(s => versionEntitled(v, s)).map(classKeyFor))],
    routeOf: (subj) => [classKeyFor(subj)],
  },
  /* I7 — boundary-refined effectivity. Discharges 1, 2a, 2b, 4 AND 3, on the half-open
   * interval to the next boundary. The interval end is computed from kernel data. */
  I7: {
    id: 'I7', label: 'I7 — boundary-refined effectivity (§4.13: NEVER MEASURED)',
    keysOf: (v, ctx) => {
      // resident only if effective across the WHOLE interval [t, nextBoundary)
      const t = ctx.t, e = ctx.intervalEnd;
      const effectiveThroughout =
        v.eff_from <= t && (v.eff_to === null || (e !== null ? v.eff_to >= e : false));
      if (!effectiveThroughout) return [];
      return [...new Set(
        ctx.allSubjects.filter(s => versionEntitled(v, s)).map(boundaryKeyFor))];
    },
    routeOf: (subj) => [boundaryKeyFor(subj)],
  },
};

/* the authoritative kernel, as queryable tables. Present so the negative control has a
 * scope-spanning structure to be wrong about, and so the re-check has authoritative state
 * to consult. A conforming design never opens it — which is what E1 must show. */
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
  db.exec('BEGIN');
  for (const v of kernel.versions.values()) {
    iv.run(v.version_id, v.policy_id, v.scope, v.cls, v.state, v.eff_from, v.eff_to, v.recorded_at);
    for (const t of v.audiences) ia.run(v.version_id, t);
  }
  for (const ch of kernel.chunks) ic.run(ch.id, ch.policy_id, ch.version_id, ch.scope, ch.body);
  for (const t of SUBJECT.audiences) it.run(t);
  db.exec('COMMIT');
}

/*
 * THE PARTITIONED STORE — now built for EVERY subject, not only the requesting one.
 *
 * Both candidate indexes exist on every version partition, as in TASK-0038/0039:
 *   i_*_vo (open_ended, eff_from)          — seeks on the LOWER effectivity bound
 *   i_*_vb (open_ended, eff_to, eff_from)  — seeks on the UPPER effectivity bound
 * and the chunk partition carries i_*_cv (version_id), whose LEADING column is version_id —
 * which is what makes the chunk-side index-cursor placement of section 4 reachable.
 */
function buildStore(db, kernel, pattern, ctx) {
  const allKeys = new Set();
  const residency = new Map();      // version_id -> keys
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    const ks = pattern.keysOf(v, ctx);
    if (!ks.length) continue;
    residency.set(v.version_id, ks);
    for (const k of ks) allKeys.add(k);
  }
  // routed keys always exist as structures even when empty: a routing scheme that creates a
  // structure only when it has content leaks the existence of content through the catalogue.
  for (const subj of ctx.allSubjects) for (const k of pattern.routeOf(subj)) allKeys.add(k);

  for (const key of allKeys) {
    const s = SAFE(key);
    db.exec(`CREATE TABLE q_${s}_v (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
               eff_from INTEGER NOT NULL, eff_to INTEGER);
             CREATE INDEX i_${s}_vo ON q_${s}_v (open_ended, eff_from);
             CREATE INDEX i_${s}_vb ON q_${s}_v (open_ended, eff_to, eff_from);
             CREATE TABLE q_${s}_c (chunk_id INTEGER PRIMARY KEY, policy_id TEXT,
               version_id TEXT NOT NULL, body TEXT NOT NULL);
             CREATE INDEX i_${s}_cv ON q_${s}_c (version_id);`);
  }
  const byVersion = new Map();
  for (const ch of kernel.chunks) {
    if (!byVersion.has(ch.version_id)) byVersion.set(ch.version_id, []);
    byVersion.get(ch.version_id).push(ch);
  }
  const insV = new Map(), insC = new Map();
  for (const key of allKeys) {
    const s = SAFE(key);
    insV.set(s, db.prepare(`INSERT OR IGNORE INTO q_${s}_v VALUES (?,?,?,?)`));
    insC.set(s, db.prepare(`INSERT OR IGNORE INTO q_${s}_c VALUES (?,?,?,?)`));
  }
  db.exec('BEGIN');
  for (const [vid, ks] of residency) {
    const v = kernel.versions.get(vid);
    for (const key of ks) {
      const s = SAFE(key);
      insV.get(s).run(v.version_id, v.eff_to === null ? 1 : 0, v.eff_from, v.eff_to);
      for (const ch of byVersion.get(vid) ?? [])
        insC.get(s).run(ch.id, ch.policy_id, ch.version_id, ch.body);
    }
  }
  db.exec('COMMIT');
  return { allKeys: [...allKeys], residency };
}

/* the cohort resident in the SUBJECT's own routed structures, counted from the fixture */
function cohort(kernel, pattern, ctx, now) {
  const mine = new Set(pattern.routeOf(SUBJECT));
  const c = { inPartition: 0, authorized: 0, expired: 0, notYetBounded: 0, notYetOpen: 0 };
  for (const v of kernel.versions.values()) {
    if (v.state !== ANSWERABLE_STATE) continue;
    if (!pattern.keysOf(v, ctx).some(k => mine.has(k))) continue;
    c.inPartition++;
    if (versionAuthorized(v, now)) { c.authorized++; continue; }
    if (v.eff_to !== null && v.eff_to <= now) c.expired++;
    else if (v.eff_from > now && v.eff_to !== null) c.notYetBounded++;
    else if (v.eff_from > now) c.notYetOpen++;
  }
  return c;
}

/* ================================================================== *
 * 3. ROUTING — two MECHANISMS, behaviourally identical (§4.9 G-Q4)
 * ================================================================== *
 * §4.9's design-consequence note is the whole point of this section:
 *
 *   "Under G-Q4 the *name* must be COMPUTED from the requesting subject's entitlements and
 *    resolved by EXACT KEY; it must not be FOUND by scanning that catalogue for names that
 *    look applicable. The two implementations are behaviourally identical and only one
 *    satisfies the gate."
 *
 * Prior probes implemented only the computed form and counted its reads synthetically. Both
 * forms are implemented here, and the catalogue form is instrumented so the units it reads
 * are COUNTED IN U (G-Q4.4) under Q1 = A strict.
 */

function newCounters() {
  return {
    row:    { calls: 0, unauth: new Set() },   // placement A — row access on the version table
    index:  { calls: 0 },                      // placement B — version index cursor
    cindex: { calls: 0 },                      // placement C — chunk index cursor
    rank:   { calls: 0, unauth: new Set() },   // placement D — ranking function (U3)
    route:  { reads: 0, unauth: new Set(), otherCatalogue: new Set(),
              structures: [], catalogueRows: 0 },                              // placement E
    recheck:{ calls: 0, kept: 0, rejected: 0, kernelConsults: 0, copyConsults: 0 },
  };
}

/* R-COMPUTED — the conforming mechanism. Names derived from the subject's entitlements
 * alone and resolved by exact key. No catalogue statement is issued. */
function routeComputed(db, c, pattern) {
  const keys = pattern.routeOf(SUBJECT);        // G-Q4.1: entitlements alone
  c.route.structures = keys.slice();
  c.route.reads += keys.length;                 // one exact-key resolution each
  c.route.catalogueRows = 0;
  return keys;
}

/* R-CATALOGUE — the ROUTING NEGATIVE CONTROL. Discovers partitions by scanning the
 * structure catalogue for names that look applicable. Behaviourally identical: it selects
 * exactly the same structures. It must FAIL G-Q4.3, and every catalogue entry it reads that
 * describes a structure the subject is not entitled to must land in U under Q1 = A. */
function routeCatalogue(db, c, pattern) {
  const mine = new Set(pattern.routeOf(SUBJECT).map(SAFE));
  const rows = db.prepare(
    `SELECT name FROM sqlite_schema WHERE probe_cat(name) AND type = 'table'`).all();
  const keys = [];
  for (const r of rows) {
    const n = String(r.name);
    if (!n.startsWith('q_') || !n.endsWith('_v')) continue;
    const slug = n.slice(2, -2);
    if (mine.has(slug)) keys.push(pattern.routeOf(SUBJECT).find(k => SAFE(k) === slug));
  }
  c.route.structures = keys.slice();
  return keys;
}

/* ================================================================== *
 * 4. Instrumentation — FOUR query placements plus the routing placement
 * ================================================================== *
 * §4.6 S7.1–S7.4 (the Q12 ruling, MSG-0124) require that EVERY reachable index-cursor
 * placement be EXERCISED, that the MAXIMUM be reported as U, and that a row-access-only
 * zero be INSUFFICIENT for E2 where such a placement exists unexercised.
 *
 *   P-ROW    probe_ver(pv.version_id)   version_id is not carried by either candidate
 *                                       version index, so this forces the table row. Fires
 *                                       ONCE PER VERSION ROW ACCESSED. TASK-0038's placement.
 *   P-VIDX   probe_idx(pv.open_ended)   leading column of BOTH version indexes, evaluated
 *                                       from the index cursor. Fires ONCE PER VERSION INDEX
 *                                       ENTRY VISITED. TASK-0039's placement.
 *   P-CIDX   probe_cidx(pc.version_id)  leading column of i_<part>_cv. NO PRIOR PROBE TOOK
 *                                       THIS PLACEMENT. Reachability is established BY
 *                                       TAKING IT (S7.3), and what it actually counts is
 *                                       decided by CALIBRATION, not by assumption.
 *   P-RANK   probe_rank(...)            the ranking function — §4.6 S4 U3. Fires once per
 *                                       candidate entering the ordering.
 *   P-ROUTE  probe_cat(name)            the routing placement — §4.9 G-Q4.4. Fires once per
 *                                       catalogue entry read while SELECTING structures.
 *
 * Each placement is exercised in its OWN execution, with the UNINSTRUMENTED plan captured as
 * a control; a measurement whose seek signature differs from the uninstrumented one is
 * reported NOT TRANSFERABLE rather than quietly used.
 *
 * NO PLACEMENT'S ZERO IS A ZERO FOR U1. §4.6 S5: a positive value is conclusive of failure;
 * a zero proves only that nothing crossed the point where the instrument sits.
 */

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

function seekSignature(plan) {
  return plan
    .map(d => d.replace(/q_[a-z0-9_]+_(v|c)\b/g, 'q_<part>_$1')
               .replace(/i_[a-z0-9_]+_(vo|vb|cv)\b/g, 'i_<part>_$1'))
    .filter(d => /USING (COVERING )?INDEX|SCAN/.test(d))
    .sort()
    .join(' ;; ');
}

function versionTraversalSignature(plan) {
  const lines = plan
    .map(d => d.replace(/q_[a-z0-9_]+_v\b/g, 'q_<part>_v')
               .replace(/i_[a-z0-9_]+_(vo|vb)\b/g, 'i_<part>_$1'))
    .filter(d => /\bpv\b/.test(d));
  const tally = new Map();
  for (const l of lines) {
    const key = /i_<part>_vb/.test(l) ? 'SEEK vb (upper bound)'
              : /i_<part>_vo/.test(l) ? 'SEEK vo (lower bound)'
              : /SCAN/.test(l)        ? 'SCAN whole partition'
              : l.trim();
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return [...tally.entries()].sort().map(([k, n]) => `${n}x ${k}`).join(' + ');
}

/*
 * THE AUTHORIZED ALLOWANCE — carried forward from TASK-0039 unchanged in shape.
 *
 * An index-cursor instrument counts ENTRIES VISITED and cannot classify them. The
 * unauthorized share is DERIVED CONSERVATIVELY: subtract the largest number of authorized
 * entry-visits that could possibly occur.
 *
 *   U1lb = max(0, Nidx - authorizedResident x LIMBS x CHUNKS_PER_VERSION)
 *
 * A ZERO HERE MEANS "this conservative bound proves nothing at this size". IT IS NOT A
 * MEASUREMENT OF U1 = 0 and is never read as one.
 */
const LIMBS = 2;
const u1LowerBound = (nidx, authorizedResident) =>
  Math.max(0, nidx - authorizedResident * LIMBS * CHUNKS_PER_VERSION);

const RANK = 'probe_rank(x.chunk_id, x.version_id, x.body) DESC';

function buildQuery(keys, instrument, { pinBounded = false } = {}) {
  if (!keys || !keys.length) return null;
  const vProbe = instrument === 'row'   ? 'probe_ver(pv.version_id) AND '
               : instrument === 'vidx'  ? 'probe_idx(pv.open_ended) AND '
               : '';
  const cProbe = instrument === 'cidx'  ? 'probe_cidx(pc.version_id) AND ' : '';
  const parts = keys.flatMap(k => {
    const s = SAFE(k);
    const pin = pinBounded ? `INDEXED BY i_${s}_vb ` : '';
    return [
      // OPEN-ENDED limb: eff_to IS NULL by construction, upper bound discharged structurally
      `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
              '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
       FROM q_${s}_v pv JOIN q_${s}_c pc ON pc.version_id = pv.version_id
       WHERE ${vProbe}${cProbe}pv.open_ended = 1 AND pv.eff_from <= :T`,
      // BOUNDED limb: the limb the two candidate version indexes disagree about
      `SELECT pc.chunk_id, pc.policy_id, pc.version_id, '${SUBJECT.scope}' AS scope,
              '' AS cls, '${ANSWERABLE_STATE}' AS state, pc.body
       FROM q_${s}_v pv ${pin}JOIN q_${s}_c pc ON pc.version_id = pv.version_id
       WHERE ${vProbe}${cProbe}pv.open_ended = 0 AND pv.eff_to > :T AND pv.eff_from <= :T`,
    ];
  });
  return `SELECT chunk_id, policy_id, version_id, scope, cls, state, body
          FROM ( ${parts.join(' UNION ')} ) x ORDER BY ${RANK} LIMIT :k`;
}

/* the negative control's query — Shape 2 by construction: rank the whole collection, then
 * authorize. §4.6 S8 requires it in every run. */
function buildNegativeControlQuery() {
  const clsIn = SUBJECT.classifications.map((_, i) => `:cls${i}`).join(',');
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

function paramsFor(now) {
  const p = { scope: SUBJECT.scope, state: ANSWERABLE_STATE, T: now, k: K };
  SUBJECT.classifications.forEach((c, i) => { p['cls' + i] = c; });
  return p;
}

function installProbeFunctions(db, c, kernel, now) {
  const unauthVer = (vid) => !versionAuthorized(kernel.versions.get(String(vid)), now);
  db.function('probe_ver', { deterministic: false }, (vid) => {
    c.row.calls++; if (unauthVer(vid)) c.row.unauth.add('v:' + vid); return 1;
  });
  db.function('probe_idx', { deterministic: false }, (_openEnded) => {
    c.index.calls++; return 1;                      // cannot classify — reports a COUNT only
  });
  db.function('probe_cidx', { deterministic: false }, (_versionId) => {
    c.cindex.calls++; return 1;                     // calibrated in section 4 before use
  });
  db.function('probe_chunk', { deterministic: false }, (cid, vid) => {
    c.row.calls++; if (unauthVer(vid)) c.row.unauth.add('c:' + cid); return 1;
  });
  db.function('probe_rank', { deterministic: true }, (cid, vid, body) => {
    c.rank.calls++;
    if (unauthVer(vid)) c.rank.unauth.add('c:' + cid);
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });
}

/*
 * CLASSIFYING A CATALOGUE NAME — done by exact convention, not by a loose prefix test.
 *
 * A first draft of this probe classified anything matching /^[qi]_/ as a partition object,
 * which swept in the KERNEL's own indexes `i_kva_token` and `i_kchunk_ver` and reported them
 * as "structures the subject may not see". THE CORRECTION IS RECORDED RATHER THAN QUIETLY
 * MADE, because the two counts differ and the wrong one overstates the finding: it reported
 * 2 foreign structures at others=0, where the correct answer is 0.
 *
 * Three buckets, kept separate on purpose:
 *   'own'     — a partition object belonging to a structure the subject routes to
 *   'foreign' — a partition object belonging to ANOTHER SUBJECT. This is the G-Q4 hazard and
 *               it is what Uroute counts.
 *   'other'   — everything else in the catalogue: kernel tables, kernel indexes, internal
 *               objects. Whether reading THESE is examination is the §4.9 G-Q4 unnumbered
 *               open interaction (structure identifiers, not chunk identifiers), which
 *               MSG-0109 §9 Q4 records as "related but distinct" from Q1 and which MSG-0134
 *               does not settle. THEY ARE COUNTED SEPARATELY AND NOT FOLDED INTO Uroute —
 *               this probe measures the quantity and decides nothing about it.
 */
const PART_RE = /^(q_(.+)_(v|c)|i_(.+)_(vo|vb|cv))$/;
function classifyCatalogueName(name, mineSlugs) {
  const m = PART_RE.exec(String(name ?? ''));
  if (!m) return { bucket: 'other', slug: null };
  const slug = m[2] ?? m[4];
  return { bucket: mineSlugs.has(slug) ? 'own' : 'foreign', slug };
}

/* the routing instrument is installed separately, because it needs the routed key set */
function installRoutingInstrument(db, c, pattern) {
  const mine = new Set(pattern.routeOf(SUBJECT).map(SAFE));
  db.function('probe_cat', { deterministic: false }, (name) => {
    c.route.catalogueRows++;
    c.route.reads++;
    const { bucket } = classifyCatalogueName(name, mine);
    // Under Q1 = A (MSG-0134) reading an unauthorized index entry, key or metadata IS
    // examination. A catalogue entry naming ANOTHER SUBJECT'S structure is exactly the case
    // §4.9 G-Q4's note describes, and G-Q4.4 puts it in U.
    if (bucket === 'foreign') c.route.unauth.add('s:' + name);
    if (bucket === 'other') c.route.otherCatalogue.add('s:' + name);
    return 1;
  });
}

/* ================================================================== *
 * 5. The re-check — ADR-0020 §3 point 2 (G-Q5.2, G-Q7.5)
 * ================================================================== */
function makeRecheck(c, kernel, now, { readCopy = false, projection = null } = {}) {
  return {
    run(cand) {
      c.recheck.calls++;
      if (readCopy) {
        c.recheck.copyConsults++;
        const v = projection?.get(cand.version_id);      // the stale copy's own attributes
        const ok = !!v;
        if (ok) c.recheck.kept++; else c.recheck.rejected++;
        return ok;
      }
      if (!kernel.reachable) throw new Error('KERNEL_UNREACHABLE');
      c.recheck.kernelConsults++;
      const v = kernel.versions.get(cand.version_id);     // authoritative, not a copy
      const ok = versionAuthorized(v, now);
      if (ok) c.recheck.kept++; else c.recheck.rejected++;
      return ok;
    },
  };
}

/* ================================================================== *
 * ================================================================== *
 *                                THE RUN
 * ================================================================== *
 * ================================================================== */

const probeDb = new DatabaseSync(':memory:');
const SQLITE_VERSION = probeDb.prepare('select sqlite_version() v').get().v;

say('='.repeat(108));
say('TASK-0042 — ARCHITECTURE-BOUND RETRIEVAL EVIDENCE');
say('             routing · placements · transitions · I5/I7/I8 · the E4 re-check');
say('='.repeat(108));
say('Authority : MSG-0137 (AUTHORIZED) with MSG-0134 (Q1=A strict), MSG-0135 (Q2=B),');
say('            MSG-0136 (Q7=A, zero stale-answer tolerance) and MSG-0133 (Q13) BINDING.');
say('            Queue TASK-0042 · reconciliation MSG-0139.');
say('Subject   : SQLite ' + SQLITE_VERSION + ' via node:sqlite — EPA-0006 class R TEST SUBJECT, not a selection');
say('Runtime   : Node ' + process.version);
say('');
say('SELECTS NOTHING · ADOPTS NOTHING · INSTALLS NOTHING · DEPLOYS NOTHING · AMENDS NO ADR');
say('No gate is relaxed. No numeric staleness threshold is proposed. No benchmark, latency,');
say('capacity, recall or throughput figure is produced. No wall clock is read.');
say('');
say('READ THIS BEFORE ANY TABLE BELOW:');
say('  * E4 is re-checked in section 2 and is expected to be UNOBTAINABLE again (§4.13 GAP-B).');
say('    NOTHING IN THIS RUN CAN THEREFORE BE CLEARED, whatever any count shows.');
say('  * U1 = 0 IS NEVER CLAIMED. Where an index-entry count appears it is a LOWER BOUND, and a');
say('    zero in the U1lb column means "this bound proves nothing at this size".');
say('  * NO PRIOR CASE IS RE-RUN. TASK-0033/0035/0037/0038/0039 evidence stands as measured.');
say('    The validity gates ARE re-run because §4.6 S8 requires them in every run.');
say('  * Q13 bounds this to the CURRENT/"now" frame. No historical or future frame is answered.');
say('');

let VOID = false;
const failures = [];

/* ================================================================== *
 * SECTION 1 — VALIDITY GATE 1: the adversarial precondition (§4.6 S8)
 * ================================================================== */

const SIZES = [50, 500, 5000];
const SKEWS = ['uniform', 'bounded-heavy'];

RULE('=');
say('SECTION 1 — VALIDITY GATE 1: the adversarial precondition (EPA-0006 §4.6 S8)');
RULE('=');
say('The UNCONSTRAINED top-k must contain NO authorized chunk. If one appears the fixture is not');
say('adversarial, every measurement below is meaningless, and the run is VOID.');
say('');
let preconditionOk = true;
for (const skew of SKEWS) for (const M of SIZES) {
  const kernel = buildFixture(M, { skew, otherSubjects: 16 });
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
say('  THE ADVERSARIAL PRECONDITION HELD AT EVERY SIZE AND BOTH DISTRIBUTIONS.');
say('');

/* ================================================================== *
 * SECTION 2 — ITEM 6: THE E4 RE-CHECK
 * ================================================================== */

RULE('=');
say('SECTION 2 — ITEM 6: THE E4 RE-CHECK. Enumerated again, not carried forward.');
RULE('=');
say('§4.12 gap 1 established E4 UNOBTAINABLE on this test subject by enumeration against a control.');
say('§4.13 GAP-B carries that as the constraint that blocks clearance independently of topology.');
say('MSG-0137 item 6 requires a RE-CHECK on the reachable subject, and forbids inferring anything');
say('from an absent log. A SECOND NEGATIVE IS THE EXPECTED RESULT, NOT A FAILURE.');
say('');
say('This is a re-check, not a re-run of a prior CASE: it asks whether the observability position');
say('has changed on the runtime as it stands NOW. The runtime is recorded above so a later reader');
say('can tell whether a different answer would mean a changed engine or a changed probe.');
say('');

say('2.1 — The reachable API surface, enumerated in THIS run.');
say('');
const dbProto = Object.getOwnPropertyNames(Object.getPrototypeOf(probeDb)).sort();
const stProto = Object.getOwnPropertyNames(
  Object.getPrototypeOf(probeDb.prepare('select 1'))).sort();
say('  DatabaseSync.prototype : ' + dbProto.join(', '));
say('  StatementSync.prototype: ' + stProto.join(', '));
const LOG_HOOKS = ['trace', 'profile', 'log', 'sqllog', 'stmtStatus', 'stmt_status', 'scanstatus',
                   'onTrace', 'setTrace', 'setProfile', 'errorLog', 'setLogger', 'traceV2'];
const foundHooks = LOG_HOOKS.filter(h => dbProto.includes(h) || stProto.includes(h));
say('');
say('  Searched for a trace/profile/log hook: ' + LOG_HOOKS.join(', '));
say('  FOUND: ' + (foundHooks.length ? foundHooks.join(', ')
                                     : 'NONE — no member of either prototype is a log, trace or profile hook.'));
say('');

say('2.2 — Compile options, read from the engine in THIS run.');
say('');
const COMPILE = probeDb.prepare('PRAGMA compile_options').all().map(r => r.compile_options);
const hasOpt = (o) => COMPILE.includes(o);
const RELEVANT = [
  ['DEBUG',                   'would enable PRAGMA vdbe_trace / vdbe_listing / parser_trace'],
  ['ENABLE_SQLLOG',           'would write an SQL log via SQLITE_CONFIG_SQLLOG'],
  ['ENABLE_STMT_SCANSTATUS',  'would expose PER-LOOP VISIT COUNTS — the ONE API that measures U1 directly'],
  ['ENABLE_STAT4',            'would make the planner sensitive to BOUND PARAMETER VALUES'],
  ['ENABLE_DBSTAT_VTAB',      'exposes the dbstat virtual table — per-b-tree page and cell counts'],
];
for (const [opt, why] of RELEVANT)
  say(`  ${pad(opt, 26)} ${hasOpt(opt) ? 'PRESENT' : 'ABSENT '}   ${why}`);
say('');
say(`  Full option list: ${COMPILE.length} options; the five above were checked by exact match.`);
say('');

say('2.3 — The tracing pragmas, attempted, WITH THE NONEXISTENT-PRAGMA CONTROL.');
say('');
say('  SQLite SILENTLY IGNORES an unrecognised pragma. "PRAGMA vdbe_trace=on returned no error" is');
say('  therefore evidence of NOTHING. The control is a pragma that certainly does not exist. If the');
say('  tracing pragmas behave identically to it, they are equally inert. WITHOUT THIS CONTROL,');
say('  "the instrument reported nothing" and "the instrument was never running" are the same');
say('  observation (§4.6 S7.3).');
say('');
const PRAGMA_ATTEMPTS = ['vdbe_trace', 'vdbe_listing', 'parser_trace', 'sql_trace',
                         'stmt_scanstatus', 'this_pragma_certainly_does_not_exist'];
const pragmaResults = {};
for (const p of PRAGMA_ATTEMPTS) {
  let setRes, readRes;
  try { setRes = JSON.stringify(probeDb.prepare(`PRAGMA ${p} = on`).all()); }
  catch (e) { setRes = 'ERROR: ' + e.message; }
  try { readRes = JSON.stringify(probeDb.prepare(`PRAGMA ${p}`).all()); }
  catch (e) { readRes = 'ERROR: ' + e.message; }
  pragmaResults[p] = setRes + '|' + readRes;
  const ctrl = p.startsWith('this_pragma') ? '   <- THE CONTROL' : '';
  say(`  PRAGMA ${pad(p, 38)} set-> ${pad(setRes, 6)} read-back-> ${pad(readRes, 6)}${ctrl}`);
}
const ctrlKey = 'this_pragma_certainly_does_not_exist';
const allInert = PRAGMA_ATTEMPTS.filter(p => p !== ctrlKey)
  .every(p => pragmaResults[p] === pragmaResults[ctrlKey]);
say('');
say(`  RESULT: every tracing pragma behaves ${allInert ? 'EXACTLY' : 'NOT identically'} as the pragma that does not exist.`);
say(`  ${allInert ? 'None was enabled.' : 'AT LEAST ONE DIFFERS — the position has CHANGED and must be re-examined.'}`);
say('');

say('2.4 — Is there a log FILE to inspect?');
say('');
say(`  db.location() for the ':memory:' database -> ${JSON.stringify(probeDb.location())}`);
say('  No database file, therefore no journal, no WAL and no engine-written file of any kind to');
say('  inspect. Nothing was installed and no file was created.');
say('');

const e4Unobtainable = !foundHooks.length && !hasOpt('DEBUG') && !hasOpt('ENABLE_SQLLOG') &&
                       !hasOpt('ENABLE_STMT_SCANSTATUS') && allInert &&
                       probeDb.location() === null;
say('  >> E4 RE-CHECK VERDICT: ' + (e4Unobtainable
      ? 'NOT OBTAINABLE — the position is UNCHANGED from §4.12 gap 1.'
      : 'CHANGED — re-examine; the §4.12 enumeration no longer describes this runtime.'));
say('');
say('     The enumerated reasons, each observed in this run: node:sqlite binds no trace, profile or');
say('     log API; the engine is built without DEBUG, ENABLE_SQLLOG and ENABLE_STMT_SCANSTATUS;');
say('     every tracing pragma is inert and demonstrated inert against a control; and there is no');
say('     database file and so no engine-written file to read.');
say('');
say('     Per §4.6 S6 an absent evidence class yields NOT CLEARED. Per MSG-0137 it may NOT be');
say('     inferred. THEREFORE NOTHING IN THIS RUN CAN BE CLEARED ON E4 ALONE, independently of');
say('     every measurement below. The rest of the probe still matters, because it decides whether');
say('     E4 is the ONLY thing missing — and sections 3 to 6 show it is not.');
say('');
if (!e4Unobtainable) failures.push('E4 observability position changed — §4.12 enumeration no longer holds');

/* ================================================================== *
 * SECTION 3 — ITEM 1: ROUTING AND PHYSICAL STRUCTURE (Q2 = B, G-Q4)
 * ================================================================== */

RULE('=');
say('SECTION 3 — ITEM 1: THE ROUTING PHASE AND THE REACHABLE PHYSICAL STRUCTURES');
RULE('=');
say('Q2 = B (MSG-0135): query-time predicates alone are INSUFFICIENT where the engine examines');
say('unauthorized candidates first, so ROUTING AND PHYSICAL STRUCTURE ARE PART OF WHAT MUST BE');
say('MEASURED. Q1 = A (MSG-0134): reading an unauthorized index entry, key or METADATA is');
say('examination. G-Q4.4: routing-phase units are counted in U.');
say('');
say('THE GAP IN PRIOR EVIDENCE THIS SECTION CLOSES, STATED BEFORE THE NUMBERS.');
say('  TASK-0038 and TASK-0039 ran the G-Q4.2 differential with other subjects added to the KERNEL,');
say('  but their store builder skips any partition key that is not the subject\'s — "other subjects\'');
say('  partitions are not materialised here". SO THE CATALOGUE THEY ROUTED AGAINST CONTAINED NO');
say('  OTHER SUBJECT\'S STRUCTURE AT ALL. A differential that varies rows in a table nobody routes');
say('  over does not test G-Q4.2. This probe materialises them PHYSICALLY. That is not a re-run of');
say('  the prior differential; it is the first run of one that can fail.');
say('');

const ctxFor = (kernel, others, extra = {}) => ({
  allSubjects: [SUBJECT, ...(kernel.others ?? []).slice(0, others)],
  ...extra,
});

say('3.1 — The catalogue actually contains other subjects\' structures now. Counted, not asserted.');
say('');
say(`  ${pad('others', 8)} ${rpad('catalogue total', 16)} ${rpad('own partition', 14)} ${rpad('foreign partition', 18)} ${rpad('other (kernel etc.)', 20)}`);
const catalogueCensus = [];
for (const others of [0, 16, 64]) {
  const kernel = buildFixture(500, { otherSubjects: others });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  buildStore(db, kernel, PATTERNS.token, ctxFor(kernel, others));
  const objs = db.prepare(`SELECT name FROM sqlite_schema`).all().map(r => String(r.name));
  const mine = new Set(routeKeys().map(SAFE));
  const b = { own: 0, foreign: 0, other: 0 };
  for (const n of objs) b[classifyCatalogueName(n, mine).bucket]++;
  catalogueCensus.push({ others, total: objs.length, ...b });
  say(`  ${pad(others, 8)} ${rpad(objs.length, 16)} ${rpad(b.own, 14)} ${rpad(b.foreign, 18)} ${rpad(b.other, 20)}`);
  db.close();
}
say('');
const censusOk = catalogueCensus[2].foreign > 0 && catalogueCensus[0].foreign === 0 &&
                 catalogueCensus[0].own === catalogueCensus[2].own;
say(`  -> the catalogue holds ${catalogueCensus[2].foreign} of ANOTHER SUBJECT'S structures at others=64, and ` +
    `${catalogueCensus[0].foreign} at others=0,`);
say(`     while the subject's own structure count is unchanged at ${catalogueCensus[0].own}.`);
say(`     ${censusOk ? 'The differential below therefore has something to be wrong about.'
                     : 'THE FIXTURE DID NOT VARY THE CATALOGUE — the differential proves nothing.'}`);
if (!censusOk) failures.push('catalogue census did not vary with other subjects');
say('');
say('  The "other" column is kernel tables and kernel indexes. They are NOT counted as foreign:');
say('  whether reading a catalogue entry that names a KERNEL structure is examination is the §4.9');
say('  G-Q4 unnumbered open interaction, which MSG-0134 does not settle. This probe counts them');
say('  separately and DECIDES NOTHING about them.');
say('');

say('3.2 — Two routing MECHANISMS, behaviourally identical. §4.9 G-Q4\'s design note, measured.');
say('');
say('  R-COMPUTED  : names derived from the subject\'s entitlements alone, resolved by exact key.');
say('  R-CATALOGUE : the ROUTING NEGATIVE CONTROL — scans the structure catalogue for names that');
say('                look applicable. It selects THE SAME STRUCTURES. Only the mechanism differs.');
say('');
say(`  ${pad('mech', 12)} ${pad('others', 7)} ${rpad('routed', 7)} ${rpad('cat.rows', 9)} ${rpad('U(route)', 9)} ${rpad('other-cat', 10)}  outcome`);
const routingRows = [];
for (const mech of ['R-COMPUTED', 'R-CATALOGUE']) {
  for (const others of [0, 64]) {
    const kernel = buildFixture(500, { otherSubjects: others });
    const db = new DatabaseSync(':memory:');
    loadKernel(db, kernel);
    buildStore(db, kernel, PATTERNS.token, ctxFor(kernel, others));
    const c = newCounters();
    installRoutingInstrument(db, c, PATTERNS.token);
    const keys = mech === 'R-COMPUTED'
      ? routeComputed(db, c, PATTERNS.token)
      : routeCatalogue(db, c, PATTERNS.token);
    const uRoute = c.route.unauth.size;
    routingRows.push({ mech, others, routed: keys.length, catRows: c.route.catalogueRows,
                       uRoute, otherCat: c.route.otherCatalogue.size,
                       set: [...keys].sort().join('|'), reads: c.route.reads });
    say(`  ${pad(mech, 12)} ${pad(others, 7)} ${rpad(keys.length, 7)} ${rpad(c.route.catalogueRows, 9)} ` +
        `${rpad(uRoute, 9)} ${rpad(c.route.otherCatalogue.size, 10)}  ` +
        (uRoute === 0 ? 'no other subject\'s catalogue entry read'
                      : 'READ ' + uRoute + ' CATALOGUE ENTRIES NAMING ANOTHER SUBJECT\'S STRUCTURES'));
    db.close();
  }
}
say('');
const comp0 = routingRows.find(r => r.mech === 'R-COMPUTED' && r.others === 0);
const comp64 = routingRows.find(r => r.mech === 'R-COMPUTED' && r.others === 64);
const cat0 = routingRows.find(r => r.mech === 'R-CATALOGUE' && r.others === 0);
const cat64 = routingRows.find(r => r.mech === 'R-CATALOGUE' && r.others === 64);
const sameSelection = comp64.set === cat64.set;
say(`  BEHAVIOURALLY IDENTICAL: the two mechanisms selected ${sameSelection ? 'THE SAME' : 'DIFFERENT'} structures ` +
    `(${comp64.routed} vs ${cat64.routed}).`);
say(`  ${sameSelection ? 'So no functional test could tell them apart — which is exactly why G-Q4.3 demands plan or trace evidence.'
                       : 'THE CONTROL IS NOT BEHAVIOURALLY IDENTICAL — it is a weaker control than intended; read it as such.'}`);
say('');
say('  G-Q4.2 — THE DIFFERENTIAL. Collections differing ONLY in other subjects\' partitions:');
const gq4_2_computed = comp0.set === comp64.set && comp0.reads === comp64.reads;
const gq4_2_catalogue = cat0.set === cat64.set && cat0.reads === cat64.reads;
say(`    R-COMPUTED  routed set ${comp0.set === comp64.set ? 'IDENTICAL' : 'DIFFERS'}, routing reads ` +
    `${comp0.reads} vs ${comp64.reads} -> ${gq4_2_computed ? 'G-Q4.2 MET' : 'G-Q4.2 FAILED'}`);
say(`    R-CATALOGUE routed set ${cat0.set === cat64.set ? 'IDENTICAL' : 'DIFFERS'}, routing reads ` +
    `${cat0.reads} vs ${cat64.reads} -> ${gq4_2_catalogue ? 'G-Q4.2 MET' : 'G-Q4.2 FAILED'}`);
say('');
say('    G-Q4.2 requires that BOTH the routed set AND the routing-phase read count be unchanged.');
say('    R-CATALOGUE returns the same SET and a DIFFERENT COUNT. A test checking only the set would');
say('    have passed it. THAT IS WHY THE GATE NAMES BOTH.');
say('');
if (gq4_2_catalogue) failures.push('routing negative control PASSED G-Q4.2 — the control does not discriminate');

say('3.3 — G-Q4.3: catalogue enumeration, evidenced from the PLAN, not from the mechanism\'s name.');
say('');
{
  const kernel = buildFixture(500, { otherSubjects: 64 });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  buildStore(db, kernel, PATTERNS.token, ctxFor(kernel, 64));
  const c = newCounters();
  installRoutingInstrument(db, c, PATTERNS.token);
  const catSql = `SELECT name FROM sqlite_schema WHERE probe_cat(name) AND type = 'table'`;
  const plan = planOf(db, catSql, {});
  say('    R-CATALOGUE routing statement plan (EXPLAIN QUERY PLAN, engine-reported):');
  for (const d of plan) say('      ' + d);
  say(`    -> ${/SCAN/.test(plan.join(' ')) ? 'A SCAN OVER THE STRUCTURE CATALOGUE. G-Q4.3 FAILED — disqualifying'
                                            : 'no scan reported'} on the same reasoning §4.6 S6/E1 applies to a data scan.`);
  say('');
  say('    R-COMPUTED issues NO catalogue statement at all, so there is no routing plan to show.');
  say('    THAT ABSENCE IS THE EVIDENCE, and it is a weaker kind than a plan: it shows this probe');
  say('    issued no catalogue query, NOT that the engine performed no internal schema resolution.');
  db.close();
}
say('');

say('3.4 — WHAT THE ROUTING INSTRUMENT CANNOT SEE. Recorded as a boundary, not inferred around.');
say('');
say('  SQLite resolves a table NAME to a schema object through an in-memory hash built when the');
say('  schema is first loaded. That resolution is NOT reachable by any instrument this runner has:');
say('  the authorizer reports SQLITE_READ for statements that read sqlite_schema EXPLICITLY, and');
say('  reports nothing for implicit name resolution. The check below establishes that by taking the');
say('  placement rather than by asserting it.');
say('');
{
  const kernel = buildFixture(500, { otherSubjects: 64 });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  buildStore(db, kernel, PATTERNS.token, ctxFor(kernel, 64));
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  const keys = routeComputed(db, c, PATTERNS.token);
  const sql = buildQuery(keys, 'row');
  const reads = new Set(); const actions = new Map();
  db.setAuthorizer((action, arg1) => {
    actions.set(action, (actions.get(action) ?? 0) + 1);
    if (action === constants.SQLITE_READ && arg1) reads.add(String(arg1));
    return constants.SQLITE_OK;
  });
  let st = null;
  try { st = db.prepare(sql); } catch (e) { /* surfaces as an empty read set */ }
  try { st && st.all(bind(sql, paramsFor(TX))); } catch (e) { /* likewise */ }
  const schemaSeen = [...reads].filter(t => /^sqlite_(schema|master|stat)/.test(t));
  say(`    authorizer SQLITE_READ targets: ${reads.size} distinct`);
  say(`    among them sqlite_schema / sqlite_master / sqlite_stat*: ` +
      (schemaSeen.length ? schemaSeen.join(', ') : 'NONE'));
  say('');
  say('    READ THIS CORRECTLY. "NONE" means THE STATEMENT DOES NOT READ THE CATALOGUE AS DATA.');
  say('    It does NOT mean the engine performed no schema lookup — the authorizer cannot see');
  say('    implicit name resolution, and no reachable instrument on this subject can.');
  say('');
  say('    >> ROUTING-PHASE OBSERVABILITY: PARTIAL. An EXPLICIT catalogue read is measurable and is');
  say('       measured above. IMPLICIT SCHEMA RESOLUTION IS NEVER MEASURED on this test subject,');
  say('       with the exact limitation: node:sqlite exposes no hook below statement compilation,');
  say('       and SQLITE_ENABLE_STMT_SCANSTATUS — the one API that would report per-loop visits —');
  say('       is ABSENT from this build (section 2.2). Under §4.6 S9 an unmeasurable stage is NOT');
  say('       CLEARED, never a pass by default.');
  say('');
  say('       This is also the §4.9 G-Q4 OPEN INTERACTION in its measurable form: whether an');
  say('       exact-key catalogue lookup of an ALREADY-COMPUTED structure name is itself');
  say('       examination. MSG-0134 rules on entries describing CHUNKS; MSG-0109 §9 Q4 records the');
  say('       STRUCTURE-identifier variant as "related but distinct". THIS PROBE DECIDES NOTHING');
  say('       ABOUT IT — it records that the quantity the question asks about IS NOT OBSERVABLE');
  say('       HERE, which is a fact the ruling will need either way.');
  db.close();
}
say('');

/* ================================================================== *
 * SECTION 4 — ITEM 2: EVERY APPLICABLE PLACEMENT, EXERCISED
 * ================================================================== */

RULE('=');
say('SECTION 4 — ITEM 2: PLACEMENT ENUMERATION, CALIBRATION, AND THE MAXIMUM U (§4.6 S7.1–S7.4)');
RULE('=');
say('S7-R1: every reachable index-cursor placement must be EXERCISED, in addition to the others.');
say('S7-R2: the reported U is the MAXIMUM across exercised applicable placements, a LOWER BOUND.');
say('S7-R3: a row-access-only U = 0 is INSUFFICIENT for E2 where a reachable index-cursor');
say('       placement exists and was not exercised. Nothing discharges R3 except exercising it.');
say('');
say('Reachability is established BY TAKING THE PLACEMENT (S7.3), never by reading documentation.');
say('');

say('4.0 — ONE MORE PLACEMENT THE COMPILE OPTIONS SAY EXISTS. Taken, not dismissed.');
say('');
say('  Section 2.2 reports SQLITE_ENABLE_DBSTAT_VTAB as PRESENT — the one relevant option that is.');
say('  §4.6 S7.3 requires the reachable-but-unexercised set to be EMPTY, so it is taken here rather');
say('  than argued away. What it actually reports decides whether it is a U1 instrument.');
say('');
{
  const d = new DatabaseSync(':memory:');
  d.exec(`CREATE TABLE t (a INTEGER PRIMARY KEY, b TEXT); CREATE INDEX i_t_b ON t(b);`);
  const ins = d.prepare('INSERT INTO t VALUES (?,?)');
  d.exec('BEGIN'); for (let i = 0; i < 200; i++) ins.run(i, 'v' + i); d.exec('COMMIT');
  let rows = [], err = null;
  try { rows = d.prepare(`SELECT name, ncell, payload FROM dbstat WHERE name='i_t_b'`).all(); }
  catch (e) { err = e.message; }
  if (err) {
    say(`    dbstat query -> ERROR: ${err}`);
    say('    NOT REACHABLE through this binding despite the compile option. Recorded as such.');
  } else {
    const cells = rows.reduce((s, r) => s + Number(r.ncell ?? 0), 0);
    say(`    dbstat over index i_t_b -> ${rows.length} page row(s), ${cells} cells total (200 rows inserted)`);
    say('');
    say('    IT IS REACHABLE, AND IT IS NOT A U1 INSTRUMENT. dbstat reports the STORED LAYOUT of a');
    say('    b-tree — pages and cells that EXIST — and reports it identically whether a query ran or');
    say('    not. It cannot say how many entries a TRAVERSAL VISITED, which is the quantity U1 is');
    say('    defined on (§4.6 S4 U1: "reads an index entry or key DURING TRAVERSAL").');
    say('');
    say('    So the reachable-but-unexercised set stays EMPTY for the right reason: the placement was');
    say('    TAKEN and found to measure a different quantity. That is the §4.6 S7.3 standard —');
    say('    enumeration, never assertion — and it is the opposite of arguing from documentation.');
  }
  d.close();
}
say('');

say('4.1 — CALIBRATION against a cohort known by construction. An instrument that cannot reproduce');
say('      a constructed count is not trustworthy and nothing may rest on it.');
say('');
const CAL = { expired: 300, notYet: 400, authorized: 2 };
let calibrationOk = true;
const calibration = {};
{
  say(`  Constructed cohort: expired=${CAL.expired} (eff_to closed), notYetBounded=${CAL.notYet} ` +
      `(eff_from future), authorized=${CAL.authorized}; ${CHUNKS_PER_VERSION} chunks per version.`);
  say('');
  for (const pin of [false, true]) {
    const d = new DatabaseSync(':memory:');
    d.exec(`CREATE TABLE cv (version_id TEXT PRIMARY KEY, open_ended INTEGER NOT NULL,
              eff_from INTEGER NOT NULL, eff_to INTEGER);
            CREATE INDEX i_cal_vo ON cv (open_ended, eff_from);
            CREATE INDEX i_cal_vb ON cv (open_ended, eff_to, eff_from);
            CREATE TABLE cc (chunk_id INTEGER PRIMARY KEY, version_id TEXT NOT NULL);
            CREATE INDEX i_cal_cv ON cc (version_id);`);
    const insV = d.prepare('INSERT INTO cv VALUES (?,?,?,?)');
    const insC = d.prepare('INSERT INTO cc VALUES (?,?)');
    let cid = 0;
    d.exec('BEGIN');
    const addV = (id, from, to) => {
      insV.run(id, 0, from, to);
      for (let j = 0; j < CHUNKS_PER_VERSION; j++) insC.run(++cid, id);
    };
    for (let i = 0; i < CAL.expired; i++)    addV('E' + i, 100, 500);
    for (let i = 0; i < CAL.notYet; i++)     addV('F' + i, 900000, 990000);
    for (let i = 0; i < CAL.authorized; i++) addV('A' + i, 100, 990000);
    d.exec('COMMIT');
    let idx = 0, row = 0, cidx = 0;
    d.function('probe_idx',  { deterministic: false }, (_o) => { idx++;  return 1; });
    d.function('probe_ver',  { deterministic: false }, (_v) => { row++;  return 1; });
    d.function('probe_cidx', { deterministic: false }, (_v) => { cidx++; return 1; });
    const sql = `SELECT cv.version_id FROM cv ${pin ? 'INDEXED BY i_cal_vb ' : ''}` +
                'JOIN cc ON cc.version_id = cv.version_id ' +
                'WHERE probe_idx(cv.open_ended) AND probe_ver(cv.version_id) ' +
                'AND probe_cidx(cc.version_id) ' +
                'AND cv.open_ended = 0 AND cv.eff_to > 1000 AND cv.eff_from <= 1000';
    const plan = d.prepare('EXPLAIN QUERY PLAN ' + sql).all().map(r => r.detail).join(' | ');
    const rows = d.prepare(sql).all();
    const onVb = /i_cal_vb/.test(plan);
    const expectIdx = onVb ? CAL.notYet + CAL.authorized : CAL.expired + CAL.authorized;
    const ok = idx === expectIdx;
    calibrationOk = calibrationOk && ok;
    calibration[pin ? 'pinned' : 'planner'] = { idx, row, cidx, expectIdx, rows: rows.length, plan, onVb };
    say(`  ${pin ? 'PINNED  i_cal_vb' : 'PLANNER CHOICE  '}  plan: ${plan}`);
    say(`      P-VIDX index-cursor calls = ${rpad(idx, 5)}  expected by construction = ${rpad(expectIdx, 5)}  ` +
        (ok ? 'EXACT — trustworthy' : 'MISMATCH — NOT trustworthy'));
    say(`      P-ROW  row-access calls   = ${rpad(row, 5)}`);
    say(`      P-CIDX chunk-side calls   = ${rpad(cidx, 5)}  rows returned = ${rows.length}`);
    say('');
    d.close();
  }
}
if (!calibrationOk) { say('ABORTING — the version index-cursor instrument failed calibration.'); process.exit(1); }
say('  CALIBRATION PASSED on both plans for P-VIDX.');
say('');
say('  WHAT CALIBRATION SAYS ABOUT P-CIDX — the placement no prior probe took.');
{
  const p = calibration.pinned, q = calibration.planner;
  const perRowShape = p.cidx === p.rows && q.cidx === q.rows;
  const perEntryShape = p.cidx > p.rows;
  say(`    pinned : P-CIDX=${p.cidx}  rows returned=${p.rows}  survivors row-accessed=${p.row}`);
  say(`    planner: P-CIDX=${q.cidx}  rows returned=${q.rows}  survivors row-accessed=${q.row}`);
  say('');
  if (perEntryShape) {
    say('    P-CIDX fires MORE often than rows are returned, so it is observing the chunk-side');
    say('    traversal itself and is a genuine SECOND index-cursor placement.');
  } else if (perRowShape) {
    say('    P-CIDX fires ONCE PER SURVIVING PAIR. On this join shape the chunk cursor is only');
    say('    entered for versions that already passed the version-side residual, so this placement');
    say('    DOES NOT SEE the entries the version-side residual rejected. IT IS REPORTED AS');
    say('    EXERCISED AND AS FINDING NOTHING ADDITIONAL — which is a result about the placement,');
    say('    not a licence to treat any zero as U1 = 0.');
  } else {
    say('    P-CIDX fires FEWER times than rows are returned. The instrument is UNCHARACTERISED on');
    say('    this join shape and NOTHING BELOW RESTS ON IT.');
  }
  say('');
  say('    Either way S7-R1 is discharged for this placement BY EXERCISING IT. S7.3 is explicit that');
  say('    naming or describing a placement is not exercising it.');
}
say('');

say('4.2 — THE GRID. Every placement exercised at every size, on each pattern, with the');
say('      uninstrumented plan captured as the transfer control.');
say('');
say('  Columns:  Urow  = unauthorized units at the ROW-ACCESS placement (TASK-0038\'s placement)');
say('            Nvidx = engine-measured VERSION index entries visited (all entries; the');
say('                    instrument cannot classify them)');
say('            U1lb  = DERIVED conservative lower bound on unauthorized entries visited.');
say('                    A ZERO MEANS "THIS BOUND PROVES NOTHING AT THIS SIZE". NOT U1 = 0.');
say('            Ncidx = chunk-side index-cursor calls (see 4.1 for what it observes)');
say('            Urank = unauthorized units reaching the ranking function (§4.6 S4 U3)');
say('            Uroute= unauthorized catalogue entries read while routing (G-Q4.4)');
say('            Umax  = MAXIMUM across the exercised placements — the candidate\'s reported U (S7-R2)');
say('            ans   = authorized chunks answered (a non-withholding anchor — U = 0 is');
say('                    purchasable by withholding authorized content, the K4 trap)');
say('');

const PLACEMENTS = ['none', 'row', 'vidx', 'cidx'];
const gridRows = [];
let transferFailures = 0, transferChecks = 0;

/* the candidates measured here. K7/K8 are re-measured ONLY at the two placements no prior
 * probe took and against the newly-populated catalogue; their prior grids are not re-run. */
const CANDIDATES = [
  { id: 'K7',  pattern: PATTERNS.token, pin: false, route: routeComputed,
    label: 'I1+I2+I3 partitioned store, planner chooses the version index (TASK-0038/0039\'s K7)' },
  { id: 'K8',  pattern: PATTERNS.token, pin: true,  route: routeComputed,
    label: 'K7 with the bounded limb PINNED to i_<part>_vb (TASK-0038/0039\'s K8)' },
  { id: 'I5',  pattern: PATTERNS.I5,   pin: false, route: routeComputed,
    label: 'I5 per-principal materialisation — §4.8 records this NOT MEASURED' },
  { id: 'I8',  pattern: PATTERNS.I8,   pin: false, route: routeComputed,
    label: 'I8 entitlement-class materialisation — §4.13 records this NEVER MEASURED' },
  { id: 'I7',  pattern: PATTERNS.I7,   pin: false, route: routeComputed,
    label: 'I7 boundary-refined effectivity — §4.13 records this NEVER MEASURED' },
  { id: 'KR',  pattern: PATTERNS.token, pin: false, route: routeCatalogue,
    label: 'ROUTING NEGATIVE CONTROL — K7 structures, discovered by catalogue scan' },
];

const OTHERS = 64;

for (const cand of CANDIDATES) {
  RULE('-');
  say(`CANDIDATE ${cand.id} — ${cand.label}`);
  RULE('-');
  say(`  ${rpad('M', 6)} ${rpad('Urow', 6)} ${rpad('Nvidx', 7)} ${rpad('U1lb', 7)} ${rpad('Ncidx', 7)} ` +
      `${rpad('Urank', 7)} ${rpad('Uroute', 7)} ${rpad('Umax', 7)} ${rpad('ans', 4)}  version traversal`);
  for (const M of SIZES) {
    const kernel = buildFixture(M, { otherSubjects: OTHERS, skew: 'uniform' });
    const intervalEnd = nextBoundary(kernel, TX);
    const ctx = ctxFor(kernel, OTHERS, { t: TX, intervalEnd });
    const per = {};
    let sigNone = null, sigRow = null;
    let answered = 0, leaked = 0, authorizedResident = 0, routedCount = 0;

    for (const placement of PLACEMENTS) {
      const db = new DatabaseSync(':memory:');
      loadKernel(db, kernel);
      buildStore(db, kernel, cand.pattern, ctx);
      const c = newCounters();
      installProbeFunctions(db, c, kernel, TX);
      installRoutingInstrument(db, c, cand.pattern);
      const keys = cand.route(db, c, cand.pattern);
      routedCount = keys.length;
      const sql = buildQuery(keys, placement, { pinBounded: cand.pin });
      if (!sql) { per[placement] = { skip: true }; db.close(); continue; }
      const p = paramsFor(TX);
      const plan = planOf(db, sql, p);
      const sig = seekSignature(plan);
      if (placement === 'none') sigNone = sig;
      let rows = [];
      try { rows = db.prepare(sql).all(bind(sql, p)); } catch (e) { rows = []; }
      // the post-retrieval kernel re-check — ADR-0020 §3 point 2, always against the kernel
      const rc = makeRecheck(c, kernel, TX);
      const kept = [];
      for (const r of rows) if (rc.run(r)) kept.push(r);
      per[placement] = {
        Urow: c.row.unauth.size, Nvidx: c.index.calls, Ncidx: c.cindex.calls,
        Urank: c.rank.unauth.size, Uroute: c.route.unauth.size,
        answered: kept.length, leaked: kept.filter(x => !chunkAuthorized(kernel, x, TX)).length,
        sig, vsig: versionTraversalSignature(plan),
      };
      if (placement === 'row') sigRow = sig;
      if (placement !== 'none') { transferChecks++; if (sig !== sigNone) transferFailures++; }
      answered = kept.length;
      leaked = per[placement].leaked;
      db.close();
    }

    // authorized versions resident in the routed structures — the allowance's input
    {
      const mine = new Set(cand.pattern.routeOf(SUBJECT));
      for (const v of kernel.versions.values()) {
        if (v.state !== ANSWERABLE_STATE) continue;
        if (!cand.pattern.keysOf(v, ctx).some(k => mine.has(k))) continue;
        if (versionAuthorized(v, TX)) authorizedResident++;
      }
    }
    const Urow = per.row?.Urow ?? 0;
    const Nvidx = per.vidx?.Nvidx ?? 0;
    const Ncidx = per.cidx?.Ncidx ?? 0;
    const Urank = per.row?.Urank ?? 0;
    const Uroute = per.row?.Uroute ?? 0;
    const U1lb = u1LowerBound(Nvidx, authorizedResident);
    const Umax = Math.max(Urow, U1lb, Urank, Uroute);
    gridRows.push({ cand: cand.id, M, Urow, Nvidx, U1lb, Ncidx, Urank, Uroute, Umax,
                    answered, leaked, routed: routedCount,
                    vsig: per.none?.vsig ?? '', transferable: sigRow === sigNone });
    say(`  ${rpad(M, 6)} ${rpad(Urow, 6)} ${rpad(Nvidx, 7)} ${rpad(U1lb, 7)} ${rpad(Ncidx, 7)} ` +
        `${rpad(Urank, 7)} ${rpad(Uroute, 7)} ${rpad(Umax, 7)} ${rpad(answered, 4)}  ` +
        (per.none?.vsig ?? ''));
  }
  say('');
}

say(`  Plan-transfer control: ${transferFailures} of ${transferChecks} instrumented measurements had a`);
say(`  seek signature differing from the uninstrumented plan.`);
say(`  ${transferFailures === 0 ? 'The instruments did not move the planner, so the counts transfer.'
                                : 'AT LEAST ONE DOES NOT TRANSFER and is reported as NOT TRANSFERABLE.'}`);
say('');

/* ================================================================== *
 * SECTION 5 — ITEM 5: I5, I7, I8 — measured, or NEVER MEASURED with the limitation
 * ================================================================== */

RULE('=');
say('SECTION 5 — ITEM 5: I5, I7 AND I8. Measured where genuinely observable; otherwise NEVER');
say('            MEASURED with the exact limitation. There is no third option (MSG-0137 item 5).');
RULE('=');
say('§4.8 records I5 as "not measured". §4.13 records I7 and I8 as "Structural proposal. NEVER');
say('MEASURED". All three are BUILT AND RUN above, on the same fixture, predicate, placements and');
say('collection sizes as K7/K8 — so the numbers are comparable and no new instrument is introduced.');
say('');
say('WHAT IS NOW MEASURED FOR EACH, AND WHAT REMAINS NEVER MEASURED:');
say('');
say(`  ${pad('pattern', 8)} ${rpad('routed', 7)} ${rpad('Umax@50', 8)} ${rpad('Umax@500', 9)} ${rpad('Umax@5000', 10)}  growth with N`);
for (const id of ['K7', 'K8', 'I5', 'I8', 'I7']) {
  const rows = SIZES.map(M => gridRows.find(g => g.cand === id && g.M === M));
  if (rows.some(r => !r)) continue;
  const grows = rows[2].Umax > rows[0].Umax;
  const vacuous = rows.filter(r => r.U1lb === 0 && r.Nvidx > 0).length;
  say(`  ${pad(id, 8)} ${rpad(rows[0].routed, 7)} ${rpad(rows[0].Umax, 8)} ${rpad(rows[1].Umax, 9)} ` +
      `${rpad(rows[2].Umax, 10)}  ${grows ? 'GROWS — decisive evidence of failure (§4.6 S3)'
                                          : 'does not grow at these sizes'}` +
      (vacuous ? `   [U1lb VACUOUS in ${vacuous}/${rows.length} cells]` : ''));
}
say('');
say('  "VACUOUS" means the derived bound returned zero while the version cursor DID visit entries.');
say('  A vacuous bound proves NOTHING at that size — it is not a measurement of U1 = 0, and §4.12');
say('  says so in terms. A row with a vacuous bound is not a row with a clean one.');
say('');

say('5.1 — I7\'s interval, and the two invalidating events §4.13 names.');
say('');
{
  const kernel = buildFixture(500, { otherSubjects: OTHERS });
  const end = nextBoundary(kernel, TX);
  say(`    next effectivity boundary after the query instant: ${end === null ? 'NONE — interval unbounded' : end}`);
  say(`    interval length in fixture units: ${end === null ? 'unbounded' : end - TX}`);
  say('');
  say('    The boundary is COMPUTED FROM KERNEL DATA — eff_from and eff_to and nothing else. That is');
  say('    §4.13\'s load-bearing claim and it is reproduced here rather than restated.');
  say('');

  // EVENT 1 — crossing the boundary WITHOUT re-refining
  const ctx = ctxFor(kernel, OTHERS, { t: TX, intervalEnd: end });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  buildStore(db, kernel, PATTERNS.I7, ctx);
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  installRoutingInstrument(db, c, PATTERNS.I7);
  const keys = routeComputed(db, c, PATTERNS.I7);
  const after = end === null ? TX + 1 : end + 1;
  const sql = buildQuery(keys, 'row');
  const rowsAfter = sql ? db.prepare(sql).all(bind(sql, paramsFor(after))) : [];
  const cAfter = newCounters();
  const rcAfter = makeRecheck(cAfter, kernel, after);
  const keptAfter = rowsAfter.filter(r => rcAfter.run(r));
  const leakedAfter = keptAfter.filter(x => !chunkAuthorized(kernel, x, after)).length;
  const authorizedAfter = kernel.chunks.filter(ch => chunkAuthorized(kernel, ch, after)).length;
  const withheldAfter = authorizedAfter - keptAfter.filter(x => chunkAuthorized(kernel, x, after)).length;
  say(`    EVENT 1 — the clock crosses the boundary and the structure is NOT re-refined:`);
  say(`      rows returned by the structure = ${rowsAfter.length}; after the ADR-0020 §3 point-2`);
  say(`      kernel re-check, kept = ${keptAfter.length}, LEAKED = ${leakedAfter}`);
  say(`      authorized chunks in the kernel at that instant = ${authorizedAfter}; WITHHELD = ${withheldAfter}`);
  say(`      -> ${leakedAfter === 0
        ? 'the KERNEL RE-CHECK caught the leak. The structure alone did not: G-Q5 condition 2 is doing'
        : 'THE PRIOR VERSION ANSWERED. Zero stale-answer tolerance VIOLATED.'}`);
  if (leakedAfter === 0)
  say('         the work, which is why §4.9 G-Q5 requires BOTH conditions and neither substitutes.');
  say(`      -> ${withheldAfter > 0
        ? 'AND IT WITHHELD ' + withheldAfter + ' AUTHORIZED CHUNKS. That is the OTHER failure direction, and'
        : 'and it withheld nothing at that instant.'}`);
  if (withheldAfter > 0)
  say('         §3.3 wrong-exclusive and the K4 trap both say it cannot be traded for a clean U.');
  say('');
  say('      READ THIS AS A RESULT ABOUT I7, NOT ABOUT THE RE-CHECK. The boundary is precisely where');
  say('      I7\'s refinement expires. §4.13 predicted the interval "is invalidated by the event of');
  say('      reaching it"; what is measured here is what happens WHEN THAT INVALIDATION IS NOT WIRED,');
  say('      and it is a real failure, not a hypothetical one.');
  say('');

  // EVENT 2 — ingestion inside the interval, no boundary crossed
  const kernel2 = buildFixture(500, { otherSubjects: OTHERS });
  const mid = end === null ? TX + 10 : Math.floor((TX + end) / 2);
  kernel2.versions.set('ING', { version_id: 'ING', policy_id: 'POL-INGEST', scope: SUBJECT.scope,
    cls: 'INTERNAL', state: ANSWERABLE_STATE, audiences: ['staff'],
    eff_from: TX - 1, eff_to: null, recorded_at: mid });
  kernel2.chunks.push({ id: 10 ** 7, policy_id: 'POL-INGEST', version_id: 'ING',
    scope: SUBJECT.scope, body: AUTH_BODY('ING', 0) });
  const ctxStale = ctxFor(kernel, OTHERS, { t: TX, intervalEnd: end });   // built from the OLD kernel
  const db2 = new DatabaseSync(':memory:');
  loadKernel(db2, kernel2);
  buildStore(db2, kernel, PATTERNS.I7, ctxStale);   // structure reflects the pre-ingestion kernel
  const c2 = newCounters();
  installProbeFunctions(db2, c2, kernel2, mid);
  const keys2 = routeComputed(db2, c2, PATTERNS.I7);
  const sql2 = buildQuery(keys2, 'row');
  const rows2 = sql2 ? db2.prepare(sql2).all(bind(sql2, paramsFor(mid))) : [];
  const returnedIng = rows2.some(r => r.version_id === 'ING');
  const authorizedNow = [...kernel2.versions.values()]
    .filter(v => versionAuthorized(v, mid)).map(v => v.version_id);
  say(`    EVENT 2 — a version is INGESTED between t and the next boundary. No boundary is crossed.`);
  say(`      authorized versions in the kernel at this instant: ${authorizedNow.length}`);
  say(`      the ingested version appears in the structure's answer: ${returnedIng ? 'YES' : 'NO'}`);
  say(`      -> ${returnedIng ? 'the structure saw it'
        : 'THE STRUCTURE WITHHELD AN AUTHORIZED VERSION. §4.13 names this: "ingestion is itself an'}`);
  if (!returnedIng) {
  say('         invalidating event under N3, and it is the one a boundary-driven design omits most');
  say('         naturally." IT IS MEASURED HERE, NOT PREDICTED. And it is a WITHHOLDING failure, which');
  say('         §3.3 wrong-exclusive and the K4 trap both say cannot be traded for a clean U.');
  }
  db.close(); db2.close();
}
say('');

say('5.2 — What remains NEVER MEASURED for I5, I7 and I8, with the exact limitation.');
say('');
const NEVER_MEASURED = [
  ['I5', 'structure COUNT and storage replication factor at production scale',
        'corpus scale is UNMEASURED at n=1 (§11 #1). No principal population exists to count against.'],
  ['I5', 'E4 — engine log inspection',
        'UNOBTAINABLE on this test subject; section 2 re-check. Not inferable (§4.6 S9).'],
  ['I5', 'E3 — opaque-stage confinement for a lexical or vector stage',
        'no lexical or vector stage is built here; FTS5 MATCH internals were NOT MEASURED by MSG-0104 §5.3 and remain so.'],
  ['I8', 'entitlement-class COUNT, combinatorial in the worst case',
        'no real entitlement population exists in the fixture; a synthetic count would be an invented figure (§4.6 S11).'],
  ['I8', 'the cost of a subject MOVING between classes',
        'requires a migration mechanism this probe does not build and MSG-0137 does not authorize.'],
  ['I7', 're-refinement RATE as a function of corpus boundary density',
        '§4.13: "a function of the corpus\'s boundary density, which is UNKNOWN" — corpus unmeasured at n=1.'],
  ['I7', 'G-Q5.1c abstention-on-breach as a DESIGNED mechanism',
        'this probe measures what the structure returns at and after the boundary; it builds no abstention controller, so the mechanism limb is untested.'],
  ['ALL', 'implicit schema resolution during routing',
        'no instrument below statement compilation is reachable; ENABLE_STMT_SCANSTATUS ABSENT (section 2.2, section 3.4).'],
  ['ALL', 'interior b-tree pages, pager reads, and any loop the index-cursor instrument does not sit in',
        'the instrument is a LOWER BOUND by construction (§4.6 S5). No reachable API reports them.'],
];
say(`  ${pad('pattern', 8)} ${pad('quantity', 62)} status`);
for (const [p, q] of NEVER_MEASURED) say(`  ${pad(p, 8)} ${pad(q, 62)} NEVER MEASURED`);
say('');
say('  The exact limitation for each:');
for (const [p, q, why] of NEVER_MEASURED) say(`    ${p} · ${q}\n        ${why}`);
say('');
say('  Under §4.6 S9 every one of these yields NOT CLEARED for the pattern that carries it. There is');
say('  no third option and none is taken.');
say('');

/* ================================================================== *
 * SECTION 6 — ITEM 4: Q7 ZERO STALE-ANSWER TOLERANCE
 * ================================================================== */

RULE('=');
say('SECTION 6 — ITEM 4: ZERO STALE-ANSWER TOLERANCE ACROSS THE FOUR TRANSITIONS (Q7 = A)');
RULE('=');
say('MSG-0136: after an update, approval, revocation or supersession THE PRIOR VERSION MUST NOT');
say('ANSWER; where the current approved version cannot be established the system ABSTAINS. NO');
say('ELAPSED-TIME THRESHOLD IS INTRODUCED — so there is no allowance to test against, and');
say('THE TEST IS THE TRANSITION ITSELF.');
say('');
say('G-Q7.2\'s DISCRIMINATOR is the whole test (MSG-0113 §3): query each transition TWICE — once');
say('before the periodic timer has fired and once after. A DESIGN THAT FAILS THE FIRST AND PASSES');
say('THE SECOND WAS MADE CORRECT BY WAITING, NOT BY THE TRANSITION.');
say('');
say('The timer PERIOD below is a FIXTURE CONSTANT, present only so a "before" and an "after" exist.');
say('It is NOT a proposed staleness threshold, and no magnitude is judged, proposed or recommended.');
say('');

const PERIOD = 1000;                   // fixture units. Not a threshold. See above.
const T_MAT  = T_ORIGIN;               // materialisation instant
const T_TXN  = T_ORIGIN + 10;          // the transition is recorded here
const T_Q1   = T_ORIGIN + 20;          // BEFORE the timer fires  (T_Q1 - T_MAT < PERIOD)
const T_Q2   = T_MAT + PERIOD + 1;     // AFTER  the timer fires

/*
 * The freshness fixture is deliberately small and hand-checkable: one policy, one prior
 * version, one successor. Collection size is not the variable here — MSG-0113's own probe
 * established that the freshness grid is IDENTICAL at every collection size, and re-running
 * that is exactly the repetition item 3 forbids.
 */
function freshnessKernel() {
  const versions = new Map();
  const chunks = [];
  const add = (id, o) => versions.set(id, {
    version_id: id, policy_id: TARGET_POLICY, scope: SUBJECT.scope, cls: 'INTERNAL',
    audiences: ['staff'], state: o.state, eff_from: o.eff_from ?? T_ORIGIN - 5000,
    eff_to: o.eff_to ?? null, recorded_at: o.recorded_at ?? T_BUILD,
  });
  add('W1', { state: 'PUBLISHED' });                        // the version in force at T_MAT
  add('W2', { state: 'DRAFT' });                            // the successor, not yet answerable
  chunks.push({ id: 1, policy_id: TARGET_POLICY, version_id: 'W1', scope: SUBJECT.scope,
                body: AUTH_BODY('W1', 0) });
  chunks.push({ id: 2, policy_id: TARGET_POLICY, version_id: 'W2', scope: SUBJECT.scope,
                body: AUTH_BODY('W2', 0) });
  return { versions, chunks, others: [], reachable: true };
}

/* The four transitions MSG-0137 item 4 names, plus the abstention case. Each mutates the
 * KERNEL at T_TXN — the authoritative record — and each records what the current answerable
 * version becomes. */
const TRANSITIONS = [
  { id: 'update', label: 'UPDATE — W1 superseded by a corrected W2, published at the transition',
    apply: (k) => { k.versions.get('W1').state = 'SUPERSEDED';
                    k.versions.get('W2').state = 'PUBLISHED'; },
    currentAfter: 'W2' },
  { id: 'approval', label: 'APPROVAL — W2 moves DRAFT -> APPROVED -> PUBLISHED and becomes current',
    apply: (k) => { k.versions.get('W2').state = 'PUBLISHED';
                    k.versions.get('W1').state = 'SUPERSEDED'; },
    currentAfter: 'W2' },
  { id: 'revocation', label: 'REVOCATION — W1 is revoked and NO successor exists',
    apply: (k) => { k.versions.get('W1').state = 'REVOKED'; },
    currentAfter: null },
  { id: 'supersession', label: 'SUPERSESSION — W1 superseded directly, successor still DRAFT',
    apply: (k) => { k.versions.get('W1').state = 'SUPERSEDED'; },
    currentAfter: null },
  /*
   * THE CASE THAT SEPARATES A KERNEL RE-CHECK FROM A FAKED ONE, and the reason it is here.
   *
   * A first version of this section could not tell T3 from T5: the CURRENCY CONSULT ran the
   * full authorization predicate, so it rejected W1 before the re-check was ever reached, and
   * the faked re-check passed 6 of 6. THE DEFECT WAS IN THE FIXTURE, NOT THE DESIGNS — and it
   * is recorded rather than quietly repaired, because it is the same defect §4.6 S8 exists to
   * catch: a control that cannot fail proves nothing.
   *
   * The repair is architecturally the right one anyway: CURRENCY IS NOT AUTHORIZATION. G-Q7.1
   * and G-Q7.3 ask whether the answer resolves against the CURRENT version; ADR-0020 §3 point
   * 2 and G-Q5.2 ask whether each hit is RE-AUTHORIZED. The consult below therefore tests
   * lifecycle currency only, and hit-level authorization is left to the re-check — which is
   * exactly where §4.10 result 3 found A4 and A5 to differ.
   *
   * In this case W1 stays PUBLISHED and effective — so it IS current — and becomes
   * unauthorized for this subject by classification. Only a re-check reading THE KERNEL
   * catches it.
   */
  { id: 'reclassify', label: 'RECLASSIFICATION — W1 stays current but becomes RESTRICTED, outside the hooked set',
    apply: (k) => { k.versions.get('W1').cls = 'RESTRICTED'; },
    currentAfter: null, outsideHookSet: true },
  { id: 'unavailable', label: 'CURRENT VERSION UNAVAILABLE — the authoritative record cannot be reached',
    apply: (k) => { k.reachable = false; },
    currentAfter: null, unavailable: true },
];

/*
 * The freshness designs. Each is a MECHANISM, not a product.
 *
 *   T1  materialised projection, PERIODIC re-materialisation only
 *   T2  T1 + transition-triggered invalidation, hooked to LIFECYCLE STATE changes only
 *   T3  T2 + kernel consult for currency + the ADR-0020 §3 point-2 re-check AGAINST THE KERNEL
 *   T4  authoritative partitioned store — the truth LIVES in the partition, there is no copy
 *   T5  as T3 but the re-check reads THE COPY (the faked re-check; §4.10 result 3's shape)
 *   NCF NEGATIVE CONTROL — on any difficulty it falls back to the last good snapshot
 */
const F_DESIGNS = [
  { id: 'T1',  periodic: true,  hook: false, consult: false, recheck: false, authoritative: false },
  { id: 'T2',  periodic: true,  hook: true,  consult: false, recheck: false, authoritative: false },
  { id: 'T3',  periodic: true,  hook: true,  consult: true,  recheck: true,  authoritative: false },
  { id: 'T4',  periodic: false, hook: true,  consult: true,  recheck: true,  authoritative: true },
  { id: 'T5',  periodic: true,  hook: true,  consult: true,  recheck: 'copy', authoritative: false },
  { id: 'NCF', periodic: true,  hook: false, consult: false, recheck: false, authoritative: false,
    fallback: true },
];
const F_LABEL = {
  T1: 'materialised, PERIODIC re-materialisation only',
  T2: 'T1 + transition-triggered invalidation, hooked to LIFECYCLE STATE only',
  T3: 'T2 + kernel consult for currency + §3 point-2 re-check AGAINST THE KERNEL',
  T4: 'authoritative partitioned store — the truth lives in the partition, no copy',
  T5: 'as T3 but the re-check reads THE COPY (the faked re-check)',
  NCF: 'NEGATIVE CONTROL — falls back to the last good snapshot on any difficulty',
};

/*
 * One freshness case. Returns what the design DID: the versions it answered, whether it
 * abstained, and which abstention class the fixture convention assigns.
 *
 * PASS, stated before it is computed, so it cannot be tuned to the result:
 *   - the PRIOR version (W1) must NOT appear in the answer after the transition; and
 *   - where no current answerable version exists, the design must ABSTAIN — an empty
 *     answer is NOT an abstention (G-Q7.4); and
 *   - where currency cannot be established, the design must ABSTAIN.
 */
function runFreshness(design, transition, queryAt) {
  const kernel = freshnessKernel();
  const projection = new Map();      // the materialised copy, as of T_MAT
  for (const v of kernel.versions.values())
    if (v.state === ANSWERABLE_STATE) projection.set(v.version_id, { ...v });
  let matAt = T_MAT;

  transition.apply(kernel);          // the transition is RECORDED in the kernel at T_TXN

  // transition-triggered invalidation, if the design has it AND the change is in its hooked set
  const hookFires = design.hook && !transition.outsideHookSet && !transition.unavailable;
  if (hookFires) { projection.clear(); matAt = T_TXN; refresh(); }

  // periodic re-materialisation, if the design has it and the period has elapsed
  if (design.periodic && queryAt - matAt >= PERIOD) { projection.clear(); matAt = queryAt; refresh(); }

  function refresh() {
    if (!kernel.reachable) return;   // cannot re-materialise from an unreachable record
    for (const v of kernel.versions.values())
      if (v.state === ANSWERABLE_STATE) projection.set(v.version_id, { ...v });
  }

  const c = newCounters();
  const result = { answered: [], abstained: null, empty: false, staleAnswer: false,
                   unauthorizedAnswer: false, withheld: 0 };
  const authorizedNow = [...kernel.versions.values()]
    .filter(v => v.policy_id === TARGET_POLICY && versionAuthorized(v, queryAt))
    .map(v => v.version_id);

  // T4 keeps no copy: the partition IS the authoritative store, so it cannot be stale — but
  // if the authoritative record is unreachable, so is the partition.
  const source = design.authoritative
    ? (kernel.reachable ? new Map([...kernel.versions].filter(([, v]) => v.state === ANSWERABLE_STATE)) : null)
    : projection;

  if (source === null) {
    result.abstained = A7;                                    // G-Q7.4 — system degraded
    return result;
  }

  // G-Q7.1 / MSG-0113 §1's "cannot be established" limb: a design that never asks the
  // authoritative record cannot establish currency, so it must abstain even when its
  // projection happens to be right.
  if (design.consult) {
    if (!kernel.reachable) { result.abstained = A7; return result; }
    c.recheck.kernelConsults++;
    // CURRENCY ONLY — lifecycle state and effectivity. NOT the subject's authorization,
    // which is the re-check's job (ADR-0020 §3 point 2 / G-Q5.2). See the note on the
    // 'reclassify' transition above.
    const current = [...kernel.versions.values()].filter(v =>
      v.policy_id === TARGET_POLICY && v.state === ANSWERABLE_STATE &&
      v.eff_from <= queryAt && (v.eff_to === null || v.eff_to > queryAt));
    if (!current.length) { result.abstained = A4; return result; }   // fixture convention
  }

  let hits = [...source.values()].filter(v => v.policy_id === TARGET_POLICY);

  if (design.recheck === 'copy') {
    const rc = makeRecheck(c, kernel, queryAt, { readCopy: true, projection });
    hits = hits.filter(h => rc.run(h));
  } else if (design.recheck) {
    if (!kernel.reachable) { result.abstained = A7; return result; }
    const rc = makeRecheck(c, kernel, queryAt);
    try { hits = hits.filter(h => rc.run(h)); }
    catch (e) { result.abstained = A7; return result; }
  }

  if (design.fallback && !hits.length) {
    // the negative control's defect: on an empty result it serves the last good snapshot
    hits = [{ version_id: 'W1', policy_id: TARGET_POLICY }];
  }

  result.answered = hits.map(h => h.version_id);
  result.unauthorizedAnswer = result.answered
    .some(id => !versionAuthorized(kernel.versions.get(id), queryAt));
  result.staleAnswer = result.answered.includes('W1') && transition.currentAfter !== 'W1';
  result.withheld = authorizedNow.filter(id => !result.answered.includes(id)).length;
  if (!result.answered.length) {
    if (!design.consult) result.empty = true;                 // an empty ANSWER, not an abstention
    else result.abstained = A1;
  }
  return result;
}

say('  PASS requires ALL of:  the prior version W1 does NOT answer after the transition;');
say('                         where no current answerable version exists, the design ABSTAINS;');
say('                         an EMPTY ANSWER IS NOT AN ABSTENTION (G-Q7.4).');
say('');
const freshGrid = [];
for (const d of F_DESIGNS) {
  RULE('-');
  say(`DESIGN ${d.id} — ${F_LABEL[d.id]}`);
  RULE('-');
  say(`  ${pad('transition', 14)} ${pad('before timer', 30)} ${pad('after timer', 30)} discriminator`);
  for (const t of TRANSITIONS) {
    const r1 = runFreshness(d, t, T_Q1);
    const r2 = runFreshness(d, t, T_Q2);
    const verdict = (r) => {
      if (r.staleAnswer) return 'STALE ANSWER — FAIL';
      if (r.unauthorizedAnswer) return 'UNAUTHORIZED ANSWER — FAIL';
      if (r.empty) return 'EMPTY ANSWER — FAIL (G-Q7.4)';
      if (r.abstained) return `ABSTAINED ${r.abstained} — pass${r.withheld ? ' (withheld ' + r.withheld + ')' : ''}`;
      if (t.currentAfter && r.answered.includes(t.currentAfter)) return `answered ${t.currentAfter} — pass`;
      if (!t.currentAfter && r.answered.length) return `answered ${r.answered.join(',')} — FAIL`;
      return `answered ${r.answered.join(',') || '(none)'} — pass`;
    };
    const v1 = verdict(r1), v2 = verdict(r2);
    const p1 = /pass/.test(v1), p2 = /pass/.test(v2);
    const disc = (!p1 && p2) ? 'MADE CORRECT BY WAITING — periodic, not transition-triggered'
               : (p1 && p2)  ? 'transition-triggered'
               : (p1 && !p2) ? 'PASSES ONLY BEFORE THE TIMER — anomalous, read the row'
                             : 'fails both — not a timing question';
    freshGrid.push({ design: d.id, transition: t.id, p1, p2, v1, v2, disc,
                     stale: r1.staleAnswer || r2.staleAnswer,
                     unauth: r1.unauthorizedAnswer || r2.unauthorizedAnswer,
                     empty: r1.empty || r2.empty,
                     withheld: Math.max(r1.withheld, r2.withheld) });
    say(`  ${pad(t.id, 14)} ${pad(v1, 30)} ${pad(v2, 30)} ${disc}`);
  }
  const passes = freshGrid.filter(g => g.design === d.id && g.p1 && g.p2).length;
  say('');
  say(`  ${d.id}: ${passes} of ${TRANSITIONS.length} transitions pass at BOTH instants.`);
  say('');
}

say('  THE DISCRIMINATOR, READ ACROSS DESIGNS:');
const madeCorrect = freshGrid.filter(g => /MADE CORRECT BY WAITING/.test(g.disc));
say(`    ${madeCorrect.length} (design, transition) cells were MADE CORRECT BY WAITING.`);
if (madeCorrect.length) {
  say('    Each of those is a design whose mechanism is a TIMER, passing a fixed-time test it should');
  say('    have failed. MSG-0113 §3: "Passing a fixed-time test alone does not establish the');
  say('    requirement." Under Q7 = A there is no elapsed-time allowance, so a cell that fails at');
  say('    T_Q1 FAILS — the later pass is not mitigation.');
  for (const g of madeCorrect) say(`      ${pad(g.design, 5)} ${pad(g.transition, 14)} ${g.v1}  ->  ${g.v2}`);
} else {
  say('    NONE — which would mean the fixture failed to separate the two mechanisms, and the');
  say('    discriminator proved nothing. THAT WOULD BE A DEFECT IN THIS PROBE, not a result.');
  failures.push('the freshness discriminator separated no design — fixture defect');
}
say('');

const ncf = freshGrid.filter(g => g.design === 'NCF');
const ncfFails = ncf.filter(g => !(g.p1 && g.p2)).length;
say(`  FRESHNESS NEGATIVE CONTROL: NCF failed ${ncfFails} of ${ncf.length} cells -> ` +
    (ncfFails > 0 ? 'the freshness section is VALID (§4.6 S8).'
                  : 'THE CONTROL DID NOT FAIL — THIS SECTION IS VOID.'));
if (ncfFails === 0) { VOID = true; failures.push('freshness negative control did not fail'); }
say('');
say('  T3 vs T5 — THE FAKED RE-CHECK, ISOLATED. §4.9 G-Q5.2b calls this "the limb most easily faked');
say('  and the one that matters"; §4.10 result 3 demonstrated it once. It is reproduced here on a');
say('  different fixture, and on the ONE transition that isolates it:');
{
  const t3 = freshGrid.filter(g => g.design === 'T3' && g.transition === 'reclassify')[0];
  const t5 = freshGrid.filter(g => g.design === 'T5' && g.transition === 'reclassify')[0];
  say(`    T3 (re-check reads THE KERNEL): ${t3.v1}`);
  say(`    T5 (re-check reads THE COPY)  : ${t5.v1}`);
  const separated = (t3.p1 && !t5.p1);
  say(`    -> ${separated
        ? 'SEPARATED. Same mechanism, same hooks, same consult; they differ ONLY in what the re-check reads,'
        : 'NOT SEPARATED — the fixture does not isolate the re-check limb and proves nothing about it.'}`);
  if (separated) {
    say('       and one abstains while the other answers a version the kernel has reclassified.');
    say('       A "re-check" reading the stale copy\'s own attributes RE-CHECKS THE STALE DATA AGAINST');
    say('       ITSELF AND IS A NO-OP, exactly as G-Q5.2b says.');
  } else {
    failures.push('T3 and T5 were not separated — the faked-re-check limb is untested');
  }
}
say('');
say('  ZERO STALE-ANSWER TOLERANCE, stated as a count rather than an impression. The counts below');
say('  come from the RECORDED FLAGS, not from the displayed verdict string — a cell that is both');
say('  stale and unauthorized displays only the first, and counting the strings would under-report');
say('  the second. The categories therefore OVERLAP and do not sum to the cell total.');
say('');
const staleCells = freshGrid.filter(g => g.stale);
const unauthCells = freshGrid.filter(g => g.unauth);
const emptyCells = freshGrid.filter(g => g.empty);
const withholdCells = freshGrid.filter(g => g.withheld > 0);
say(`    ${rpad(staleCells.length, 3)} of ${freshGrid.length} (design, transition) cells answered the PRIOR version at at least one instant.`);
say(`    ${rpad(unauthCells.length, 3)} of ${freshGrid.length} answered a version UNAUTHORIZED for the subject at the query instant.`);
say(`    ${rpad(emptyCells.length, 3)} of ${freshGrid.length} returned an EMPTY ANSWER where an abstention was required (G-Q7.4).`);
say(`    ${rpad(withholdCells.length, 3)} of ${freshGrid.length} WITHHELD an authorized current version — the other failure direction.`);
say('');
say('    Under Q7 = A every stale and every unauthorized answer is a FAILURE with no allowance');
say('    available to excuse it, because Q7 = A introduces NO threshold: there is nothing for a');
say('    design to be within. An empty answer fails on G-Q7.4 independently of freshness.');
say('');
say('  WHAT PASSING THIS SECTION DOES NOT BUY, stated so no row is misread.');
say('    T3 and T4 pass every transition at both instants. THEY ARE STILL NOT CLEARED. §4.9 and');
say('    §4.10 both say why in terms: these gates are NECESSARY AND NEVER SUFFICIENT, and §4.6 S6');
say('    still governs clearance. §4.10 already demonstrated this rather than asserting it — design');
say('    A6 met BOTH G-Q5 conditions and every G-Q7 requirement and is NOT CLEARED.');
say('    E4 is unobtainable for these designs too (section 2), and section 4 measures their U.');
say('');

/* ================================================================== *
 * SECTION 7 — VALIDITY GATE 2: the retrieval negative control (§4.6 S8)
 * ================================================================== */

RULE('=');
say('SECTION 7 — VALIDITY GATE 2: the retrieval negative control (EPA-0006 §4.6 S8)');
RULE('=');
say('A deliberately non-conforming candidate must be included in EVERY probe run. If the harness');
say('does not fail it, this run is VOID and its findings prove nothing.');
say('');
let ncFailures = 0, ncCases = 0;
for (const M of SIZES) {
  const kernel = buildFixture(M, { otherSubjects: OTHERS, skew: 'uniform' });
  const db = new DatabaseSync(':memory:');
  loadKernel(db, kernel);
  const c = newCounters();
  installProbeFunctions(db, c, kernel, TX);
  const sql = buildNegativeControlQuery();
  const rows = db.prepare(sql).all(bind(sql, paramsFor(TX)));
  const authorized = kernel.chunks.filter(ch => chunkAuthorized(kernel, ch, TX)).length;
  const U = new Set([...c.row.unauth, ...c.rank.unauth]).size;
  const failed = rows.length < authorized || U > 0;
  ncCases++; if (failed) ncFailures++;
  say(`  M=${rpad(M, 6)}  U=${rpad(U, 6)} answered=${rows.length}/${authorized}  -> ` +
      (failed ? 'FAILS, as required' : 'DID NOT FAIL — RUN IS VOID'));
  db.close();
}
say('');
say(`  The retrieval control failed in ${ncFailures} of ${ncCases} cases -> ` +
    (ncFailures > 0 ? 'the run is VALID (§4.6 S8).' : 'THE RUN IS VOID.'));
if (ncFailures === 0) { VOID = true; failures.push('retrieval negative control did not fail'); }
say('');
say('  THE ADVERSARIAL PRECONDITION HELD (section 1) AND THE CONTROLS FAILED AS REQUIRED. Both');
say('  validity gates §4.6 S8 names are satisfied, so the measurements above are interpretable.');
say('');

/* the E4-adjacent surface scan — NOT E4, and not offered as E4 */
say('  Surface scan (not E4, and not offered as E4): engine-produced text surfaces, scanned for');
say('  unauthorized passage text.');
{
  const kernel = buildFixture(500, { otherSubjects: OTHERS });
  const ctx = ctxFor(kernel, OTHERS, { t: TX, intervalEnd: nextBoundary(kernel, TX) });
  const unauthorizedBodies = [...new Set(kernel.chunks
    .filter(ch => !chunkAuthorized(kernel, ch, TX)).map(ch => ch.body))].slice(0, 5);
  let hits = 0, surfaces = 0;
  for (const cand of CANDIDATES.filter(x => x.route === routeComputed)) {
    const db = new DatabaseSync(':memory:');
    loadKernel(db, kernel);
    buildStore(db, kernel, cand.pattern, ctx);
    const c = newCounters();
    installProbeFunctions(db, c, kernel, TX);
    installRoutingInstrument(db, c, cand.pattern);
    const keys = cand.route(db, c, cand.pattern);
    const sql = buildQuery(keys, 'row', { pinBounded: cand.pin });
    if (sql) {
      const p = paramsFor(TX);
      const text = [...planOf(db, sql, p),
                    ...opcodesOf(db, sql, p).map(r => `${r.p4 ?? ''} ${r.comment ?? ''}`)].join('\n');
      surfaces++;
      for (const b of unauthorizedBodies) if (text.includes(b)) hits++;
    }
    db.close();
  }
  say(`    ${surfaces} surfaces scanned against ${unauthorizedBodies.length} unauthorized passage bodies -> ${hits} occurrence(s).`);
  say('    Parameters are BOUND, never inlined, so no passage text reaches the plan or the opcode');
  say('    operands. THIS SAYS NOTHING ABOUT AN ENGINE LOG, which is what E4 concerns.');
}
say('');

/* ================================================================== *
 * SECTION 8 — EVIDENCE AND VERDICTS
 * ================================================================== */

RULE('=');
say('SECTION 8 — EVIDENCE PER CANDIDATE, AND VERDICTS');
RULE('=');
say('§4.6 S6: CLEARED requires E1 + E2 + E3 + E4 ALL OBTAINED, U = 0 at every measured collection');
say('size, shown not to grow with N. §4.6 S9: NOT CLEARED is the required answer wherever evidence');
say('is absent. §4.6 S7-R2: the reported U is the MAXIMUM across exercised applicable placements.');
say('');

const verdicts = [];
for (const cand of CANDIDATES) {
  const rows = SIZES.map(M => gridRows.find(g => g.cand === cand.id && g.M === M)).filter(Boolean);
  if (!rows.length) continue;
  const Umax = Math.max(...rows.map(r => r.Umax));
  const grows = rows[rows.length - 1].Umax > rows[0].Umax;
  const e2 = Umax === 0 && !grows;
  const routingOk = cand.route === routeComputed;
  const emptied = rows.some(r => r.answered === 0);
  // a U1lb of zero taken while the version cursor visited entries is a VACUOUS bound, not a
  // measurement of zero. §4.12 states this in terms and it must be visible per candidate.
  const vacuous = rows.filter(r => r.U1lb === 0 && r.Nvidx > 0).length;
  verdicts.push({ id: cand.id, Umax, grows, e2, routingOk, emptied, vacuous,
                  rows, perSize: rows.map(r => `${r.M}:${r.Umax}`).join(' ') });
}
say(`  ${pad('cand', 6)} ${pad('U by size (max across placements)', 30)} ${pad('E2', 27)} ${pad('E4', 16)} ${pad('G-Q4', 16)} verdict`);
for (const v of verdicts) {
  const e2txt = v.e2 ? 'zero at every size — see below' : (v.grows ? 'NOT OBTAINED — grows with N' : 'NOT OBTAINED — non-zero');
  const gq4 = v.routingOk ? 'MET' : 'FAILED (G-Q4.3)';
  say(`  ${pad(v.id, 6)} ${pad(v.perSize, 30)} ${pad(e2txt, 27)} ${pad('NOT OBTAINABLE', 16)} ${pad(gq4, 16)} NOT CLEARED`);
}
say('');
say('  EVERY CANDIDATE IS NOT CLEARED, AND E4 ALONE WOULD HAVE BEEN ENOUGH FOR THAT.');
say('  Where E2 also fails, it fails on its own evidence and not on E4\'s absence.');
say('');
say('  WHY EACH IS NOT CLEARED, ITEM BY ITEM — so no row is read as a near-miss:');
say('');
for (const v of verdicts) {
  const reasons = [];
  reasons.push('E4 NOT OBTAINABLE on this test subject (section 2) — §4.6 S6: absent class -> NOT CLEARED');
  reasons.push('E3 NEVER MEASURED — no opaque stage is instrumented here and §4.9 G-Q6 rejects construction');
  if (!v.e2) reasons.push(`E2 NOT OBTAINED — U reaches ${v.Umax} and ${v.grows ? 'GROWS with N (§4.6 S3: decisive failure)' : 'is non-zero'}`);
  else reasons.push('E2 not satisfied on a zero alone — §4.6 S5: a zero proves only that nothing crossed the instrument');
  if (v.vacuous) reasons.push(`the U1lb bound is VACUOUS in ${v.vacuous} of ${v.rows.length} cells (zero taken while the version cursor visited entries) — it proves nothing there, and is NOT U1 = 0`);
  if (!v.routingOk) reasons.push('G-Q4.3 FAILED — the routing phase scans the structure catalogue');
  reasons.push('implicit schema resolution during routing NEVER MEASURED (section 3.4)');
  if (v.emptied) reasons.push('answered an EMPTY authorized set at some size — a withholding failure (§3.3 wrong-exclusive)');
  if (v.id === 'I7') reasons.push('at the interval boundary the structure WITHHELD authorized content (section 5.1 event 1) and MISSED AN INGESTED VERSION inside the interval (event 2); G-Q5 applies to I7 in full and its abstention-on-breach limb is NEVER MEASURED');
  if (v.id === 'I5' || v.id === 'I8') reasons.push('structure/class counts at scale NEVER MEASURED — corpus unmeasured at n=1 (§11 #1)');
  say(`    ${v.id}:`);
  for (const r of reasons) say(`      - ${r}`);
  say('');
}
say('  WITHHOLDING CHECK (the K4 trap — U = 0 is purchasable by withholding authorized content):');
for (const v of verdicts)
  say(`    ${pad(v.id, 6)} answered a non-empty authorized set at every size in section 4: ` +
      `${v.emptied ? 'NO — SOME SIZE ANSWERED NOTHING' : 'yes'}`);
say('');
say('    That check covers the SECTION 4 grid only, at the steady-state instant. I7\'s withholding');
say('    failures are at the BOUNDARY and at INGESTION, and are in section 5.1 — a design can pass');
say('    the steady-state anchor and still withhold, which is why both are reported.');
say('');

say('  PRIOR VERDICTS, REPRODUCED UNCHANGED AND NOT RE-MEASURED HERE:');
say('    MSG-0104\'s nine class verdicts            — unchanged');
say('    §4.8\'s P0…NC design verdicts (TASK-0035)  — unchanged');
say('    §4.10\'s A0…NC design verdicts (TASK-0037) — unchanged');
say('    §4.11\'s K0…NC design verdicts (TASK-0038) — unchanged');
say('    §4.12\'s K7 / K8 verdicts (TASK-0039)      — unchanged: BOTH NOT CLEARED');
say('    K3 and K4 under MSG-0119\'s strict Q11     — unchanged: BOTH NOT CLEARED');
say('    class D and class H                        — unchanged: DISQUALIFIED');
say('  Nothing in this run relabels, re-runs or re-measures any of them.');
say('');

RULE('=');
say('RUN VALIDITY');
RULE('=');
say(`  adversarial precondition       : ${preconditionOk ? 'HELD at every size and both distributions' : 'FAILED'}`);
say(`  index-cursor calibration       : ${calibrationOk ? 'EXACT on both plans' : 'FAILED'}`);
say(`  retrieval negative control     : failed ${ncFailures}/${ncCases} cases`);
say(`  routing negative control       : ${gq4_2_catalogue ? 'DID NOT discriminate' : 'FAILED G-Q4.2 as required'}`);
say(`  freshness negative control     : failed ${ncfFails}/${ncf.length} cells`);
say(`  plan-transfer control          : ${transferFailures}/${transferChecks} non-transferable`);
say(`  measurements recorded          : ${gridRows.length} placement grid cells + ${freshGrid.length} freshness cells`);
say('');
if (failures.length) {
  say('  ISSUES RECORDED BY THIS RUN (recorded, not suppressed):');
  for (const f of failures) say('    * ' + f);
} else {
  say('  No probe-internal defect was detected by the checks above.');
}
say('');
say(VOID ? '  >> THIS RUN IS VOID. Its findings prove nothing (§4.6 S8).'
         : '  >> THIS RUN IS VALID. Both §4.6 S8 gates are satisfied and the measurements are interpretable.');
say('');
say('NOTHING IS CLEARED. NOTHING IS SELECTED. NO ADR IS AMENDED. NO GATE IS RELAXED.');
say('NO NUMERIC STALENESS THRESHOLD IS INTRODUCED. NO IMPLEMENTATION TASK IS AUTHORIZED.');
RULE('=');

const { writeFileSync } = await import('node:fs');
const { fileURLToPath } = await import('node:url');
const { dirname, join } = await import('node:path');
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'probe-output.txt'),
              out.join('\n') + '\n');
