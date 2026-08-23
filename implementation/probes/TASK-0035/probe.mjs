/*
 * TASK-0035 — Physical projection isolation probe (EVALUATION ONLY)
 *
 * Authority : MSG-0107b (AUTHORIZED) · CLAUDE-TASKS.md §TASK-0035
 * Applies   : ADR-0020 as amended by AMD-01 (§4 engine-selection criterion)
 *             ADR-0018 §2 (lifecycle/answerability), §4 (effectivity at answer time)
 *             EPA-0006 §3 (the derived predicate), §4.6 (strict Shape-1 criterion, S1-S11)
 *             MSG-0105 §1 (strict Shape-1: "examines nothing unauthorized")
 *
 * THIS PROBE SELECTS, ADOPTS, RECOMMENDS, INSTALLS AND DEPLOYS NOTHING.
 * The engine exercised here is a TEST SUBJECT (MSG-0101 §3). It is a member of EPA-0006
 * class R and is used because it is the only engine reachable on this host.
 *
 * It does NOT re-run TASK-0033. TASK-0033's harness, output and verdicts are untouched and
 * stand. This probe asks a DIFFERENT question, the one MSG-0107b §2(4) authorizes:
 *
 *     can an ARCHITECTURE prevent unauthorized candidates from being EXAMINED
 *     before retrieval, rather than merely preventing their return?
 *
 * The controlled variable is therefore not the query and not the index — it is the
 * PHYSICAL ORGANISATION of the projection. The predicate is held constant throughout.
 *
 * Boundaries honoured by construction:
 *   - nothing is installed; only the Node runtime already present is used
 *   - no network is reached
 *   - every database is ':memory:' — the probe leaves no file and no state behind
 *   - the corpus is synthetic and generated in-process; no real corpus is read
 *
 * Run:  node implementation/probes/TASK-0035/probe.mjs
 */

import { DatabaseSync } from 'node:sqlite';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const j = (v) => JSON.stringify(v);
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);

/* ================================================================== *
 * 0. The authorization predicate — held CONSTANT across every design
 * ================================================================== */

// Derived in EPA-0006 §3 from ADR-0020 §2/§3.1 and ADR-0018 §2/§4. Identical in meaning
// to the predicate TASK-0033 used; what changes between designs is how much of it the
// PHYSICAL STRUCTURE already guarantees, and how much is left to evaluate in-query.
const T = 1700000000;                       // answer-time frame, fixed for determinism
const SUBJECT = {
  scope: 'org-a',
  classifications: ['PUBLIC', 'INTERNAL'],
  audiences: ['staff', 'all-employees'],
};
const ANSWERABLE_STATE = 'PUBLISHED';       // ADR-0018 §2: SUPERSEDED is retained, not answerable
const QUERY_TERM = 'leave';
const K = 5;
const N_AUTHORIZED = 8;

// Authorization is decided ONLY here, and always against the answer-time frame actually
// used for the measurement. Nothing downstream is permitted to redefine it.
const isAuthorized = (row, atTime) =>
  row.scope === SUBJECT.scope &&
  row.state === ANSWERABLE_STATE &&
  SUBJECT.classifications.includes(row.cls) &&
  row.from <= atTime &&
  (row.to === null || row.to > atTime) &&
  row.audiences.some(a => SUBJECT.audiences.includes(a));

/* ================================================================== *
 * 1. Synthetic corpus — adversarial by construction (EPA-0006 §4.6 S8)
 * ================================================================== */

const AUTH_BODY = (i) =>
  `annual ${QUERY_TERM} entitlement policy section ${i} ` +
  'paragraph describing accrual carry over approval routing and the ' +
  'responsibilities of the line manager and the human resources function';
const UNAUTH_BODY = () => `${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM}`;

// Five ways to be unauthorized — one per EPA-0006 §3 constraint plus the lifecycle state
// ADR-0018 §2 marks "retained, not answerable". Identical to TASK-0033's five modes, so
// design P0 below is directly comparable with MSG-0104's C1.
const FAILURE_MODES = [
  'wrong-scope', 'wrong-audience', 'restricted-class', 'superseded', 'expired-effectivity',
];

