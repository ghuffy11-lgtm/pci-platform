/*
 * TASK-0033 — Bounded retrieval-engine conformance probe (EVALUATION ONLY)
 *
 * Authority : MSG-0101 (AUTHORIZED) · CLAUDE-TASKS.md §TASK-0033
 * Applies   : ADR-0020 as amended by AMD-01 (§4 engine-selection criterion)
 *             ADR-0018 §2 (lifecycle/answerability), §4 (effectivity at answer time)
 *             EPA-0006 §3 (the derived predicate), §4.1 (three shapes), §4.4 (three evidence tiers)
 *
 * THIS PROBE SELECTS, ADOPTS, RECOMMENDS AND DEPLOYS NOTHING.
 * The engine exercised here is a TEST SUBJECT. MSG-0101 §3 permits naming concrete candidate
 * engines as test subjects and states that naming one is not adoption or selection.
 *
 * Boundaries honoured by construction:
 *   - nothing is installed; only the Node runtime already present is used
 *   - no network is reached
 *   - the database is ':memory:' — the probe leaves no file and no state behind
 *   - the corpus is synthetic and generated in-process; no real corpus is read
 *
 * Run:  node implementation/probes/TASK-0033/probe.mjs
 */

import { DatabaseSync } from 'node:sqlite';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const j = (v) => JSON.stringify(v);

/* ------------------------------------------------------------------ *
 * 0. The authorization predicate — recorded verbatim (criterion 2)
 * ------------------------------------------------------------------ */

// Derived in EPA-0006 §3 from ADR-0020 §2/§3.1 and ADR-0018 §2/§4.
// The SAME predicate text is used for every candidate. A probe that varies the
// predicate proves nothing comparative (MSG-0101 §2).
const PREDICATE = `
      c.scope = :scope
  AND c.state = 'PUBLISHED'
  AND c.eff_from <= :T
  AND (c.eff_to IS NULL OR c.eff_to > :T)
  AND c.classification IN ('PUBLIC','INTERNAL')
  AND EXISTS (SELECT 1 FROM chunk_audience ca
              WHERE ca.chunk_id = c.id AND ca.audience IN ('staff','all-employees'))`;

// The answer-time temporal frame (ADR-0018 §4). Fixed so the probe is deterministic.
const T = 1700000000;
const SUBJECT = { scope: 'org-a' };
const QUERY_TERM = 'leave';
const K = 5;
const N_AUTHORIZED = 8;   // > K, so k-completeness is achievable for a Shape-1 engine

/* ------------------------------------------------------------------ *
 * 1. Synthetic fixture — adversarial by construction (EPA-0006 §4.4 tier 2)
 * ------------------------------------------------------------------ */

// Unauthorized chunks are made to rank BETTER lexically than authorized ones,
// so that an engine which ranks first and excludes afterwards cannot return k
// authorized results. Authorized bodies are long with one occurrence of the
// term; unauthorized bodies are short with five.
const AUTH_BODY = (i) =>
  `annual ${QUERY_TERM} entitlement policy section ${i} ` +
  'paragraph describing accrual carry over approval routing and the ' +
  'responsibilities of the line manager and the human resources function';
const UNAUTH_BODY = () =>
  `${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM} ${QUERY_TERM}`;

// Five distinct ways to be unauthorized, one per constraint in EPA-0006 §3
// plus the lifecycle state ADR-0018 §2 marks "retained, not answerable".
const FAILURE_MODES = [
  'wrong-scope',            // constraint 1
  'wrong-audience',         // constraint 2 (set overlap)
  'restricted-class',       // constraint 2 (classification)
  'superseded',             // constraint 4 (ADR-0018 §2)
  'expired-effectivity',    // constraint 3 (ADR-0018 §4)
];

