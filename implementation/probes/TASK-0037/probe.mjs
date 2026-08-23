/*
 * TASK-0037 — Version-transition freshness and stale-version fail-closed probe (EVALUATION ONLY)
 *
 * Authority : MSG-0113 (DECIDED) · CLAUDE-TASKS.md §TASK-0037
 * Applies   : ADR-0018 §1 (three identities), §2 (lifecycle and answerability), §4 (effectivity at
 *               answer time; A4 policy gap), §5 (supersession; at most one effective PUBLISHED version)
 *             ADR-0020 §1 (the index is a projection; stale beyond threshold -> A7, never a stale
 *               answer), §2 (chunks inherit authorization exactly), §3 point 2 (post-retrieval
 *               re-check against the version's classification and audience)
 *             ADR-0017 §5 (abstention taxonomy A1-A7)
 *             EPA-0006 §3.3 (the index's copy of authorization attributes can go stale),
 *               §4.6 S3/S4/S5/S7/S8/S9 (the bar, the units, the asymmetry rule, placement, the
 *               negative control, the verdict vocabulary), §4.8 (isolation patterns), §4.9 G-Q5
 *
 * THIS PROBE SELECTS, ADOPTS, RECOMMENDS, INSTALLS AND DEPLOYS NOTHING.
 * The engine exercised here is a TEST SUBJECT (MSG-0101 §3), a member of EPA-0006 class R, used
 * because it is the only engine reachable on this host. The DESIGNS labelled A0..A6 and NC are
 * ARCHITECTURES, not products.
 *
 * It does NOT re-run TASK-0033 or TASK-0035. Those harnesses, outputs and verdicts are untouched
 * and stand. This probe asks the question MSG-0113 §3 authorizes:
 *
 *     once an authoritative version transition is RECORDED, can the prior version still be used
 *     for an employee answer -- and when the current version cannot be established or reached,
 *     does the answer path ABSTAIN rather than fall back?
 *
 * The controlled variable is the FRESHNESS MECHANISM. The authorization predicate, the physical
 * organisation (EPA-0006 §4.8 pattern I1+I2+I3+I4) and the query are held constant across designs.
 *
 * NO NUMERIC STALENESS THRESHOLD IS PROPOSED BY THIS PROBE. Design A6 carries a bound because
 * EPA-0006 §4.9 G-Q5.1a requires a bound to EXIST and be exhibited; its magnitude is a FIXTURE
 * CONSTANT and is explicitly NOT judged, proposed, or recommended (G-Q5.1a: "its magnitude is not
 * judged by this gate"). MSG-0113 §2 forbids a threshold replacing the business requirement.
 *
 * Boundaries honoured by construction:
 *   - nothing is installed; only the Node runtime already present is used
 *   - no network is reached
 *   - every database is ':memory:' — the probe leaves no file and no state behind
 *   - the corpus is synthetic and generated in-process; no real corpus is read
 *   - no wall-clock is read and no timing figure is produced; the clock is a fixture integer
 *
 * Run:  node implementation/probes/TASK-0037/probe.mjs
 */

import { DatabaseSync } from 'node:sqlite';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const j = (v) => JSON.stringify(v);
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);

/* ================================================================== *
 * 0. Subject, predicate and the accepted vocabulary
 * ================================================================== */

const SUBJECT = {
  scope: 'org-a',
  classifications: ['PUBLIC', 'INTERNAL'],
  audiences: ['staff', 'all-employees'],
};

// ADR-0018 §2. PUBLISHED is the ONLY answerable state. APPROVED-not-yet-published is NOT
// answerable, SUPERSEDED is "retained, not answerable", WITHDRAWN is "dropped from the projection".
// MSG-0113's phrase "the current approved version" is read as the accepted ADR's PUBLISHED and
// effective version -- the strict, fail-closed reading, which can only withhold an answer.
const ANSWERABLE_STATE = 'PUBLISHED';

// ADR-0017 §5 abstention taxonomy: A1 no coverage; A2 not authorized; A3 insufficient support;
// A4 policy gap; A5 ambiguous; A6 conflicting sources; A7 system degraded.
const A4 = 'A4', A7 = 'A7';

const TARGET_POLICY = 'POL-LEAVE';
const QUERY_TERM = 'leave';
const K = 5;
const CHUNKS_PER_VERSION = 4;

/* --- the fixture clock. An integer, never a wall-clock read. --- */
const T_ORIGIN = 1700000000;   // V1 becomes effective before this
const T_BUILD  = T_ORIGIN - 100;   // the projection is first materialised here
const TX       = T_ORIGIN;         // every transition is RECORDED at this instant
const R        = 3600;   // periodic re-materialisation interval  (FIXTURE CONSTANT)
const BOUND    = 600;    // A6's configured staleness bound       (FIXTURE CONSTANT, NOT judged)
const EARLY    = 10;     // query delta at which the periodic timer has NOT fired
const LATE     = R + 10; // query delta at which it HAS fired

/* ================================================================== *
 * 1. Ground truth — authorization decided ONLY against the KERNEL
 * ================================================================== */

// ADR-0020 §2: "A chunk's authorization constraints are EXACTLY those of its document version."
// So the fixture stores authorization facts on the VERSION, never on the chunk, and a projection
// that denormalises them onto a chunk row is holding a COPY that can go stale (EPA-0006 §3.3).
function authorizedByKernel(kernel, chunk, now) {
  const v = kernel.versions.get(chunk.version_id);
  if (!v) return false;
  return chunk.scope === SUBJECT.scope &&
         v.state === ANSWERABLE_STATE &&
         SUBJECT.classifications.includes(v.cls) &&
         v.eff_from <= now &&
         (v.eff_to === null || v.eff_to > now) &&
         v.audiences.some(a => SUBJECT.audiences.includes(a));
}

/* ================================================================== *
 * 2. Fixture — the policy under test, plus adversarial noise
 * ================================================================== */

const AUTH_BODY = (vid, i) =>
  `annual ${QUERY_TERM} entitlement policy ${vid} section ${i} ` +
  'paragraph describing accrual carry over approval routing and the ' +
  'responsibilities of the line manager and the human resources function';
const NOISE_BODY = () => `${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM}`;

// The five ways to be unauthorized, carried forward unchanged from TASK-0033/TASK-0035 so the
// noise cohort is the same shape the earlier probes used. Their CASES are not re-run; only the
// cohort construction is reused, as the task section directs.
const FAILURE_MODES = ['wrong-scope', 'wrong-audience', 'restricted-class', 'superseded', 'expired-effectivity'];

/*
 * Builds the kernel (authoritative) and the chunk store (the thing a projection projects).
 * `scenario` mutates the kernel by RECORDING transitions; nothing else may change a version.
 */