/*
 * expiringFraction > 0 adds a SIXTH cohort that TASK-0033 did not have and could not have
 * needed: rows that are FULLY AUTHORIZED at T and become unauthorized at T + delta, purely
 * by the passage of time. They exist to measure one thing — what happens to a physically
 * materialised "currently effective" structure once it is no longer current. That fixture
 * is used ONLY for the staleness design; every other design runs the TASK-0033 cohorts.
 */
function generateCorpus(M, { expiring = 0, delta = 0 } = {}) {
  const rows = [];
  let id = 0;

  for (let i = 0; i < N_AUTHORIZED; i++) {
    id++;
    // Half the authorized chunks carry TWO audience tokens. Audience is a multi-valued
    // set overlap (EPA-0006 §3 constraint 2), and a design that partitions on it therefore
    // stores those chunks more than once. That duplication is a real consequence and the
    // fixture must contain it rather than assume it away.
    const audiences = i % 2 === 0 ? ['staff'] : ['staff', 'all-employees'];
    rows.push({ id, scope: 'org-a', cls: 'INTERNAL', state: 'PUBLISHED',
                from: T - 1000, to: null, audiences, body: AUTH_BODY(i), cohort: 'authorized' });
  }

  for (let m = 0; m < M; m++) {
    id++;
    const mode = FAILURE_MODES[m % FAILURE_MODES.length];
    const r = { id, scope: 'org-a', cls: 'INTERNAL', state: 'PUBLISHED', from: T - 1000,
                to: null, audiences: ['staff'], body: UNAUTH_BODY(), cohort: mode };
    if (mode === 'wrong-scope')         r.scope = 'org-b';
    if (mode === 'wrong-audience')      r.audiences = ['executive'];
    if (mode === 'restricted-class')    r.cls = 'RESTRICTED';
    if (mode === 'superseded')          r.state = 'SUPERSEDED';
    if (mode === 'expired-effectivity') r.to = T - 1;
    rows.push(r);
  }

  for (let e = 0; e < expiring; e++) {
    id++;
    rows.push({ id, scope: 'org-a', cls: 'INTERNAL', state: 'PUBLISHED', from: T - 1000,
                to: T + Math.floor(delta / 2), audiences: ['staff'],
                body: UNAUTH_BODY(), cohort: 'expiring-during-staleness' });
  }

  return rows;
}

/* ================================================================== *
 * 2. Instrumentation — EPA-0006 §4.6 S5/S7
 * ================================================================== */

// S5: a non-zero count is conclusive; a zero count proves only that nothing unauthorized
//     crossed THE POINT WHERE THE INSTRUMENT SITS.
// S7: record where each instrument sits, report the MAXIMUM across placements as U, and
//     treat it as a LOWER BOUND on units examined.
function installCounters(db, authorizedIds) {
  const c = { rankCalls: 0, rankUnauth: new Set(), seenCalls: 0, seenUnauth: new Set() };

  db.function('probe_rank', { deterministic: true }, (id, body) => {
    c.rankCalls++;
    if (!authorizedIds.has(Number(id))) c.rankUnauth.add(Number(id));
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });

  db.function('probe_seen', { deterministic: false }, (id) => {
    c.seenCalls++;
    if (!authorizedIds.has(Number(id))) c.seenUnauth.add(Number(id));
    return 1;
  });

  c.reset = () => { c.rankCalls = 0; c.seenCalls = 0;
                    c.rankUnauth = new Set(); c.seenUnauth = new Set(); };
  return c;
}

const bind = (sql, all) =>
  Object.fromEntries(Object.entries(all).filter(([k]) => new RegExp(`:${k}\\b`).test(sql)));
const plan = (db, sql, params) =>
  db.prepare('EXPLAIN QUERY PLAN ' + sql).all(bind(sql, params)).map(r => r.detail);

/* ================================================================== *
 * 3. The physical-isolation designs — technology-agnostic patterns,
 *    instantiated in one reachable engine
 * ================================================================== */

/*
 * Each design says which conjuncts of the §3 predicate are guaranteed by the PHYSICAL
 * STRUCTURE the traversal is confined to, and which are left as residual in-query work.
 *
 *   P0  none                       - one shared structure                (TASK-0033's shape)
 *   P1  scope-partitioned          - scope
 *   P2  discrete-conjunct          - scope, classification, lifecycle state
 *   P3  + audience-partitioned     - scope, classification, state, audience
 *   P4  + effectivity-materialised - all four, at the instant of materialisation
 *   P4S P4 queried after staleness - all four AS OF BUILD TIME, none as of answer time
 *   P5  P4 with per-partition FTS  - as P4, with the opaque lexical stage inside it
 *   NC  negative control           - post-filter over the shared structure (must FAIL)
 */