// indexMode is the controlled variable. 'partial' indexes 3 of the 6 scalar
// conjuncts; 'covering' indexes all 5 that are indexable. The audience conjunct
// is a set-overlap over a junction table in both modes.
function buildFixture(db, M, indexMode) {
  db.exec(`
    CREATE TABLE chunks (
      id             INTEGER PRIMARY KEY,
      scope          TEXT    NOT NULL,
      classification TEXT    NOT NULL,
      state          TEXT    NOT NULL,
      eff_from       INTEGER NOT NULL,
      eff_to         INTEGER,
      body           TEXT    NOT NULL
    );
    CREATE TABLE chunk_audience (
      chunk_id INTEGER NOT NULL,
      audience TEXT    NOT NULL
    );
    CREATE INDEX i_aud ON chunk_audience(chunk_id, audience);
    CREATE VIRTUAL TABLE fts USING fts5(body);
  `);
  db.exec(indexMode === 'covering'
    ? 'CREATE INDEX i_auth ON chunks(scope, state, classification, eff_from, eff_to)'
    : 'CREATE INDEX i_auth ON chunks(scope, state, eff_from)');

  const insC = db.prepare(
    'INSERT INTO chunks(id,scope,classification,state,eff_from,eff_to,body) VALUES (?,?,?,?,?,?,?)');
  const insA = db.prepare('INSERT INTO chunk_audience(chunk_id,audience) VALUES (?,?)');
  const insF = db.prepare('INSERT INTO fts(rowid,body) VALUES (?,?)');

  const authorized = new Set();
  let id = 0;

  // The authorized set: satisfies every conjunct of PREDICATE.
  for (let i = 0; i < N_AUTHORIZED; i++) {
    id++;
    const body = AUTH_BODY(i);
    insC.run(id, 'org-a', 'INTERNAL', 'PUBLISHED', T - 1000, null, body);
    insA.run(id, 'staff');
    insF.run(id, body);
    authorized.add(id);
  }

  // The unauthorized set: M chunks, each failing exactly one conjunct, each a
  // BETTER lexical match than any authorized chunk.
  for (let m = 0; m < M; m++) {
    id++;
    const body = UNAUTH_BODY();
    const mode = FAILURE_MODES[m % FAILURE_MODES.length];
    let scope = 'org-a', cls = 'INTERNAL', state = 'PUBLISHED', from = T - 1000, to = null,
        aud = 'staff';
    if (mode === 'wrong-scope')          scope = 'org-b';
    if (mode === 'wrong-audience')       aud   = 'executive';
    if (mode === 'restricted-class')     cls   = 'RESTRICTED';
    if (mode === 'superseded')           state = 'SUPERSEDED';
    if (mode === 'expired-effectivity')  to    = T - 1;
    insC.run(id, scope, cls, state, from, to, body);
    insA.run(id, aud);
    insF.run(id, body);
  }
  return { authorized, total: id };
}

/* ------------------------------------------------------------------ *
 * 2. Tier-3 instrumentation — engine-side counters
 * ------------------------------------------------------------------ */

// probe_rank IS the ranking function, so the engine must call it once per row it
// actually ranks. Every call hands this probe the row's BODY, which is exactly
// the materialisation ADR-0020's Context section names as the failure:
// "the content is in the process, in memory, in a log line, or in a timing
// difference, whatever the response body eventually says."
// Counting unauthorized bodies passed to it is therefore a DIRECT measurement of
// the hazard, not a proxy for it.
function installCounters(db, authorized) {
  const c = { rankCalls: 0, rankUnauthorized: new Set(), seenCalls: 0, seenUnauthorized: new Set() };

  db.function('probe_rank', { deterministic: true }, (id, body) => {
    c.rankCalls++;
    if (!authorized.has(Number(id))) c.rankUnauthorized.add(Number(id));
    // a real ranker: more occurrences of the term, shorter body => higher score
    const occ = String(body).split(QUERY_TERM).length - 1;
    return occ * 1000 - String(body).length;
  });

  db.function('probe_seen', { deterministic: false }, (id) => {
    c.seenCalls++;
    if (!authorized.has(Number(id))) c.seenUnauthorized.add(Number(id));
    return 1;
  });

  c.reset = () => {
    c.rankCalls = 0; c.seenCalls = 0;
    c.rankUnauthorized = new Set(); c.seenUnauthorized = new Set();
  };
  return c;
}

// node:sqlite rejects a named parameter the statement does not declare, so each
// statement is bound with exactly the subset it uses.
const bind = (sql, all) =>
  Object.fromEntries(Object.entries(all).filter(([k]) => new RegExp(`:${k}\\b`).test(sql)));