function buildFixture(M) {
  const versions = new Map();
  const chunks = [];
  let cid = 0;

  const addVersion = (version_id, policy_id, o) => {
    versions.set(version_id, {
      version_id, policy_id,
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

  // --- the policy under test: three versions of ONE document (ADR-0018 §1: document identity is
  //     stable; version identity is immutable and never edited in place) ---
  addVersion('V1', TARGET_POLICY, { state: 'PUBLISHED', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V2', TARGET_POLICY, { state: 'DRAFT', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addVersion('V3', TARGET_POLICY, { state: 'DRAFT', cls: 'INTERNAL',
    audiences: ['staff', 'all-employees'], eff_from: T_ORIGIN - 5000, eff_to: null });
  addChunks('V1', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V2', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);
  addChunks('V3', TARGET_POLICY, SUBJECT.scope, CHUNKS_PER_VERSION);

  // --- adversarial noise: M chunks that are unauthorized, one distinct failure mode each ---
  for (let m = 0; m < M; m++) {
    const mode = FAILURE_MODES[m % FAILURE_MODES.length];
    const vid = `N${m}`;
    const o = { state: 'PUBLISHED', cls: 'INTERNAL', audiences: ['staff'],
                eff_from: T_ORIGIN - 5000, eff_to: null };
    let scope = SUBJECT.scope;
    if (mode === 'wrong-scope')         scope = 'org-b';
    if (mode === 'wrong-audience')      o.audiences = ['executive'];
    if (mode === 'restricted-class')    o.cls = 'RESTRICTED';
    if (mode === 'superseded')          o.state = 'SUPERSEDED';
    // expired before the EARLIEST query instant in any scenario (T_BUILD + EARLY), not merely
    // before T_ORIGIN — the first draft of this fixture expired at T_ORIGIN-1 and was therefore
    // still effective when the probe queried, which the S8 adversarial precondition caught.
    if (mode === 'expired-effectivity') o.eff_to = T_BUILD - 500;
    addVersion(vid, `POL-N${m}`, o);
    chunks.push({ id: ++cid, policy_id: `POL-N${m}`, version_id: vid, scope, body: NOISE_BODY() });
  }

  return { versions, chunks, transitions: [], reachable: true };
}

/* --- the only legitimate way a version's state changes: a RECORDED transition --- */
function recordTransition(kernel, ctx, { kind, changes, recorded_at }) {
  for (const [vid, patch] of Object.entries(changes)) {
    Object.assign(kernel.versions.get(vid), patch, { recorded_at });
  }
  kernel.transitions.push({ seq: kernel.transitions.length + 1, kind, recorded_at,
                            versions: Object.keys(changes) });
  // MSG-0113 §2(2): "A policy transition must invalidate or supersede the retrievable prior
  // version AS PART OF THE RECORDED TRANSITION, rather than relying solely on a periodic timer."
  // A design with the hook re-materialises here; a design without it does not.
  if (ctx.design.transitionHook && ctx.design.materialised) materialise(ctx, recorded_at);
}

/* ================================================================== *
 * 3. Instrumentation — EPA-0006 §4.6 S5 / S7
 * ================================================================== */

function installCounters(db, isAuthorizedId) {
  const c = { seenCalls: 0, seenUnauth: new Set(), rankCalls: 0, rankUnauth: new Set(),
              kernelReads: 0 };
  db.function('probe_seen', { deterministic: false }, (id) => {
    c.seenCalls++;
    if (!isAuthorizedId(Number(id))) c.seenUnauth.add(Number(id));
    return 1;
  });
  db.function('probe_rank', { deterministic: true }, (id, body) => {
    c.rankCalls++;
    if (!isAuthorizedId(Number(id))) c.rankUnauth.add(Number(id));
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });
  c.reset = () => { c.seenCalls = 0; c.rankCalls = 0;
                    c.seenUnauth = new Set(); c.rankUnauth = new Set(); };
  return c;
}

const bind = (sql, all) =>
  Object.fromEntries(Object.entries(all).filter(([k]) => new RegExp(`:${k}\\b`).test(sql)));
const plan = (db, sql, params) =>
  db.prepare('EXPLAIN QUERY PLAN ' + sql).all(bind(sql, params)).map(r => r.detail);

/* ================================================================== *
 * 4. The projection — EPA-0006 §4.8 patterns I1+I2+I3+I4, held constant
 * ================================================================== */

const SAFE = (s) => String(s).replace(/[^a-z0-9]+/gi, '_').toLowerCase();

// Routing keys are COMPUTED from the requesting subject's entitlements alone and resolved by exact
// key. No catalogue is scanned. NOTE (EPA-0006 §4.9 G-Q4.4): the routing step is NOT INSTRUMENTED
// in this probe, so G-Q4 is NOT MEASURED here and this probe says so rather than implying a pass.
const ROUTE_KEYS = SUBJECT.classifications.flatMap(c =>
  SUBJECT.audiences.map(a => `${SUBJECT.scope}|${c}|${ANSWERABLE_STATE}|${a}`));

/*
 * Materialise the projection AS OF `atTime`, from the kernel and the chunk store.
 *
 * Only chunks whose version is PUBLISHED and effective AT THAT INSTANT are stored -- pattern I4,
 * whose refinement EPA-0006 §4.8 records as decaying from the instant onward. The partition key
 * carries scope, classification, lifecycle state and audience, so the routed structures contain no
 * row failing those conjuncts AS OF the materialisation instant.
 */
function materialise(ctx, atTime) {
  const { db, kernel, design } = ctx;

  // Retain what the previous materialisation held, before dropping it. Only design NC reads this;
  // it is that design's own "graceful degradation" store and exists to be demonstrated wrong.
  db.exec('DROP TABLE IF EXISTS prior_snapshot');
  db.exec(`CREATE TABLE prior_snapshot (chunk_id INTEGER, policy_id TEXT, version_id TEXT,
             scope TEXT, cls TEXT, state TEXT, eff_from INTEGER, eff_to INTEGER, body TEXT)`);
  for (const t of ctx.tables) {
    db.exec(`INSERT INTO prior_snapshot
             SELECT chunk_id, policy_id, ${design.versionIdentity ? 'version_id' : 'NULL'},
                    scope, cls, state, eff_from, eff_to, body FROM ${t}`);
  }
  for (const t of ctx.allTables) db.exec(`DROP TABLE IF EXISTS ${t}`);

  const made = new Map();
  const ensure = (key) => {
    if (made.has(key)) return made.get(key);
    const name = 'p_' + SAFE(key);
    db.exec(`CREATE TABLE ${name} (
       chunk_id INTEGER NOT NULL, policy_id TEXT NOT NULL,
       ${design.versionIdentity ? 'version_id TEXT NOT NULL,' : ''}
       scope TEXT NOT NULL, cls TEXT NOT NULL, state TEXT NOT NULL,
       eff_from INTEGER NOT NULL, eff_to INTEGER, body TEXT NOT NULL)`);
    const cols = design.versionIdentity ? '(?,?,?,?,?,?,?,?,?)' : '(?,?,?,?,?,?,?,?)';
    made.set(key, { name, stmt: db.prepare(`INSERT INTO ${name} VALUES ${cols}`) });
    return made.get(key);
  };

  for (const ch of kernel.chunks) {
    const v = kernel.versions.get(ch.version_id);
    if (v.state !== ANSWERABLE_STATE) continue;                       // I2 — lifecycle state
    if (!(v.eff_from <= atTime && (v.eff_to === null || v.eff_to > atTime))) continue;  // I4
    for (const aud of v.audiences) {                                  // I3 — one row per token
      const key = `${ch.scope}|${v.cls}|${v.state}|${aud}`;           // I1 — scope
      const s = ensure(key);
      const row = design.versionIdentity
        ? [ch.id, ch.policy_id, ch.version_id, ch.scope, v.cls, v.state, v.eff_from, v.eff_to, ch.body]
        : [ch.id, ch.policy_id, ch.scope, v.cls, v.state, v.eff_from, v.eff_to, ch.body];
      s.stmt.run(...row);
    }
  }

  ctx.allTables = [...made.values()].map(s => s.name);
  ctx.tables = ROUTE_KEYS.filter(k => made.has(k)).map(k => made.get(k).name);
  ctx.matAt = atTime;
  ctx.rebuilds++;
}

/* ================================================================== *
 * 5. Queries
 * ================================================================== */

// Effectivity at ANSWER time is left residual, evaluated against the projection's own copy. That
// is the better of the two available designs and it isolates this probe's variable: TASK-0035
// already measured what happens when effectivity decay alone is left unhandled, and that case is
// deliberately not re-run here.
const RESIDUAL_MAT = 'x.eff_from <= :T AND (x.eff_to IS NULL OR x.eff_to > :T)';

const unionOf = (ctx, tables, instrumented) =>
  tables.map(t =>
    `SELECT chunk_id, policy_id, ${ctx.design.versionIdentity ? 'version_id' : "NULL AS version_id"},
            cls, state, eff_from, eff_to, body FROM ${t}` +
    (instrumented ? ' WHERE probe_seen(chunk_id)' : '')).join(' UNION ALL ');

/*
 * placement 'structure' : probe_seen sits INSIDE each physical structure's scan, so it is called
 *                         once per row that scan surfaces. TASK-0035 established this is the
 *                         honest placement: an outer WHERE term written first is NOT evaluated
 *                         first, because SQLite reorders freely.
 * placement 'post'      : probe_seen is the last outer conjunct.
 * EPA-0006 §4.6 S7 requires the MAXIMUM across placements to be reported as U, as a LOWER BOUND.
 */
function matQuery(ctx, tables, placement) {
  if (placement === 'structure') {
    return `SELECT x.chunk_id, x.policy_id, x.version_id, x.cls, x.state, x.eff_from, x.eff_to, x.body
            FROM (${unionOf(ctx, tables, true)}) x
            WHERE ${RESIDUAL_MAT}
            GROUP BY x.chunk_id
            ORDER BY MAX(probe_rank(x.chunk_id, x.body)) DESC
            LIMIT :k`;
  }
  return `SELECT x.chunk_id, x.policy_id, x.version_id, x.cls, x.state, x.eff_from, x.eff_to, x.body
          FROM (${unionOf(ctx, tables, false)}) x
          WHERE (${RESIDUAL_MAT}) AND probe_seen(x.chunk_id)
          GROUP BY x.chunk_id
          ORDER BY MAX(probe_rank(x.chunk_id, x.body)) DESC
          LIMIT :k`;
}

// A0 — no projection at all: the query runs against the kernel-backed store, joining the
// authoritative version record at answer time. Every conjunct of the predicate is expressed
// in-query, so nothing is stale by construction.
function liveQuery(placement) {
  const seen = 'probe_seen(c.id)';
  const pred = `c.scope = :scope AND v.state = :state AND v.cls IN ('PUBLIC','INTERNAL')
                AND v.eff_from <= :T AND (v.eff_to IS NULL OR v.eff_to > :T)
                AND EXISTS (SELECT 1 FROM k_audience a
                            WHERE a.version_id = v.version_id
                              AND a.audience IN ('staff','all-employees'))`;
  const where = placement === 'pre' ? `${seen} AND (${pred})` : `(${pred}) AND ${seen}`;
  return `SELECT c.id AS chunk_id, c.policy_id, c.version_id, v.cls, v.state,
                 v.eff_from, v.eff_to, c.body
          FROM c_chunk c JOIN k_version v ON v.version_id = c.version_id
          WHERE ${where}
          GROUP BY c.id
          ORDER BY MAX(probe_rank(c.id, c.body)) DESC
          LIMIT :k`;
}

const FALLBACK_SQL = `
  SELECT x.chunk_id, x.policy_id, x.version_id, x.cls, x.state, x.eff_from, x.eff_to, x.body
  FROM (SELECT * FROM prior_snapshot WHERE probe_seen(chunk_id)) x
  GROUP BY x.chunk_id
  ORDER BY MAX(probe_rank(x.chunk_id, x.body)) DESC
  LIMIT :k`;

/* ================================================================== *
 * 6. The answer path — one implementation, parameterised by design
 * ================================================================== */

function currentPublishedVersion(ctx, policyId, now) {
  ctx.counters.kernelReads++;
  const hits = ctx.db.prepare(
    `SELECT version_id FROM k_version
     WHERE policy_id = :p AND state = :s AND eff_from <= :T AND (eff_to IS NULL OR eff_to > :T)`
  ).all({ p: policyId, s: ANSWERABLE_STATE, T: now });
  // ADR-0018 §5: "at most one PUBLISHED version of a document may be effective at any instant.
  // Two simultaneously effective versions is a data defect that must fail ingestion loudly."
  if (hits.length > 1) {
    say(`      !! ADR-0018 §5 VIOLATED IN FIXTURE: ${hits.length} effective PUBLISHED versions of ` +
        `${policyId}. The run is VOID.`);
    process.exit(1);
  }
  return hits.length ? hits[0].version_id : null;
}

// EPA-0006 §4.9 G-Q5.2b — the limb most easily faked. 'kernel' re-authorizes against the truth;
// 'self' re-authorizes the stale copy against its own columns and is a no-op.
function recheck(ctx, hit, now) {
  const d = ctx.design;
  if (d.recheck === 'none') return true;
  if (d.recheck === 'self') {
    return SUBJECT.classifications.includes(hit.cls) &&
           hit.state === ANSWERABLE_STATE &&
           hit.eff_from <= now && (hit.eff_to === null || hit.eff_to > now);
  }
  if (hit.version_id == null) return false;   // cannot re-check what carries no version identity
  ctx.counters.kernelReads++;
  const v = ctx.db.prepare('SELECT * FROM k_version WHERE version_id = :v').get({ v: hit.version_id });
  if (!v) return false;
  ctx.counters.kernelReads++;
  const auds = ctx.db.prepare('SELECT audience FROM k_audience WHERE version_id = :v')
                     .all({ v: hit.version_id }).map(r => r.audience);
  return v.state === ANSWERABLE_STATE &&
         SUBJECT.classifications.includes(v.cls) &&
         v.eff_from <= now && (v.eff_to === null || v.eff_to > now) &&
         auds.some(a => SUBJECT.audiences.includes(a));
}

function answerPath(ctx, now, placement) {
  const d = ctx.design;
  const p = { scope: SUBJECT.scope, state: ANSWERABLE_STATE, T: now, k: K };
  ctx.counters.reset();
  ctx.counters.kernelReads = 0;
  const trace = [];

  // ---- 1. refresh phase -------------------------------------------------
  if (d.materialised) {
    if (d.periodic !== null && now >= ctx.matAt + d.periodic) {
      materialise(ctx, now);
      trace.push(`periodic refresh fired at ${now}`);
    }
    // EPA-0006 §4.9 G-Q5.1b/c — the bound is computed from a clock the candidate does not control
    // (the caller's `now`) and the materialisation instant, NOT from the structure's own contents.
    if (d.bound !== null && now - ctx.matAt > d.bound) {
      trace.push(`staleness ${now - ctx.matAt} > bound ${d.bound}`);
      return { outcome: 'ABSTAIN', code: A7, why: 'staleness bound breached', hits: [], trace, plan: [] };
    }
  }

  // ---- 2. establish the current published, effective version -------------
  let current;
  if (d.consultsKernel) {
    if (!ctx.kernel.reachable) {
      trace.push('kernel unreachable');
      if (d.onMissingCurrent === 'fallback') return fallback(ctx, p, trace, 'kernel unreachable');
      return { outcome: 'ABSTAIN', code: A7, why: 'current version cannot be established', hits: [], trace, plan: [] };
    }
    current = currentPublishedVersion(ctx, TARGET_POLICY, now);
    trace.push(`kernel says current=${current ?? 'NONE'}`);
    if (current === null) {
      if (d.onMissingCurrent === 'fallback') return fallback(ctx, p, trace, 'no current version');
      // ADR-0018 §4: a policy with no effective published version is a gap -> A4, "never a licence
      // to fall back to the expired text".
      return { outcome: 'ABSTAIN', code: A4, why: 'no published effective version', hits: [], trace, plan: [] };
    }
  }

  // ---- 3. retrieve -------------------------------------------------------
  // The routed set can legitimately be EMPTY — a transition that leaves the subject's partitions
  // with no qualifying row creates no structure to open. That is not an error and not an answer:
  // it is zero hits, and step 5 decides what the answer path owes the employee because of it.
  let raw, qplan;
  if (d.materialised && ctx.tables.length === 0) {
    raw = [];
    qplan = ['(no routed structure exists at this instant — nothing was opened)'];
    trace.push('routed set is empty');
  } else {
    const sql = d.materialised ? matQuery(ctx, ctx.tables, placement) : liveQuery(placement);
    raw = ctx.db.prepare(sql).all(bind(sql, p));
    qplan = plan(ctx.db, sql, p);
  }

  // ---- 4. post-retrieval re-check (ADR-0020 §3 point 2) ------------------
  const kept = raw.filter(h => recheck(ctx, h, now));
  const rejected = raw.length - kept.length;
  if (d.recheck !== 'none') trace.push(`re-check(${d.recheck}) kept ${kept.length}/${raw.length}`);

  // ---- 5. availability of the current version ----------------------------
  if (d.consultsKernel) {
    const have = kept.some(h => h.version_id === current);
    if (!have) {
      trace.push(`no hit for current version ${current}`);
      if (d.onMissingCurrent === 'fallback') return fallback(ctx, p, trace, 'current version unavailable');
      // ADR-0020 §1: a projection that cannot supply the current version is degraded -> A7,
      // "never a stale answer".
      return { outcome: 'ABSTAIN', code: A7, why: 'current version unavailable to retrieval',
               hits: [], trace, plan: qplan, rejected };
    }
  }

  return { outcome: 'ANSWER', code: null, why: null, hits: kept, trace, plan: qplan, rejected };
}

// Design NC only. "Graceful degradation": serve the last thing the projection is known to have
// held. It is the negative control and it must FAIL (EPA-0006 §4.6 S8).
function fallback(ctx, p, trace, why) {
  trace.push(`FALLBACK to retained prior snapshot (${why})`);
  const raw = ctx.db.prepare(FALLBACK_SQL).all(bind(FALLBACK_SQL, p));
  return { outcome: 'ANSWER', code: null, why: `fallback: ${why}`, hits: raw, trace, plan: [] };
}

/* ================================================================== *
 * 7. Designs — architectures, not products
 * ================================================================== */

const DESIGNS = [
  { id: 'A0', materialised: false, versionIdentity: true, periodic: null, transitionHook: false,
    consultsKernel: true, recheck: 'kernel', bound: null, onMissingCurrent: 'abstain',
    label: 'live kernel-backed store, no projection' },
  { id: 'A1', materialised: true, versionIdentity: false, periodic: R, transitionHook: false,
    consultsKernel: false, recheck: 'none', bound: null, onMissingCurrent: 'answer',
    label: 'materialised+partitioned, NO version identity, periodic refresh only' },
  { id: 'A2', materialised: true, versionIdentity: true, periodic: R, transitionHook: false,
    consultsKernel: false, recheck: 'none', bound: null, onMissingCurrent: 'answer',
    label: 'as A1 + version identity carried in the structure' },
  { id: 'A3', materialised: true, versionIdentity: true, periodic: R, transitionHook: true,
    consultsKernel: false, recheck: 'none', bound: null, onMissingCurrent: 'answer',
    label: 'as A2 + transition-triggered re-materialisation' },
  { id: 'A4', materialised: true, versionIdentity: true, periodic: R, transitionHook: true,
    consultsKernel: true, recheck: 'kernel', bound: null, onMissingCurrent: 'abstain',
    label: 'as A3 + kernel consult and ADR-0020 §3.2 re-check against the KERNEL' },
  { id: 'A5', materialised: true, versionIdentity: true, periodic: R, transitionHook: true,
    consultsKernel: true, recheck: 'self', bound: null, onMissingCurrent: 'abstain',
    label: 'as A4 but the re-check reads the MATERIALISED COPY (G-Q5.2b faked limb)' },
  { id: 'A6', materialised: true, versionIdentity: true, periodic: R, transitionHook: true,
    consultsKernel: true, recheck: 'kernel', bound: BOUND, onMissingCurrent: 'abstain',
    label: 'as A4 + a configured staleness bound enforced against an external clock' },
  { id: 'NC', materialised: true, versionIdentity: true, periodic: R, transitionHook: true,
    consultsKernel: true, recheck: 'kernel', bound: null, onMissingCurrent: 'fallback',
    label: 'NEGATIVE CONTROL — as A4 but falls back to the retained prior snapshot' },
];

/* ================================================================== *
 * 8. Scenarios — the transitions MSG-0113 §3 requires
 * ================================================================== */

const SCENARIOS = [
  { id: 'S0', name: 'no transition — V1 published and effective',
    now: T_BUILD + EARLY, apply: () => null,
    expect: { outcome: 'ANSWER', versions: ['V1'] } },

  { id: 'S1', name: 'V2 APPROVED but NOT published (ADR-0018 §2: not answerable)',
    now: TX + EARLY,
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'approve', recorded_at: TX,
      changes: { V2: { state: 'APPROVED' } } }),
    expect: { outcome: 'ANSWER', versions: ['V1'] } },

  { id: 'S2', name: 'V2 PUBLISHED, V1 SUPERSEDED — queried BEFORE the periodic timer fires',
    now: TX + EARLY,
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'publish/supersede', recorded_at: TX,
      changes: { V2: { state: 'PUBLISHED' }, V1: { state: 'SUPERSEDED', eff_to: TX } } }),
    expect: { outcome: 'ANSWER', versions: ['V2'] } },

  { id: 'S3', name: 'the same transition — queried AFTER the periodic timer fires (the naive test)',
    now: TX + LATE,
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'publish/supersede', recorded_at: TX,
      changes: { V2: { state: 'PUBLISHED' }, V1: { state: 'SUPERSEDED', eff_to: TX } } }),
    expect: { outcome: 'ANSWER', versions: ['V2'] } },

  { id: 'S4', name: 'V1 WITHDRAWN with no successor (ADR-0018 §2: dropped from the projection)',
    now: TX + EARLY,
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'withdraw', recorded_at: TX,
      changes: { V1: { state: 'WITHDRAWN', eff_to: TX } } }),
    expect: { outcome: 'ABSTAIN', versions: [] } },

  { id: 'S5', name: 'supersession chain — V2 already current, V3 published and V2 SUPERSEDED',
    now: TX + EARLY,
    pre: (k) => {   // recorded BEFORE the projection is first built, so every design holds V2
      Object.assign(k.versions.get('V2'), { state: 'PUBLISHED' });
      Object.assign(k.versions.get('V1'), { state: 'SUPERSEDED', eff_to: T_BUILD - 500 });
    },
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'supersede', recorded_at: TX,
      changes: { V3: { state: 'PUBLISHED' }, V2: { state: 'SUPERSEDED', eff_to: TX } } }),
    expect: { outcome: 'ANSWER', versions: ['V3'] } },

  { id: 'S6', name: 'V2 published but its chunks are ABSENT from retrieval (ingestion lag)',
    now: TX + EARLY,
    pre: (k) => { k.chunks = k.chunks.filter(c => c.version_id !== 'V2'); },
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'publish/supersede', recorded_at: TX,
      changes: { V2: { state: 'PUBLISHED' }, V1: { state: 'SUPERSEDED', eff_to: TX } } }),
    expect: { outcome: 'ABSTAIN', versions: [] } },

  { id: 'S7', name: 'the same transition, but the KERNEL IS UNREACHABLE at answer time',
    now: TX + EARLY,
    apply: (k, ctx) => { recordTransition(k, ctx, { kind: 'publish/supersede', recorded_at: TX,
      changes: { V2: { state: 'PUBLISHED' }, V1: { state: 'SUPERSEDED', eff_to: TX } } });
      k.reachable = false; },
    expect: { outcome: 'ABSTAIN', versions: [] } },

  { id: 'S8', name: 'NO version transition — the KERNEL authorization facts for V1 change (EPA-0006 §3.3)',
    now: TX + EARLY,
    apply: (k, ctx) => recordTransition(k, ctx, { kind: 'reclassify', recorded_at: TX,
      changes: { V1: { cls: 'RESTRICTED' } } }),
    expect: { outcome: 'ABSTAIN', versions: [] } },

  /*
   * S8 above changes the kernel through a RECORDED transition, so every design whose invalidation
   * hook is wired to transitions re-materialises and is saved by the hook rather than by its
   * re-check. S8b is the same authorization change delivered as an attribute reassignment the
   * hook is NOT wired to observe -- which is the ordinary case EPA-0006 §3.3 describes, and the
   * only one in which the ADR-0020 §3 point-2 re-check is the sole remaining control.
   *
   * A transition-triggered hook is only as complete as the set of changes it is wired to.
   */
  { id: 'S8b', name: 'the same authorization change, NOT wired to the invalidation hook (§3.2 re-check is the only control left)',
    now: TX + EARLY,
    apply: (k) => { k.versions.get('V1').cls = 'RESTRICTED'; },
    expect: { outcome: 'ABSTAIN', versions: [] } },

  { id: 'S9', name: 'no transition — the clock passes the configured staleness bound (G-Q5.1c)',
    now: T_BUILD + 900, apply: () => null,
    expect: { outcome: 'ABSTAIN', versions: [] }, materialisedOnly: true },
];

