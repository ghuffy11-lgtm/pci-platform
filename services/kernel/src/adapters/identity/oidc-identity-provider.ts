/**
 * OIDC identity adapter — DECLARED SEAM, NOT IMPLEMENTED.
 *
 * Sources: SPEC-0004, ADR-0007.
 *
 * WP-0001 Non-Scope explicitly excludes "Production identity provider integration beyond an
 * adapter boundary". This file IS that boundary.
 *
 * It throws rather than returning a permissive default. A stub that silently accepted tokens,
 * or that fell back to the static adapter, would be an authentication bypass — which is why
 * `verify` fails closed and `config.ts` requires issuer and audience before this mode can even
 * be selected.
 *
 * A future work package must implement:
 *   - OIDC discovery against PCI_OIDC_ISSUER
 *   - JWKS retrieval with caching and key rotation
 *   - signature, issuer, audience, expiry, and nonce validation
 *   - claim-to-principal mapping (subject, tenant, roles, scopes)
 *   - offline/air-gapped key material handling per SPEC-0026
 */

import { NotImplementedError } from '../../domain/errors.ts';
import type { Principal } from '../../domain/principal.ts';
import type { IdentityProvider } from '../../ports/identity.ts';

export class OidcIdentityProvider implements IdentityProvider {
  readonly mode = 'oidc';
  private readonly issuer: string;
  private readonly audience: string;

  constructor(options: { issuer: string; audience: string }) {
    this.issuer = options.issuer;
    this.audience = options.audience;
  }

  async verify(_credential: string): Promise<Principal> {
    throw new NotImplementedError(
      `OIDC token verification against issuer '${this.issuer}' (audience '${this.audience}')`,
      'SPEC-0004 and ADR-0007; scheduled beyond WP-0001, whose Non-Scope excludes production ' +
        'identity provider integration',
    );
  }
}