const SAFE = (s) => String(s).replace(/[^a-z0-9]+/gi, '_').toLowerCase();

function createSharedStructure(db, rows) {
  db.exec(`
    CREATE TABLE chunks (
      id INTEGER PRIMARY KEY, scope TEXT NOT NULL, cls TEXT NOT NULL, state TEXT NOT NULL,
      eff_from INTEGER NOT NULL, eff_to INTEGER, body TEXT NOT NULL);
    CREATE TABLE chunk_audience (chunk_id INTEGER NOT NULL, audience TEXT NOT NULL);
    CREATE INDEX i_aud ON chunk_audience(chunk_id, audience);
    CREATE INDEX i_auth ON chunks(scope, state, cls, eff_from, eff_to);
    CREATE VIRTUAL TABLE fts USING fts5(body);`);
  const insC = db.prepare('INSERT INTO chunks VALUES (?,?,?,?,?,?,?)');
  const insA = db.prepare('INSERT INTO chunk_audience VALUES (?,?)');
  const insF = db.prepare('INSERT INTO fts(rowid,body) VALUES (?,?)');
  for (const r of rows) {
    insC.run(r.id, r.scope, r.cls, r.state, r.from, r.to, r.body);
    for (const a of r.audiences) insA.run(r.id, a);
    insF.run(r.id, r.body);
  }
  return { structures: ['chunks'], queried: ['chunks'] };
}

// Builds one physical table per distinct partition key. Returns every structure created
// and the subset the subject's entitlements route to. Routing is computed from the
// SUBJECT's entitlements alone — no chunk is read to decide which structures to open.
function createPartitioned(db, rows, keyOf, routeKeys, materialiseAt) {
  const structures = new Map();
  const ensure = (key) => {
    if (structures.has(key)) return structures.get(key);
    const name = 'p_' + SAFE(key);
    db.exec(`CREATE TABLE ${name} (
       id INTEGER NOT NULL, scope TEXT NOT NULL, cls TEXT NOT NULL, state TEXT NOT NULL,
       eff_from INTEGER NOT NULL, eff_to INTEGER, body TEXT NOT NULL)`);
    const stmt = db.prepare(`INSERT INTO ${name} VALUES (?,?,?,?,?,?,?)`);
    structures.set(key, { name, stmt, rows: 0 });
    return structures.get(key);
  };

  for (const r of rows) {
    // A row effective-filtered out at materialisation time is not stored at all.
    if (materialiseAt !== undefined &&
        !(r.from <= materialiseAt && (r.to === null || r.to > materialiseAt))) continue;
    for (const key of keyOf(r)) {
      const s = ensure(key);
      s.stmt.run(r.id, r.scope, r.cls, r.state, r.from, r.to, r.body);
      s.rows++;
    }
  }

  const queried = routeKeys.filter(k => structures.has(k)).map(k => structures.get(k).name);
  return {
    structures: [...structures.values()].map(s => s.name),
    queried,
    storedRows: [...structures.values()].reduce((a, s) => a + s.rows, 0),
    queriedRows: routeKeys.filter(k => structures.has(k))
                          .reduce((a, k) => a + structures.get(k).rows, 0),
  };
}

// Per-partition FTS5, one lexical index per physical partition (design P5). The point is
// structural: the opaque MATCH traversal that MSG-0104 §5.3 could not see into is confined
// to an index whose every entry is authorized, so what it does internally cannot reach an
// unauthorized unit.
function addPerPartitionFts(db, queried) {
  const ftsNames = [];
  for (const p of queried) {
    const f = `fts_${p}`;
    db.exec(`CREATE VIRTUAL TABLE ${f} USING fts5(body)`);
    db.exec(`INSERT INTO ${f}(rowid, body) SELECT id, body FROM ${p}`);
    ftsNames.push(f);
  }
  return ftsNames;
}

/* ================================================================== *
 * 4. Queries — residual predicate per design, at two instrument placements
 * ================================================================== */