/* ================================================================== *
 * 9. Execute
 * ================================================================== */

say('='.repeat(100));
say('TASK-0037 — version-transition freshness and stale-version fail-closed probe (EVALUATION ONLY)');
say('='.repeat(100));
{
  const d = new DatabaseSync(':memory:');
  say(`engine under test : SQLite ${d.prepare('select sqlite_version() v').get().v} (embedded, node:sqlite)`);
  say(`node              : ${process.version}`);
  d.close();
}
say('EPA-0006 class    : R (relational). Classes S and V are unreachable on this host and K has no');
say('                    PostgreSQL here. This probe measures ONE class and claims nothing beyond it.');
say('');
say('--- Held constant across every design and scenario ---');
say(`subject           : ${j(SUBJECT)}`);
say(`answerable state  : ${ANSWERABLE_STATE}   (ADR-0018 §2 — the ONLY answerable state)`);
say(`target policy     : ${TARGET_POLICY}, three versions V1/V2/V3, ${CHUNKS_PER_VERSION} chunks each`);
say(`physical design   : EPA-0006 §4.8 I1+I2+I3+I4, routed by exact key from the subject's entitlements`);
say(`k                 : ${K}`);
say('');
say('--- Fixture clock (integers; no wall-clock is read and no timing is measured) ---');
say(`projection first materialised at T_BUILD = ${T_BUILD}`);
say(`every transition RECORDED at            TX = ${TX}`);
say(`periodic re-materialisation interval     R = ${R}   (FIXTURE CONSTANT)`);
say(`A6's configured staleness bound      BOUND = ${BOUND}   (FIXTURE CONSTANT — magnitude NOT judged,`);
say('                                                 NOT proposed and NOT recommended; EPA-0006 §4.9 G-Q5.1a)');
say(`query delta with the timer NOT fired EARLY = ${EARLY}`);
say(`query delta with the timer fired      LATE = ${LATE}`);

