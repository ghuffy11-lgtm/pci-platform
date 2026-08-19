/**
 * Secret-material guard.
 *
 * Sources:
 *   docs/knowledge/canonical-object-schema.md invariant 6 ("Secrets are excluded")
 *   docs/security/data-classification.md:23 (Restricted data must never be placed in Knowledge Objects)
 *   ADR-0009 (secrets never in Git, knowledge objects, prompts, logs, or model context)
 *   SPEC-0006 ("Audit records must not contain secrets")
 *
 * This is a defence-in-depth control, not a guarantee. It rejects attribute keys whose names
 * indicate credential material, and values that match well-known credential formats. A
 * determined caller can still smuggle a secret into a field named `notes`; the control exists
 * to stop the common accident, and that limitation is recorded in the WP-0001 report.
 *
 * The guard is applied on the write path for object attributes, relationship attributes, and
 * audit change summaries.
 */

import type { FieldIssue } from './errors.ts';

/**
 * Key names that indicate credential material.
 * Matched case-insensitively against the whole key and against snake/camel/kebab segments.
 */
const SECRET_KEY_PATTERN =
  /(^|[_\-.])(password|passwd|pwd|secret|token|api[_\-]?key|apikey|private[_\-]?key|privatekey|credential|credentials|client[_\-]?secret|access[_\-]?key|secret[_\-]?key|auth|authorization|bearer|session[_\-]?id|cookie|salt|passphrase|otp|mfa[_\-]?code)([_\-.]|$)/i;

/**
 * Value shapes that are recognisably credential material regardless of the key name.
 * Kept deliberately narrow to avoid false positives on ordinary text.
 */
const SECRET_VALUE_PATTERNS: readonly { readonly name: string; readonly re: RegExp }[] = [
  // Covers RSA/EC/DSA/OPENSSH/ENCRYPTED and unqualified PEM private-key headers.
  { name: 'pem_private_key', re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/ },
  { name: 'pem_certificate_request', re: /-----BEGIN CERTIFICATE REQUEST-----/ },
  { name: 'jwt', re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/ },
  { name: 'aws_access_key_id', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { name: 'github_token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: 'slack_token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'basic_auth_url', re: /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s:@]+@/i },
];

/** Maximum nesting depth for an attribute bag. Bounds traversal cost and JSONB abuse. */
const MAX_DEPTH = 8;
/** Maximum serialised size of an attribute bag, in bytes. */
const MAX_ATTRIBUTE_BYTES = 256 * 1024;

export function looksLikeSecretKey(key: string): boolean {
  return SECRET_KEY_PATTERN.test(key);
}

export function matchSecretValue(value: string): string | null {
  for (const { name, re } of SECRET_VALUE_PATTERNS) {
    if (re.test(value)) return name;
  }
  return null;
}

/**
 * Walk an attribute bag and collect issues.
 * Returns an empty array when the bag is clean.
 */
export function findSecretMaterial(
  bag: Readonly<Record<string, unknown>>,
  fieldPrefix: string,
): FieldIssue[] {
  const issues: FieldIssue[] = [];

  const walk = (value: unknown, path: string, depth: number): void => {
    if (depth > MAX_DEPTH) {
      issues.push({
        field: path,
        rule: 'max_depth',
        message: `Nesting exceeds the maximum depth of ${MAX_DEPTH}`,
      });
      return;
    }

    if (typeof value === 'string') {
      const match = matchSecretValue(value);
      if (match !== null) {
        issues.push({
          field: path,
          rule: 'secret_material',
          message: `Value appears to contain credential material (${match}). Secrets must not be stored in Knowledge Objects; see ADR-0009.`,
        });
      }
      return;
    }

    if (value === null || typeof value !== 'object') return;

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, `${path}[${index}]`, depth + 1));
      return;
    }

    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      const childPath = `${path}.${key}`;
      if (looksLikeSecretKey(key)) {
        issues.push({
          field: childPath,
          rule: 'secret_key',
          message: `Field name '${key}' indicates credential material. Secrets must not be stored in Knowledge Objects; see ADR-0009 and docs/security/data-classification.md.`,
        });
        // Do not descend: the value may be a secret and must not be inspected further.
        continue;
      }
      walk(entry, childPath, depth + 1);
    }
  };

  walk(bag, fieldPrefix, 0);
  return issues;
}

/** Validate size and shape of an attribute bag. */
export function findAttributeShapeIssues(
  bag: unknown,
  field: string,
): FieldIssue[] {
  const issues: FieldIssue[] = [];

  if (bag === null || typeof bag !== 'object' || Array.isArray(bag)) {
    issues.push({
      field,
      rule: 'type',
      message: 'Attributes must be a JSON object',
    });
    return issues;
  }

  let serialised: string;
  try {
    serialised = JSON.stringify(bag);
  } catch {
    issues.push({
      field,
      rule: 'serialisable',
      message: 'Attributes must be JSON-serialisable (no circular references)',
    });
    return issues;
  }

  if (serialised === undefined) {
    issues.push({ field, rule: 'serialisable', message: 'Attributes must be JSON-serialisable' });
    return issues;
  }

  const bytes = Buffer.byteLength(serialised, 'utf8');
  if (bytes > MAX_ATTRIBUTE_BYTES) {
    issues.push({
      field,
      rule: 'max_size',
      message: `Attributes exceed the maximum size of ${MAX_ATTRIBUTE_BYTES} bytes (got ${bytes})`,
    });
  }

  return issues;
}

/**
 * Redact anything secret-shaped from a structure destined for an audit record or log line.
 *
 * Unlike the validators above this never throws — audit and logging must not be defeated by
 * unexpected input, and SPEC-0006 requires the record to be written even on failure paths.
 */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return '[truncated]';

  if (typeof value === 'string') {
    return matchSecretValue(value) === null ? value : '[redacted]';
  }

  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((entry) => redact(entry, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    out[key] = looksLikeSecretKey(key) ? '[redacted]' : redact(entry, depth + 1);
  }
  return out;
}