const plan = (db, sql, params) =>
  db.prepare('EXPLAIN QUERY PLAN ' + sql).all(bind(sql, params)).map(r => r.detail);

/* ------------------------------------------------------------------ *
 * 3. The candidates — test subjects only, never selections
 * ------------------------------------------------------------------ */

const SQL = {
  // C1 — relational scalar retrieval, predicate participates in candidate-set construction
  C1: `
    SELECT c.id FROM chunks c
    WHERE ${PREDICATE} AND probe_seen(c.id)
    ORDER BY probe_rank(c.id, c.body) DESC
    LIMIT :k`,

  // C2 — FTS5 lexical match, authorization applied in the same statement,
  //      written the way an implementer naturally writes it
  C2: `
    SELECT c.id FROM fts
    JOIN chunks c ON c.id = fts.rowid
    WHERE fts MATCH :q AND probe_seen(c.id) AND ${PREDICATE}
    ORDER BY bm25(fts) ASC
    LIMIT :k`,

  // C3 — FTS5 lexical match with the authorization scan forced to lead the join
  C3: `
    SELECT c.id FROM chunks c
    CROSS JOIN fts ON fts.rowid = c.id
    WHERE ${PREDICATE} AND probe_seen(c.id) AND fts MATCH :q
    ORDER BY bm25(fts) ASC
    LIMIT :k`,

  // NC — NEGATIVE CONTROL. Deliberately Shape 2: rank the whole collection, then
  //      filter in application code. If the harness does not catch this, the
  //      harness proves nothing about the others.
  NC: `
    SELECT c.id, c.scope, c.classification, c.state, c.eff_from, c.eff_to FROM chunks c
    ORDER BY probe_rank(c.id, c.body) DESC
    LIMIT :fetch`,
};

function runCandidate(db, counters, name, M, authorized) {
  const p = { scope: SUBJECT.scope, T, q: QUERY_TERM, k: K, fetch: K * 40 };
  counters.reset();
  let ids, planRows, note = '';

  if (name === 'NC') {
    planRows = plan(db, SQL.NC, p);
    const rows = db.prepare(SQL.NC).all(bind(SQL.NC, p));
    ids = rows.filter(r => authorized.has(Number(r.id))).slice(0, K).map(r => Number(r.id));
    note = `application-side filter applied to ${rows.length} fetched rows`;
  } else {
    planRows = plan(db, SQL[name], p);
    ids = db.prepare(SQL[name]).all(bind(SQL[name], p)).map(r => Number(r.id));
  }

  const returned = ids.length;
  const unauthorizedReturned = ids.filter(i => !authorized.has(i)).length;
  return {
    candidate: name, M, returned, kComplete: returned === K, unauthorizedReturned,
    resultSet: ids.slice().sort((a, b) => a - b),
    rankCalls: counters.rankCalls,
    rankUnauthorizedBodies: counters.rankUnauthorized.size,
    seenCalls: counters.seenCalls,
    seenUnauthorizedRows: counters.seenUnauthorized.size,
    plan: planRows, note,
  };
}

/* ------------------------------------------------------------------ *
 * 4. Execute
 * ------------------------------------------------------------------ */

say('='.repeat(78));
say('TASK-0033 — bounded retrieval-engine conformance probe (EVALUATION ONLY)');
say('='.repeat(78));

const probe = new DatabaseSync(':memory:');
say(`engine under test : SQLite ${probe.prepare('select sqlite_version() v').get().v} (embedded, node:sqlite)`);
say(`node              : ${process.version}`);
probe.close();

say('');
say('--- The authorization predicate used for EVERY candidate (criterion 2) ---');
say(PREDICATE.trim());
say(`bound: :scope=${j(SUBJECT.scope)}  :T=${T}  :q=${j(QUERY_TERM)}  :k=${K}`);

const M_VALUES = [50, 500, 5000];
const INDEX_MODES = ['partial', 'covering'];
const results = [];

