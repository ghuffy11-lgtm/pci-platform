// Replicates supervisor.ps1's queue parse (lines 160-260) against the committed queue, so the
// TASK-0050 row is verified against the parser rather than assumed correct. DISC-0013 is why:
// a row that reads fine to a human silently stalled the Supervisor for a whole cycle.
//
// This reads the queue and prints. It changes nothing.

import { readFileSync } from 'node:fs';

const VALID = ['READY', 'IN_PROGRESS', 'COMPLETE', 'BLOCKED', 'PROPOSED', 'SUPERSEDED',
               'WAITING_FOR_ARCHITECTURE', 'WAITING_FOR_OPERATOR'];

const md = readFileSync('implementation/operations/CLAUDE-TASKS.md', 'utf8');
const tasks = new Map();

for (const line of md.split(/\r?\n/)) {
  if (!/^\s*\|\s*\*{0,2}(TASK-\d{4})\*{0,2}\s*\|/.test(line)) continue;
  const cells = line.trim().replace(/^\|+|\|+$/g, '').split('|').map(c => c.replace(/\*/g, '').trim());
  if (cells.length < 3) continue;
  const id = cells[0];
  if (tasks.has(id)) continue;                       // board row wins; later repeats ignored
  let status = null;
  for (const c of VALID) {
    if (new RegExp('\\b' + c + '\\b').test(cells[2])) {
      if (status === null || c.length > status.length) status = c;   // longest match wins
    }
  }
  const depends = [...(cells[3] ?? '').matchAll(/TASK-\d{4}/g)].map(m => m[0]);
  tasks.set(id, { id, status, depends });
}

const problems = [];
for (const t of tasks.values()) {
  if (t.status !== 'READY') continue;
  for (const d of t.depends) {
    const dt = tasks.get(d);
    if (!dt) problems.push(`${t.id} depends on unknown task ${d}`);
    else if (dt.status !== 'COMPLETE') problems.push(`${t.id} is READY but dependency ${d} is ${dt.status}`);
  }
}

const ready = [...tasks.values()].filter(t => t.status === 'READY');

console.log(`rows parsed          : ${tasks.size}`);
console.log(`TASK-0050 parsed as  : ${JSON.stringify(tasks.get('TASK-0050'))}`);
console.log(`TASK-0049 parsed as  : ${JSON.stringify(tasks.get('TASK-0049'))}`);
console.log(`PROBLEMS             : ${problems.length ? problems.join(' ; ') : 'none'}`);
console.log(`READY tasks          : ${ready.length ? ready.map(t => t.id).join(', ')
  : '(none) -> the Supervisor will NOOP, which is correct: only the Architecture Lead may authorize the next task'}`);