const M_VALUES = [50, 500, 5000];
const records = [];

for (const M of M_VALUES) {
  say('');
  say('#'.repeat(100));
  say(`FIXTURE  M=${M} unauthorized noise chunks · ${3 * CHUNKS_PER_VERSION} policy chunks`);
  say('#'.repeat(100));

  /* --- adversarial precondition (EPA-0006 §4.6 S8), before any measurement --- */
  {
    const k0 = buildFixture(M);
    const db = new DatabaseSync(':memory:');
    db.exec('CREATE TABLE c_chunk (id INTEGER PRIMARY KEY, policy_id TEXT, version_id TEXT, scope TEXT, body TEXT)');
    db.exec('CREATE VIRTUAL TABLE fts USING fts5(body)');
    const ic = db.prepare('INSERT INTO c_chunk VALUES (?,?,?,?,?)');
    const iff = db.prepare('INSERT INTO fts(rowid,body) VALUES (?,?)');
    for (const c of k0.chunks) { ic.run(c.id, c.policy_id, c.version_id, c.scope, c.body); iff.run(c.id, c.body); }
    const bare = db.prepare(`SELECT c.id FROM fts JOIN c_chunk c ON c.id = fts.rowid
                             WHERE fts MATCH :q ORDER BY bm25(fts) ASC LIMIT :k`)
                   .all({ q: QUERY_TERM, k: K }).map(r => Number(r.id));
    const authAmong = bare.filter(id => {
      const ch = k0.chunks.find(c => c.id === id);
      return authorizedByKernel(k0, ch, T_BUILD + EARLY);
    }).length;
    say(`precondition (unconstrained lexical top-${K}) : ids=${j(bare)} authorized-among-them=${authAmong}` +
        ` -> ${authAmong === 0 ? 'ADVERSARIAL, as required' : 'NOT ADVERSARIAL — the run is VOID'}`);
    if (authAmong !== 0) { say('ABORTING: fixture is not adversarial.'); process.exit(1); }
    db.close();
  }

  for (const sc of SCENARIOS) {
    if (M === 500) { say(''); say(`--- ${sc.id}: ${sc.name}   (query at now=${sc.now}) ---`); }

    for (const design of DESIGNS) {
      if (sc.materialisedOnly && !design.materialised) {
        records.push({ M, sc: sc.id, design: design.id, na: true });
        if (M === 500) say(`  [${design.id}] n/a — not materialised, so no staleness bound applies`);
        continue;
      }

      /* ---- construct an isolated world per (design, scenario, M) ---- */
      const kernel = buildFixture(M);
      if (sc.pre) sc.pre(kernel);

      const db = new DatabaseSync(':memory:');
      const ctx = { db, kernel, design, tables: [], allTables: [], matAt: null,
                    rebuilds: 0, counters: null };

      // the kernel and chunk store, as tables so the re-check's access path is inspectable
      db.exec(`CREATE TABLE k_version (version_id TEXT PRIMARY KEY, policy_id TEXT NOT NULL,
                 state TEXT NOT NULL, cls TEXT NOT NULL, eff_from INTEGER NOT NULL,
                 eff_to INTEGER, recorded_at INTEGER NOT NULL);
               CREATE TABLE k_audience (version_id TEXT NOT NULL, audience TEXT NOT NULL);
               CREATE INDEX i_kaud ON k_audience(version_id, audience);
               CREATE TABLE c_chunk (id INTEGER PRIMARY KEY, policy_id TEXT NOT NULL,
                 version_id TEXT NOT NULL, scope TEXT NOT NULL, body TEXT NOT NULL);
               CREATE TABLE prior_snapshot (chunk_id INTEGER, policy_id TEXT, version_id TEXT,
                 scope TEXT, cls TEXT, state TEXT, eff_from INTEGER, eff_to INTEGER, body TEXT)`);

      const syncKernel = () => {
        db.exec('DELETE FROM k_version; DELETE FROM k_audience');
        const iv = db.prepare('INSERT INTO k_version VALUES (?,?,?,?,?,?,?)');
        const ia = db.prepare('INSERT INTO k_audience VALUES (?,?)');
        for (const v of kernel.versions.values()) {
          iv.run(v.version_id, v.policy_id, v.state, v.cls, v.eff_from, v.eff_to, v.recorded_at);
          for (const a of v.audiences) ia.run(v.version_id, a);
        }
      };
      const syncChunks = () => {
        db.exec('DELETE FROM c_chunk');
        const ic = db.prepare('INSERT INTO c_chunk VALUES (?,?,?,?,?)');
        for (const c of kernel.chunks) ic.run(c.id, c.policy_id, c.version_id, c.scope, c.body);
      };
      syncKernel(); syncChunks();

      // authorization at ANSWER time, decided only against the kernel — this is the harness's
      // ground truth and is never visible to the design under test
      const chunkById = new Map(kernel.chunks.map(c => [c.id, c]));
      const authorizedAtAnswer = new Set();
      ctx.counters = installCounters(db, (id) => authorizedAtAnswer.has(id));

      // ---- build the projection at T_BUILD, then record the transition ----
      if (design.materialised) materialise(ctx, T_BUILD);
      else { ctx.matAt = null; }
      const builtAt = ctx.matAt;
      const rebuildsAfterBuild = ctx.rebuilds;

      if (sc.apply) sc.apply(kernel, ctx);
      syncKernel();   // the recorded transition is now visible in the authoritative record

      // ground truth is computed AFTER the transition, at the query instant
      for (const c of kernel.chunks) if (authorizedByKernel(kernel, c, sc.now)) authorizedAtAnswer.add(c.id);

      const placements = design.materialised ? ['structure', 'post'] : ['pre', 'post'];
      const runs = {};
      let res = null;
      for (const pl of placements) {
        // each placement re-runs the same answer path; the refresh phase is idempotent for a fixed
        // `now`, so the only difference between runs is where the instrument sits
        const snapshotMatAt = ctx.matAt, snapshotTables = ctx.tables.slice();
        const r = answerPath(ctx, sc.now, pl);
        runs[pl] = { U: ctx.counters.seenUnauth.size, seen: ctx.counters.seenCalls,
                     Ubody: ctx.counters.rankUnauth.size, kernelReads: ctx.counters.kernelReads,
                     outcome: r.outcome, code: r.code };
        if (res === null) res = r;
        if (pl === placements[0]) { /* keep the first run's result as the reported one */ }
        void snapshotMatAt; void snapshotTables;
      }

      const U = Math.max(...Object.values(runs).map(r => r.U));
      const versionsReturned = [...new Set(res.hits.map(h =>
        h.version_id ?? (chunkById.get(Number(h.chunk_id))?.version_id ?? '?')))].sort();
      const versionsAsDesignSeesThem = design.versionIdentity
        ? versionsReturned : ['(design carries no version identity)'];
      const leaked = res.hits.filter(h => !authorizedAtAnswer.has(Number(h.chunk_id)));
      const leakVersions = [...new Set(leaked.map(h =>
        chunkById.get(Number(h.chunk_id))?.version_id ?? '?'))].sort();

      const outcomeOk = res.outcome === sc.expect.outcome &&
        (sc.expect.outcome !== 'ANSWER' ||
         (versionsReturned.length === sc.expect.versions.length &&
          sc.expect.versions.every(v => versionsReturned.includes(v))));
      const pass = outcomeOk && leaked.length === 0;

      records.push({ M, sc: sc.id, design: design.id, U,
                     kernelReads: Object.values(runs).map(r => r.kernelReads).reduce((a, b) => Math.max(a, b), 0),
                     outcome: res.outcome, code: res.code, matAt: ctx.matAt, builtAt,
                     rebuilds: ctx.rebuilds - rebuildsAfterBuild,
                     versions: versionsReturned, leak: leaked.length, leakVersions,
                     outcomeOk, pass, plan: res.plan, trace: res.trace,
                     designSees: versionsAsDesignSeesThem });

      if (M === 500) {
        const verdict = pass ? 'PASS' : (leaked.length ? `LEAK(${leakVersions.join(',')})` : 'WRONG-OUTCOME');
        say(`  [${design.id}] ${pad(res.outcome + (res.code ? `/${res.code}` : ''), 12)} ` +
            `versions=${pad(j(versionsReturned), 14)} leak=${rpad(leaked.length, 2)} ` +
            `U=${rpad(U, 5)} kernel-reads=${rpad(Object.values(runs).map(r => r.kernelReads).reduce((a, b) => Math.max(a, b), 0), 4)} ` +
            `mat@${pad(ctx.matAt ?? 'n/a', 11)} -> ${verdict}`);
        if (res.trace.length) say(`        trace: ${res.trace.join(' | ')}`);
      }
      db.close();
    }
  }
}

