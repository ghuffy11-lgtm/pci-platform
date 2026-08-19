/**
 * Structured logging with correlation.
 *
 * Source: WP-0001 scope item 13, docs/operations/observability.md "Required Correlation",
 *         ADR-0008 (observability standard), ADR-0009 (secrets never in logs).
 *
 * Log records are JSON lines on stdout. Field names follow OpenTelemetry semantic-convention
 * naming where an equivalent exists, so that adding an OTel exporter later is a wiring change
 * rather than a rewrite. WP-0001 does not introduce an OTel SDK dependency — no collector is
 * in scope, and adding an unused exporter would be the speculative dependency the operating
 * rules prohibit.
 */

import { redact } from '../domain/secret-guard.ts';

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && (LOG_LEVELS as readonly string[]).includes(value);
}

export type LogFields = Record<string, unknown>;

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
  /** Derive a logger that stamps `fields` onto every record. */
  child(fields: LogFields): Logger;
}

type Sink = (line: string) => void;

const defaultSink: Sink = (line) => process.stdout.write(line + '\n');

export class JsonLogger implements Logger {
  private readonly level: LogLevel;
  private readonly base: LogFields;
  private readonly sink: Sink;

  constructor(options: { level: LogLevel; base?: LogFields; sink?: Sink }) {
    this.level = options.level;
    this.base = options.base ?? {};
    this.sink = options.sink ?? defaultSink;
  }

  debug(message: string, fields?: LogFields): void {
    this.write('debug', message, fields);
  }

  info(message: string, fields?: LogFields): void {
    this.write('info', message, fields);
  }

  warn(message: string, fields?: LogFields): void {
    this.write('warn', message, fields);
  }

  error(message: string, fields?: LogFields): void {
    this.write('error', message, fields);
  }

  child(fields: LogFields): Logger {
    return new JsonLogger({
      level: this.level,
      base: { ...this.base, ...fields },
      sink: this.sink,
    });
  }

  private write(level: LogLevel, message: string, fields?: LogFields): void {
    if (LEVEL_RANK[level] < LEVEL_RANK[this.level]) return;

    // Redaction is unconditional. ADR-0009 forbids secrets in logs, and a log call site is
    // exactly where a careless `{ ...request.body }` tends to appear.
    const merged = redact({ ...this.base, ...(fields ?? {}) }) as LogFields;

    const record = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...merged,
    };

    let line: string;
    try {
      line = JSON.stringify(record);
    } catch {
      line = JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        logError: 'fields_not_serialisable',
      });
    }
    this.sink(line);
  }
}

/** Discards everything. Used by tests that assert on behaviour rather than output. */
export class NullLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
  child(): Logger {
    return this;
  }
}

/** Captures records in memory so tests can assert on what was logged — and what was redacted. */
export class MemoryLogger implements Logger {
  readonly records: { level: LogLevel; message: string; fields: LogFields }[] = [];
  private readonly base: LogFields;

  constructor(base: LogFields = {}) {
    this.base = base;
  }

  debug(message: string, fields?: LogFields): void {
    this.capture('debug', message, fields);
  }

  info(message: string, fields?: LogFields): void {
    this.capture('info', message, fields);
  }

  warn(message: string, fields?: LogFields): void {
    this.capture('warn', message, fields);
  }

  error(message: string, fields?: LogFields): void {
    this.capture('error', message, fields);
  }

  child(fields: LogFields): Logger {
    const child = new MemoryLogger({ ...this.base, ...fields });
    // Share the record array so assertions see child output too.
    Object.defineProperty(child, 'records', { value: this.records });
    return child;
  }

  private capture(level: LogLevel, message: string, fields?: LogFields): void {
    this.records.push({
      level,
      message,
      fields: redact({ ...this.base, ...(fields ?? {}) }) as LogFields,
    });
  }
}