for (const indexMode of INDEX_MODES)
for (const M of M_VALUES) {
  const db = new DatabaseSync(':memory:');
  const { authorized, total } = buildFixture(db, M, indexMode);
  const counters = installCounters(db, authorized);

  say('');
  say('-'.repeat(78));
  say(`FIXTURE  index=${indexMode}  M=${M} unauthorized · ${N_AUTHORIZED} authorized · ${total} chunks total`);
  say('-'.repeat(78));

  // Adversarial precondition: verify the fixture is actually adversarial, rather
  // than assuming it. An UNCONSTRAINED top-k must return only unauthorized rows,
  // otherwise tier 2 discriminates nothing.
  counters.reset();
  const bare = db.prepare(
    `SELECT c.id FROM fts JOIN chunks c ON c.id=fts.rowid
     WHERE fts MATCH :q ORDER BY bm25(fts) ASC LIMIT :k`).all({ q: QUERY_TERM, k: K });
  const bareIds = bare.map(r => Number(r.id));
  const bareAuthorized = bareIds.filter(i => authorized.has(i)).length;
  say(`precondition (unconstrained lexical top-${K}): ids=${j(bareIds)} ` +
      `authorized-among-them=${bareAuthorized} ` +
      `-> ${bareAuthorized === 0 ? 'ADVERSARIAL, as required' : 'NOT ADVERSARIAL — tier 2 is void'}`);

  for (const name of ['C1', 'C2', 'C3', 'NC']) {
    const r = runCandidate(db, counters, name, M, authorized);
    r.indexMode = indexMode;
    results.push(r);
    say('');
    say(`[${name}] returned=${r.returned}/${K} k-complete=${r.kComplete} ` +
        `unauthorized-returned=${r.unauthorizedReturned}`);
    say(`      result set          : ${j(r.resultSet)}`);
    say(`      tier-3 rank calls   : ${r.rankCalls}  (unauthorized bodies materialised: ${r.rankUnauthorizedBodies})`);
    say(`      tier-3 seen calls   : ${r.seenCalls}  (unauthorized rows examined: ${r.seenUnauthorizedRows})`);
    for (const pl of r.plan) say(`      plan                : ${pl}`);
    if (r.note) say(`      note                : ${r.note}`);
  }
  db.close();
}

/* ------------------------------------------------------------------ *
 * 5. Tier-2 verdict — invariance of the result set as M grows
 * ------------------------------------------------------------------ */

say('');
say('='.repeat(78));
say('TIER 2 — k-completeness and result-set invariance as M grows');
say('='.repeat(78));

for (const indexMode of INDEX_MODES) {
  say('');
  say(`index coverage = ${indexMode}`);
  for (const name of ['C1', 'C2', 'C3', 'NC']) {
    const rs = results.filter(r => r.candidate === name && r.indexMode === indexMode);
    const allComplete = rs.every(r => r.kComplete);
    const invariant = new Set(rs.map(r => j(r.resultSet))).size === 1;
    const leaked = rs.some(r => r.unauthorizedReturned > 0);
    say(`  ${name}: k-complete at every M = ${allComplete} · result set invariant = ${invariant} · ` +
        `returned unauthorized = ${leaked}`);
    for (const r of rs) say(`        M=${String(r.M).padStart(4)} -> ${j(r.resultSet)}`);
  }
}

say('');
say('='.repeat(78));
say('TIER 3 — unauthorized rows the engine actually examined, by index coverage');
say('='.repeat(78));
say('');
say('  cand  index      M     examined  unauth-examined  ranked  unauth-BODIES-materialised');
for (const indexMode of INDEX_MODES)
  for (const name of ['C1', 'C2', 'C3', 'NC'])
    for (const r of results.filter(x => x.candidate === name && x.indexMode === indexMode))
      say(`  ${name.padEnd(5)} ${indexMode.padEnd(9)} ${String(r.M).padStart(5)}` +
          `  ${String(r.seenCalls).padStart(8)}  ${String(r.seenUnauthorizedRows).padStart(15)}` +
          `  ${String(r.rankCalls).padStart(6)}  ${String(r.rankUnauthorizedBodies).padStart(25)}`);

/* ------------------------------------------------------------------ *
 * 6. Criterion 6 — strategy switching under selectivity, and pinning
 * ------------------------------------------------------------------ */

say('');
say('='.repeat(78));
say('CRITERION 6 — does the strategy switch with authorization selectivity, and can it be pinned?');
say('='.repeat(78));