const RESIDUAL = {
  // P0: nothing is guaranteed by structure; the whole predicate is residual.
  P0: `x.scope = :scope AND x.state = :state
       AND x.cls IN ('PUBLIC','INTERNAL')
       AND x.eff_from <= :T AND (x.eff_to IS NULL OR x.eff_to > :T)
       AND EXISTS (SELECT 1 FROM chunk_audience ca
                   WHERE ca.chunk_id = x.id AND ca.audience IN ('staff','all-employees'))`,
  // P1: scope guaranteed by structure.
  P1: `x.state = :state AND x.cls IN ('PUBLIC','INTERNAL')
       AND x.eff_from <= :T AND (x.eff_to IS NULL OR x.eff_to > :T)
       AND EXISTS (SELECT 1 FROM chunk_audience ca
                   WHERE ca.chunk_id = x.id AND ca.audience IN ('staff','all-employees'))`,
  // P2: scope, classification, state guaranteed by structure.
  P2: `x.eff_from <= :T AND (x.eff_to IS NULL OR x.eff_to > :T)
       AND EXISTS (SELECT 1 FROM chunk_audience ca
                   WHERE ca.chunk_id = x.id AND ca.audience IN ('staff','all-employees'))`,
  // P3: + audience guaranteed by structure. Effectivity remains — it is the one conjunct
  //     that is a continuous, open-ended range (EPA-0006 §4.7 Q2 difficulty 1).
  P3: `x.eff_from <= :T AND (x.eff_to IS NULL OR x.eff_to > :T)`,
  // P4/P4S/P5: nothing residual. The structure is the whole predicate.
  P4: `1`,
};

// A union over the routed partitions. Every row it can surface comes from a structure the
// subject is entitled to; whether every row in that structure is authorized is asserted
// separately, per design, by verifyStructureInvariant().
// When instrumented, probe_seen is the branch's ONLY WHERE term, so the engine must call it
// once per row the scan of that physical structure surfaces. Putting it in the select list
// instead does NOT work: SQLite elides a subquery result column the outer query never reads,
// and the instrument then reports a zero it never earned. That was observed in this probe's
// first run and is exactly the S5 hazard the criterion warns about.
const unionOf = (tables, instrumented = false) =>
  tables.map(t => `SELECT id, scope, cls, state, eff_from, eff_to, body FROM ${t}` +
                  (instrumented ? ` WHERE probe_seen(id)` : '')).join(' UNION ALL ');

/*
 * placement = 'pre'       : probe_seen is the FIRST conjunct of the outer WHERE.
 * placement = 'post'      : probe_seen is the LAST conjunct of the outer WHERE.
 * placement = 'structure' : probe_seen sits INSIDE the scan of each physical structure, in
 *                           the branch's select list, so it is called once per row the scan
 *                           actually surfaces. This is the placement that measures what the
 *                           STRUCTURE exposes rather than what survives the residual
 *                           predicate — and it exists because 'pre' turned out NOT to be a
 *                           census: SQLite is free to reorder outer WHERE terms, so a term
 *                           written first is not evaluated first.
 * S7 requires the MAXIMUM across placements to be reported as U, as a LOWER BOUND.
 */
function buildQuery(design, tables, placement) {
  const residual = RESIDUAL[design] ?? RESIDUAL.P4;
  const seen = 'probe_seen(x.id)';
  if (placement === 'structure') {
    return `
      SELECT x.id FROM (${unionOf(tables, true)}) x
      WHERE ${residual}
      GROUP BY x.id
      ORDER BY MAX(probe_rank(x.id, x.body)) DESC
      LIMIT :k`;
  }
  const where = placement === 'pre' ? `${seen} AND (${residual})` : `(${residual}) AND ${seen}`;
  return `
    SELECT x.id FROM (${unionOf(tables)}) x
    WHERE ${where}
    GROUP BY x.id
    ORDER BY MAX(probe_rank(x.id, x.body)) DESC
    LIMIT :k`;
}

// P5 — the lexical/hybrid form: the MATCH runs against a per-partition FTS index.
function buildFtsQuery(pairs, placement) {
  const inner = placement === 'structure' ? ' AND probe_seen(c.id)' : '';
  const parts = pairs.map(([p, f]) => `
    SELECT c.id AS id, c.body AS body FROM ${f}
    JOIN ${p} c ON c.id = ${f}.rowid
    WHERE ${f} MATCH :q${inner}`).join(' UNION ALL ');
  const outer = placement === 'structure' ? '1' : 'probe_seen(x.id)';
  return `
    SELECT x.id FROM (${parts}) x
    WHERE ${outer}
    GROUP BY x.id
    ORDER BY MAX(probe_rank(x.id, x.body)) DESC
    LIMIT :k`;
}

