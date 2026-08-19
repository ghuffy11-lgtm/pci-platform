/**
 * Clock port.
 *
 * Time is injected rather than read from `Date` directly so that lifecycle windows,
 * validity ranges, and audit timestamps are deterministically testable. Kernel code must
 * never call `Date.now()` outside an adapter.
 */

export interface Clock {
  /** Current instant as an ISO-8601 string with millisecond precision. */
  nowIso(): string;
  nowMs(): number;
}

export const systemClock: Clock = {
  nowIso: () => new Date().toISOString(),
  nowMs: () => Date.now(),
};

/** Test double. Advances only when told to. */
export class FixedClock implements Clock {
  private current: number;

  constructor(startIso = '2026-08-19T00:00:00.000Z') {
    this.current = Date.parse(startIso);
  }

  nowIso(): string {
    return new Date(this.current).toISOString();
  }

  nowMs(): number {
    return this.current;
  }

  advance(ms: number): void {
    this.current += ms;
  }
}