/* ================================================================== *
 * 10. Summaries
 * ================================================================== */

const cell = (r) => r.na ? ' - ' : r.pass ? ' . ' : (r.leak ? ' L ' : ' X ');

say('');
say('='.repeat(100));
say('PASS / FAIL GRID    "." pass   "L" leaked a version the kernel does not authorize at answer time');
say('                    "X" wrong outcome (answered where abstention is required, or wrong version)');
say('                    "-" not applicable');
say('='.repeat(100));
for (const M of M_VALUES) {
  say('');
  say(`  M=${M}`);
  say(`  design  ${SCENARIOS.map(s => pad(s.id, 4)).join('')}`);
  for (const d of DESIGNS) {
    const row = SCENARIOS.map(s => {
      const r = records.find(x => x.M === M && x.sc === s.id && x.design === d.id);
      return pad(cell(r), 4);
    }).join('');
    const passes = SCENARIOS.filter(s => {
      const r = records.find(x => x.M === M && x.sc === s.id && x.design === d.id);
      return r && !r.na && r.pass;
    }).length;
    const applicable = SCENARIOS.filter(s => {
      const r = records.find(x => x.M === M && x.sc === s.id && x.design === d.id);
      return r && !r.na;
    }).length;
    say(`  ${pad(d.id, 7)} ${row}   ${passes}/${applicable}`);
  }
}