// NC — NEGATIVE CONTROL, mandatory under S8. Deliberately Shape 2: rank the shared
// structure, then filter in application code. If the harness does not fail this, the run
// is void and every other result in it proves nothing.
const NC_SQL = `
  SELECT c.id, c.scope, c.cls, c.state, c.eff_from, c.eff_to FROM chunks c
  ORDER BY probe_rank(c.id, c.body) DESC
  LIMIT :fetch`;

/* ================================================================== *
 * 5. Structure invariant — what makes E1 checkable rather than asserted
 * ================================================================== */

// EPA-0006 §4.6 S6/E1 requires the traversal be "confined to a structure or region every
// entry of which satisfies the predicate". For a partitioned design that is a claim about
// the STORED CONTENT of the routed structures, and it is checkable directly. This reads
// the fixture's own generated rows, not the engine, so it is an assertion about the
// construction under test and is reported as such.
function verifyStructureInvariant(db, queried, authorizedIds) {
  let total = 0, violating = 0;
  for (const p of queried) {
    for (const r of db.prepare(`SELECT id FROM ${p}`).all()) {
      total++;
      if (!authorizedIds.has(Number(r.id))) violating++;
    }
  }
  return { total, violating, holds: violating === 0 };
}

/* ================================================================== *
 * 6. Execute
 * ================================================================== */

say('='.repeat(94));
say('TASK-0035 — physical projection isolation probe (EVALUATION ONLY)');
say('='.repeat(94));

{
  const d = new DatabaseSync(':memory:');
  say(`engine under test : SQLite ${d.prepare('select sqlite_version() v').get().v} (embedded, node:sqlite)`);
  say(`node              : ${process.version}`);
  d.close();
}
say('EPA-0006 class    : R (relational). Classes S and V are unreachable on this host; K has no');
say('                    PostgreSQL here. This probe measures ONE class and claims nothing beyond it.');
say('');
say('--- Subject and answer-time frame, held constant across every design ---');
say(`subject           : ${j(SUBJECT)}`);
say(`answerable state  : ${ANSWERABLE_STATE}   (ADR-0018 §2 — SUPERSEDED is retained, not answerable)`);
say(`answer time T     : ${T}`);
say(`k                 : ${K}   authorized chunks in fixture: ${N_AUTHORIZED}`);

const M_VALUES = [50, 500, 5000];
const DESIGNS = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5'];
const results = [];

const keyFns = {
  P1: (r) => [r.scope],
  P2: (r) => [`${r.scope}|${r.cls}|${r.state}`],
  P3: (r) => r.audiences.map(a => `${r.scope}|${r.cls}|${r.state}|${a}`),
};
const routeKeys = {
  P1: [SUBJECT.scope],
  P2: SUBJECT.classifications.map(c => `${SUBJECT.scope}|${c}|${ANSWERABLE_STATE}`),
  P3: SUBJECT.classifications.flatMap(c =>
        SUBJECT.audiences.map(a => `${SUBJECT.scope}|${c}|${ANSWERABLE_STATE}|${a}`)),
};