{
  const db = new DatabaseSync(':memory:');
  const { authorized } = buildFixture(db, 5000, 'partial');
  const counters = installCounters(db, authorized);
  const p = { scope: 'org-a', T, k: K };

  const selective = SQL.C1;                       // scope='org-a' among many scopes
  const broad = SQL.C1.replace("c.scope = :scope", "c.scope IN ('org-a','org-b')");

  say('');
  say('BEFORE ANALYZE (no statistics — the optimizer is guessing)');
  say(`  highly selective : ${j(plan(db, selective, p))}`);
  say(`  broad            : ${j(plan(db, broad, p))}`);

  db.exec('ANALYZE');
  say('');
  say('AFTER ANALYZE (real statistics — this is where a cost-based optimizer may switch)');
  const selAfter = plan(db, selective, p);
  const broadAfter = plan(db, broad, p);
  say(`  highly selective : ${j(selAfter)}`);
  say(`  broad            : ${j(broadAfter)}`);
  say(`  strategy differs between selectivities: ${j(selAfter) !== j(broadAfter)}`);

  say('');
  say('PINNING — can the strategy be forced, independent of the optimizer?');
  const pinned = SQL.C1.replace('FROM chunks c', 'FROM chunks c INDEXED BY i_auth');
  try {
    const pinnedPlan = plan(db, pinned, p);
    say(`  INDEXED BY i_auth accepted : ${j(pinnedPlan)}`);
    const rows = db.prepare(pinned).all(bind(pinned, p)).map(r => Number(r.id));
    say(`  pinned query still correct : returned=${rows.length}/${K} ` +
        `unauthorized=${rows.filter(i => !authorized.has(i)).length}`);
  } catch (e) {
    say(`  INDEXED BY rejected        : ${e.message}`);
  }

  // Does the engine REFUSE a pin that cannot serve the predicate? The index named
  // here is on the same table but useless to this query, so acceptance would mean
  // the pin is advisory and rejection would mean it is enforced.
  db.exec('CREATE INDEX i_unusable ON chunks(body)');
  try {
    const forced = SQL.C1.replace('FROM chunks c', 'FROM chunks c INDEXED BY i_unusable');
    say(`  INDEXED BY i_unusable (same table, useless here) ACCEPTED : ${j(plan(db, forced, p))}`);
    say('  -> the pin is advisory: the engine accepted a plan that does not restrict on authorization');
  } catch (e) {
    say(`  INDEXED BY i_unusable (same table, useless here) REJECTED : ${e.message.split('\n')[0]}`);
    say('  -> the pin is ENFORCED by the engine, not merely a hint: an unusable pin is a hard error');
  }

  // EPA-0006 finding 2: "the same engine and the same SQL can produce either shape".
  // NOT INDEXED forces the optimizer away from the authorization index. If the plan
  // and the examined-row profile change, finding 2 is demonstrated rather than asserted.
  say('');
  say('SAME SQL, PLAN FORCED AWAY FROM THE AUTHORIZATION INDEX (EPA-0006 finding 2)');
  say('  probe_seen is written as the FIRST conjunct here, so it counts rows the engine');
  say('  reaches before the authorization predicate is applied — a row census, not a survivor count.');

  const censusIdx = `
    SELECT c.id FROM chunks c
    WHERE probe_seen(c.id) AND ${PREDICATE}
    ORDER BY probe_rank(c.id, c.body) DESC
    LIMIT :k`;
  const censusScan = censusIdx.replace('FROM chunks c', 'FROM chunks c NOT INDEXED');

  for (const [label, sql] of [['optimizer-chosen', censusIdx], ['NOT INDEXED   ', censusScan]]) {
    counters.reset();
    const rows = db.prepare(sql).all(bind(sql, p)).map(r => Number(r.id));
    say(`  ${label} : plan=${j(plan(db, sql, p))}`);
    say(`  ${label} : returned=${rows.length}/${K} ` +
        `unauthorized-returned=${rows.filter(i => !authorized.has(i)).length} ` +
        `rows-reached=${counters.seenCalls} (unauthorized: ${counters.seenUnauthorized.size}) ` +
        `unauthorized-bodies=${counters.rankUnauthorized.size}`);
  }
  db.close();
}

say('');
say('='.repeat(78));
say('END OF PROBE — no engine selected, adopted, recommended, or deployed.');
say('='.repeat(78));