say('');
say('  design  description');
for (const d of DESIGNS) say(`  ${pad(d.id, 7)} ${d.label}`);
say('');
say('  scenario  description');
for (const s of SCENARIOS) say(`  ${pad(s.id, 9)} ${s.name}`);

say('');
say('='.repeat(100));
say('THE DISCRIMINATOR (MSG-0113 §3): transition-triggered freshness vs periodic re-materialisation');
say('S2 and S3 are THE SAME RECORDED TRANSITION. Only the query instant differs: in S2 the periodic');
say('timer has NOT fired, in S3 it has. A design that passes S3 but fails S2 was never made correct');
say('by the transition — it was made correct by waiting.');
say('='.repeat(100));
say('');
say('  design  S2 (timer NOT fired)          S3 (timer fired)              reading');
for (const d of DESIGNS) {
  const r2 = records.find(x => x.M === 500 && x.sc === 'S2' && x.design === d.id);
  const r3 = records.find(x => x.M === 500 && x.sc === 'S3' && x.design === d.id);
  const f = (r) => `${r.outcome}${r.code ? '/' + r.code : ''} ${j(r.versions)}${r.leak ? ` LEAK` : ''}`;
  const reading = (!r2.pass && r3.pass) ? 'DISCRIMINATED — a fixed-time test alone would have cleared it'
                : (r2.pass && r3.pass) ? 'transition-triggered — correct before the timer could fire'
                : 'fails both';
  say(`  ${pad(d.id, 7)} ${pad(f(r2), 30)} ${pad(f(r3), 29)} ${reading}`);
}