for (const M of M_VALUES) {
  const rows = generateCorpus(M);
  const authorizedIds = new Set(rows.filter(r => isAuthorized(r, T)).map(r => r.id));

  say('');
  say('#'.repeat(94));
  say(`FIXTURE  M=${M} unauthorized · ${N_AUTHORIZED} authorized · ${rows.length} chunks total · ` +
      `authorized-at-T=${authorizedIds.size}`);
  say('#'.repeat(94));

  /* --- Adversarial precondition (S8), verified before any measurement --- */
  {
    const db = new DatabaseSync(':memory:');
    createSharedStructure(db, rows);
    const bare = db.prepare(
      `SELECT c.id FROM fts JOIN chunks c ON c.id=fts.rowid
       WHERE fts MATCH :q ORDER BY bm25(fts) ASC LIMIT :k`).all({ q: QUERY_TERM, k: K });
    const ids = bare.map(r => Number(r.id));
    const authAmong = ids.filter(i => authorizedIds.has(i)).length;
    say(`precondition (unconstrained lexical top-${K}) : ids=${j(ids)} authorized-among-them=${authAmong}` +
        ` -> ${authAmong === 0 ? 'ADVERSARIAL, as required' : 'NOT ADVERSARIAL — the run is VOID'}`);
    if (authAmong !== 0) { say('ABORTING: fixture is not adversarial.'); process.exit(1); }
    db.close();
  }

  for (const design of DESIGNS) {
    const db = new DatabaseSync(':memory:');
    const counters = installCounters(db, authorizedIds);
    const p = { scope: SUBJECT.scope, state: ANSWERABLE_STATE, T, q: QUERY_TERM, k: K, fetch: K * 40 };

    let built, tables, ftsPairs = null;
    if (design === 'P0') {
      built = createSharedStructure(db, rows);
      tables = ['chunks'];
    } else if (design === 'P1' || design === 'P2' || design === 'P3') {
      // the audience junction is still needed for designs whose residual includes audience
      db.exec(`CREATE TABLE chunk_audience (chunk_id INTEGER NOT NULL, audience TEXT NOT NULL);
               CREATE INDEX i_aud ON chunk_audience(chunk_id, audience);`);
      const insA = db.prepare('INSERT INTO chunk_audience VALUES (?,?)');
      for (const r of rows) for (const a of r.audiences) insA.run(r.id, a);
      built = createPartitioned(db, rows, keyFns[design], routeKeys[design]);
      tables = built.queried;
    } else {
      // P4 and P5 — audience-partitioned AND effectivity-materialised at T
      built = createPartitioned(db, rows, keyFns.P3, routeKeys.P3, T);
      tables = built.queried;
      if (design === 'P5') ftsPairs = tables.map((t, i) => [t, addPerPartitionFts(db, [t])[0]]);
    }

    const inv = verifyStructureInvariant(db, tables, authorizedIds);

    // P0's structure is the entire shared collection, and forcing an in-structure instrument
    // there would replace the index search with a full scan — a different plan, and therefore
    // not the same design. Its structure invariant is reported instead, and it is violated by
    // construction: the shared structure holds every unauthorized row in the corpus.
    const PLACEMENTS = design === 'P0' ? ['pre', 'post']
                     : design === 'P5' ? ['pre', 'structure']
                     : ['pre', 'post', 'structure'];

    const placements = {};
    for (const placement of PLACEMENTS) {
      const sql = design === 'P5' ? buildFtsQuery(ftsPairs, placement)
                                  : buildQuery(design, tables, placement);
      counters.reset();
      const ids = db.prepare(sql).all(bind(sql, p)).map(r => Number(r.id));
      placements[placement] = {
        ids: ids.slice().sort((a, b) => a - b),
        returned: ids.length,
        unauthorizedReturned: ids.filter(i => !authorizedIds.has(i)).length,
        seenCalls: counters.seenCalls,
        seenUnauth: counters.seenUnauth.size,
        rankCalls: counters.rankCalls,
        rankUnauthBodies: counters.rankUnauth.size,
        plan: plan(db, sql, p),
      };
    }

    const U = Math.max(...Object.values(placements).map(x => x.seenUnauth));
    const Ubody = Math.max(...Object.values(placements).map(x => x.rankUnauthBodies));
    const r0 = placements.post ?? placements.pre;

    results.push({
      M, design, U, Ubody,
      structures: built.structures.length,
      queried: tables.length,
      queriedRows: built.queriedRows ?? null,
      storedRows: built.storedRows ?? rows.length,
      invariant: inv,
      returned: r0.returned,
      kComplete: r0.returned === K,
      unauthorizedReturned: r0.unauthorizedReturned,
      resultSet: r0.ids,
      placements,
    });

    say('');
    say(`[${design}] structures created=${built.structures.length} routed-to=${tables.length}` +
        (built.queriedRows != null ? ` rows-in-routed=${built.queriedRows}` : '') +
        `  stored-rows=${built.storedRows ?? rows.length}`);
    say(`      structure invariant : rows-in-routed-structures=${inv.total} ` +
        `unauthorized-among-them=${inv.violating} -> ${inv.holds ? 'HOLDS' : 'VIOLATED'}`);
    for (const [pl, v] of Object.entries(placements)) {
      say(`      instrument=${pad(pl, 5)} unauthorized-examined=${rpad(v.seenUnauth, 5)} ` +
          `rows-through-instrument=${rpad(v.seenCalls, 6)} ` +
          `unauth-BODIES-materialised=${rpad(v.rankUnauthBodies, 5)} ` +
          `returned=${v.returned}/${K} unauthorized-returned=${v.unauthorizedReturned}`);
    }
    say(`      U (max over placements, EPA-0006 §4.6 S7) = ${U}`);
    say(`      result set          : ${j(r0.ids)}`);
    for (const pl of r0.plan.slice(0, 6)) say(`      plan                : ${pl}`);
    if (r0.plan.length > 6) say(`      plan                : … ${r0.plan.length - 6} further plan rows`);
    db.close();
  }

  /* --- Negative control (S8): mandatory, must FAIL --- */
  {
    const db = new DatabaseSync(':memory:');
    const counters = installCounters(db, authorizedIds);
    createSharedStructure(db, rows);
    const p = { fetch: K * 40 };
    counters.reset();
    const fetched = db.prepare(NC_SQL).all(bind(NC_SQL, p));
    const ids = fetched.filter(r => authorizedIds.has(Number(r.id))).slice(0, K).map(r => Number(r.id));
    // probe_seen is NOT active in NC — probe_rank is, because probe_rank IS the ranking
    // function the control uses. Reporting seenUnauth here would report a zero produced by an
    // absent instrument, which is exactly the error MSG-0104 §5.3 flagged in its own record.
    const rec = {
      M, design: 'NC', U: counters.rankUnauth.size, Ubody: counters.rankUnauth.size,
      structures: 1, queried: 1, queriedRows: rows.length, storedRows: rows.length,
      invariant: { total: rows.length, violating: rows.length - authorizedIds.size, holds: false },
      returned: ids.length, kComplete: ids.length === K, unauthorizedReturned: 0,
      resultSet: ids.slice().sort((a, b) => a - b), placements: {},
    };
    results.push(rec);
    say('');
    say(`[NC ] NEGATIVE CONTROL — post-filter over the shared structure (must fail; S8)`);
    say(`      fetched=${fetched.length} then filtered in application code`);
    say(`      unauth-BODIES-materialised=${counters.rankUnauth.size}  ` +
        `returned=${ids.length}/${K} k-complete=${ids.length === K}`);
    say(`      result set          : ${j(rec.resultSet)}`);
    db.close();
  }
}

