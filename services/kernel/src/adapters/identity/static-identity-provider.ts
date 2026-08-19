/**
 * Development identity adapter.
 *
 * Sources: SPEC-0004, ADR-0007, docs/security/security-architecture.md:39,
 *          implementation/discoveries/DISC-0003-dev-identity-adapter.md.
 *
 * ⚠ DEVELOPMENT AND TEST ONLY.
 *
 * ADR-0007 forbids PCI implementing authentication itself. This adapter does not: it verifies
 * an opaque bearer token against an operator-supplied table and resolves it to a principal.
 * It stores no passwords, issues no tokens, and implements no authentication protocol.
 *
 * `config.ts` refuses to start when `PCI_IDENTITY_MODE=static` and `PCI_ENV=production`, so
 * this class cannot back a production deployment.
 */

import { timingSafeEqual } from 'node:crypto';

import type { Principal } from '../../domain/principal.ts';
import type { IdentityProvider } from '../../ports/identity.ts';
import type { StaticPrincipalConfig } from '../../config/config.ts';
import type { PrincipalId, TenantId } from '../../domain/identifiers.ts';

/**
 * Constant-time comparison of two UTF-8 strings.
 *
 * `timingSafeEqual` throws on length mismatch, which would itself leak length, so both inputs
 * are hashed to a fixed width first. Length is not secret here in practice, but a development
 * fixture is exactly the kind of code that gets copied into production, so it demonstrates the
 * correct pattern rather than a shortcut.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  const width = Math.max(bufferA.length, bufferB.length, 32);
  const paddedA = Buffer.alloc(width);
  const paddedB = Buffer.alloc(width);
  bufferA.copy(paddedA);
  bufferB.copy(paddedB);
  // Compare padded content AND original lengths, so padding cannot create a false match.
  return timingSafeEqual(paddedA, paddedB) && bufferA.length === bufferB.length;
}

export class StaticIdentityProvider implements IdentityProvider {
  readonly mode = 'static';
  private readonly principals: readonly StaticPrincipalConfig[];

  constructor(principals: readonly StaticPrincipalConfig[]) {
    this.principals = principals;
  }

  async verify(credential: string): Promise<Principal | null> {
    if (credential.length === 0) return null;

    // Every candidate is compared, without early exit, so verification time does not depend
    // on which entry matched or how many entries precede it.
    let matched: StaticPrincipalConfig | null = null;
    for (const candidate of this.principals) {
      if (constantTimeEquals(credential, candidate.token)) {
        matched = candidate;
      }
    }

    if (matched === null) return null;

    return {
      id: matched.subject as PrincipalId,
      tenantId: matched.tenantId as TenantId,
      actorType: matched.actorType,
      displayName: matched.displayName,
      roles: matched.roles,
      scopes: matched.scopes,
      delegatedBy: (matched.delegatedBy as PrincipalId | null) ?? null,
    };
  }
}