say('');
say('='.repeat(100));
say('U — unauthorized units EXAMINED during retrieval, by design (max over instrument placements)');
say('EPA-0006 §4.6 S3: CLEARED requires U = 0 at every measured N, shown invariant with N.');
say('S5 is used here because it is the scenario in which every design retrieves something.');
say('='.repeat(100));
say('');
say('  design  M=50      M=500     M=5000    invariant-with-N');
for (const d of DESIGNS) {
  const us = M_VALUES.map(M => records.find(x => x.M === M && x.sc === 'S5' && x.design === d.id)?.U);
  if (us.some(u => u === undefined)) continue;
  say(`  ${pad(d.id, 7)} ${rpad(us[0], 9)} ${rpad(us[1], 9)} ${rpad(us[2], 9)} ` +
      `${new Set(us).size === 1 ? 'yes' : 'NO — grows with N'}`);
}

say('');
say('  The S5 slice above is NOT the whole story, and a verdict must not rest on it. EPA-0006 §4.6 S3');
say('  requires U = 0 at every measured N; a design with U = 0 in one scenario and U > 0 in another');
say('  has not met the bar. The maximum over ALL scenarios is therefore the figure that decides E2:');
say('');
say('  design  max-U over all scenarios          worst scenario(s)');
for (const d of DESIGNS) {
  const mine = records.filter(r => r.design === d.id && !r.na);
  const maxU = Math.max(...mine.map(r => r.U));
  const worst = [...new Set(mine.filter(r => r.U === maxU).map(r => r.sc))].join(',');
  const perM = M_VALUES.map(M => Math.max(...mine.filter(r => r.M === M).map(r => r.U)));
  say(`  ${pad(d.id, 7)} ${pad(perM.map((u, i) => `M=${M_VALUES[i]}:${u}`).join('  '), 34)} ${worst}`);
}