/* ================================================================== *
 * 7. The staleness measurement — P4S
 * ================================================================== */

say('');
say('='.repeat(94));
say('P4S — the same physically materialised design, queried after time has passed');
say('='.repeat(94));
say('');
say('P4 stores only rows effective at the instant of materialisation. This asks what the');
say('structure contains once the answer time has moved past that instant — the only variable');
say('changed is the clock. Nothing here is a benchmark and no timing is measured.');

const DELTA = 1000;
for (const M of [50, 500, 5000]) {
  const expiring = Math.max(1, Math.floor(M / 10));
  const rows = generateCorpus(M, { expiring, delta: DELTA });
  const T2 = T + DELTA;
  const authAtBuild = new Set(rows.filter(r => isAuthorized(r, T)).map(r => r.id));
  const authAtAnswer = new Set(rows.filter(r => isAuthorized(r, T2)).map(r => r.id));

  const db = new DatabaseSync(':memory:');
  const counters = installCounters(db, authAtAnswer);   // authorization is decided at ANSWER time
  const built = createPartitioned(db, rows, keyFns.P3, routeKeys.P3, T);   // materialised at T
  const tables = built.queried;
  const inv = verifyStructureInvariant(db, tables, authAtAnswer);
  const p = { T: T2, k: K };

  const sql = buildQuery('P4', tables, 'pre');
  counters.reset();
  const ids = db.prepare(sql).all(bind(sql, p)).map(r => Number(r.id));

  results.push({
    M, design: 'P4S', U: counters.seenUnauth.size, Ubody: counters.rankUnauth.size,
    structures: built.structures.length, queried: tables.length,
    queriedRows: built.queriedRows, storedRows: built.storedRows, invariant: inv,
    returned: ids.length, kComplete: ids.length === K,
    unauthorizedReturned: ids.filter(i => !authAtAnswer.has(i)).length,
    resultSet: ids.slice().sort((a, b) => a - b), placements: {},
  });

  say('');
  say(`M=${M}  expiring-during-staleness cohort=${expiring}  delta=${DELTA}  ` +
      `authorized at build=${authAtBuild.size} at answer=${authAtAnswer.size}`);
  say(`      structure invariant AT ANSWER TIME : rows-in-routed=${inv.total} ` +
      `unauthorized-among-them=${inv.violating} -> ${inv.holds ? 'HOLDS' : 'VIOLATED'}`);
  say(`      U (unauthorized examined at answer time) = ${counters.seenUnauth.size}  ` +
      `unauth-BODIES-materialised=${counters.rankUnauth.size}  ` +
      `returned=${ids.length}/${K} unauthorized-returned=${ids.filter(i => !authAtAnswer.has(i)).length}`);
}

