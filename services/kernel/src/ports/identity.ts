/**
 * Identity port.
 *
 * Source: SPEC-0004, ADR-0007.
 *
 * ADR-0007: "PCI applications must not implement password storage, token issuance, or bespoke
 * authentication protocols." This port therefore exposes VERIFICATION ONLY. There is no
 * `issueToken`, no `createUser`, no `setPassword` — the absence is deliberate and structural.
 *
 * WP-0001 places production identity integration out of scope "beyond an adapter boundary".
 * This file is that boundary. See implementation/discoveries/DISC-0003-dev-identity-adapter.md.
 */

import type { Principal } from '../domain/principal.ts';

export interface IdentityProvider {
  /**
   * Verify a bearer credential and resolve it to a principal.
   * Returns null when the credential is absent, malformed, expired, or unknown.
   *
   * Implementations MUST NOT distinguish those cases to the caller: doing so is a credential
   * oracle. The HTTP layer maps null to a single opaque 401.
   */
  verify(credential: string): Promise<Principal | null>;

  /** Identifies the adapter in health output and startup logs. */
  readonly mode: string;
}