say('');
say('='.repeat(100));
say('ANSWERED-NOTHING vs ABSTAINED — they are different states and only one is fail-closed');
say('An empty answer is indistinguishable, to the employee, from "no policy covers this".');
say('='.repeat(100));
say('');
say('  design  cases where abstention was required and the design ANSWERED instead');
for (const d of DESIGNS) {
  const bad = records.filter(r => r.design === d.id && !r.na && !r.outcomeOk &&
                                  r.outcome === 'ANSWER' && r.M === 500);
  const empty = bad.filter(r => r.versions.length === 0).map(r => r.sc);
  const nonEmpty = bad.filter(r => r.versions.length > 0).map(r => r.sc);
  say(`  ${pad(d.id, 7)} answered-empty: ${pad(empty.length ? empty.join(',') : 'none', 22)}` +
      ` answered-with-content: ${nonEmpty.length ? nonEmpty.join(',') : 'none'}`);
}

say('');
say('='.repeat(100));
say('KERNEL READS during the answer path — max over placements, S5, counted at the HARNESS call site');
say('(EPA-0006 §4.6 S7: the placement is recorded; this is not an engine-internal counter)');
say('='.repeat(100));
say('');
say('  design  M=50      M=500     M=5000    invariant-with-N');
for (const d of DESIGNS) {
  const ks = M_VALUES.map(M => records.find(x => x.M === M && x.sc === 'S5' && x.design === d.id)?.kernelReads);
  if (ks.some(k => k === undefined)) continue;
  say(`  ${pad(d.id, 7)} ${rpad(ks[0], 9)} ${rpad(ks[1], 9)} ${rpad(ks[2], 9)} ` +
      `${new Set(ks).size === 1 ? 'yes' : 'NO — grows with N'}`);
}

say('');
say('='.repeat(100));
say('MATERIALISATION INSTANT for every case at M=500 (EPA-0006 §4.9 G-Q5.1d: a U figure reported');
say('without the instant it was taken at is not interpretable and does not count)');
say('='.repeat(100));
say('');
say('  design  scenario  built-at     mat-at       rebuilds-after-build  U');
for (const d of DESIGNS) {
  for (const s of SCENARIOS) {
    const r = records.find(x => x.M === 500 && x.sc === s.id && x.design === d.id);
    if (!r || r.na) continue;
    say(`  ${pad(d.id, 7)} ${pad(s.id, 9)} ${pad(r.builtAt ?? 'n/a', 12)} ${pad(r.matAt ?? 'n/a', 12)} ` +
        `${rpad(r.rebuilds, 20)}  ${r.U}`);
  }
}

say('');
say('='.repeat(100));
say('E1 — traversal-bounding evidence: the query plan actually used, S5 at M=500');
say('='.repeat(100));
for (const d of DESIGNS) {
  const r = records.find(x => x.M === 500 && x.sc === 'S5' && x.design === d.id);
  if (!r) continue;
  say('');
  say(`  [${d.id}]`);
  if (!r.plan.length) say('        (no retrieval query was issued — the answer path abstained first)');
  for (const line of r.plan.slice(0, 6)) say(`        ${line}`);
  if (r.plan.length > 6) say(`        … ${r.plan.length - 6} further plan rows`);
}

say('');
say('='.repeat(100));
say('NEGATIVE CONTROL CHECK (EPA-0006 §4.6 S8) — if NC does not fail, the run is VOID');
say('='.repeat(100));
{
  const ncFails = records.filter(r => r.design === 'NC' && !r.na && !r.pass);
  const ncLeaks = ncFails.filter(r => r.leak > 0);
  say('');
  say(`  NC failing cases  : ${ncFails.length} of ${records.filter(r => r.design === 'NC' && !r.na).length}`);
  say(`  NC leaking cases  : ${ncLeaks.length}` +
      (ncLeaks.length ? `  (${[...new Set(ncLeaks.map(r => `${r.sc}:${r.leakVersions.join('/')}`))].join(', ')})` : ''));
  say(`  verdict           : ${ncLeaks.length > 0 ? 'the control FAILS as required — the run is VALID'
                                                  : 'the control did NOT fail — the run is VOID'}`);
  if (ncLeaks.length === 0) { say('ABORTING: negative control did not fail.'); process.exit(1); }
}

say('');
say('='.repeat(100));
say('MSG-0113 §3 EVIDENCE ITEMS — demonstrated, or explicitly recorded as not demonstrated');
say('='.repeat(100));
const ev = [
  ['1', 'an approved-version transition V1 -> V2', 'S1/S2/S3 recorded a publish/supersede transition'],
  ['2', 'V1 is usable BEFORE the transition', 'S0'],
  ['3', 'after the transition is recorded, V1 is NOT usable', 'S2 — per design; see the grid'],
  ['4', 'V2 is used when available', 'S2/S3 — per design'],
  ['5', 'if V2 is unavailable, retrieval/answering ABSTAINS', 'S6 — per design'],
  ['6', 'revocation and supersession exercise the same fail-closed behaviour', 'S4 (WITHDRAWN) and S5 (supersession chain)'],
  ['7', 'the kernel re-check observes the authoritative lifecycle/version state', 'S8 — the re-check must REJECT (G-Q5.2c)'],
  ['8', 'a materialised/partitioned index does not permit stale V1 use after the transition', 'S2 against the I1+I2+I3+I4 projection'],
];
say('');
for (const [n, item, where] of ev) say(`  §3.${n}  ${pad(item, 72)} ${where}`);

say('');
say('='.repeat(100));
say('END OF PROBE — no engine, runtime, provider, model, index technology or physical implementation');
say('selected, adopted, recommended, installed or deployed. No numeric staleness threshold is');
say('proposed. Verdicts are recorded in the COMMS execution record.');
say('='.repeat(100));