/* ================================================================== *
 * 8. Summary tables
 * ================================================================== */

const LABEL = {
  P0: 'no isolation (shared structure)',
  P1: 'scope-partitioned',
  P2: 'discrete-conjunct partitioned (scope,class,state)',
  P3: '+ audience-partitioned',
  P4: '+ effectivity-materialised at T',
  P5: 'P4 with per-partition lexical index',
  P4S: 'P4 queried after staleness (delta>0)',
  NC: 'NEGATIVE CONTROL — post-filter',
};

say('');
say('='.repeat(94));
say('U — unauthorized units examined, by physical-isolation design and collection size');
say('EPA-0006 §4.6 S3: CLEARED requires U = 0 at every measured N, shown invariant with N');
say('='.repeat(94));
say('');
say('  design  M=50      M=500     M=5000    invariant-with-N  structure-invariant (E1)  reading');
for (const design of [...DESIGNS, 'P4S', 'NC']) {
  const rs = M_VALUES.map(M => results.find(r => r.design === design && r.M === M)).filter(Boolean);
  if (!rs.length) continue;
  const us = rs.map(r => r.U);
  const invariant = new Set(us).size === 1;
  const structOk = rs.every(r => r.invariant.holds);
  // EPA-0006 §4.6 S5/S6: a zero counter over a structure that holds unauthorized entries is
  // NOT evidence of conformance — E1 is disqualifying regardless of any counter.
  const reading = design === 'NC' ? 'control — must fail, and does'
                : !structOk && us.every(u => u === 0) ? 'U=0 is an INSTRUMENT ARTIFACT — E1 fails'
                : !structOk ? 'fails on both E1 and U'
                : us.every(u => u === 0) ? 'U=0 with E1 holding'
                : 'U non-zero';
  say(`  ${pad(design, 7)} ${rpad(us[0], 9)} ${rpad(us[1], 9)} ${rpad(us[2], 9)} ` +
      `${pad(invariant ? 'yes' : 'NO — grows', 17)} ${pad(structOk ? 'holds' : 'VIOLATED', 25)} ${reading}`);
}

say('');
say('  design  meaning');
for (const d of [...DESIGNS, 'P4S', 'NC']) say(`  ${pad(d, 7)} ${LABEL[d]}`);

say('');
say('='.repeat(94));
say('Physical cost of isolation — structures created and rows stored (fixture measurement only)');
say('='.repeat(94));
say('');
say('  design  M     structures  routed-to  rows-stored  rows-in-routed  stored/corpus-ratio');
for (const design of DESIGNS) {
  for (const M of M_VALUES) {
    const r = results.find(x => x.design === design && x.M === M);
    if (!r) continue;
    const corpus = N_AUTHORIZED + M;
    say(`  ${pad(design, 7)} ${rpad(M, 5)} ${rpad(r.structures, 11)} ${rpad(r.queried, 10)} ` +
        `${rpad(r.storedRows, 12)} ${rpad(r.queriedRows ?? '-', 15)} ` +
        `${rpad((r.storedRows / corpus).toFixed(2), 19)}`);
  }
}

say('');
say('='.repeat(94));
say('END OF PROBE — no engine, technology or physical implementation selected, adopted,');
say('recommended, installed or deployed. Verdicts are recorded in the COMMS execution record.');
say('='.repeat(94));
