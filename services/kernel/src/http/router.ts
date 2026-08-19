/**
 * Minimal HTTP router.
 *
 * Source: ADR-0015 (proposed) — no HTTP framework dependency;
 *         docs/engineering/claude-code-rules.md:25 — do not introduce a dependency when an
 *         existing approved capability satisfies the requirement.
 *
 * Routes are exact segment matches with `:name` parameters. There is deliberately no wildcard
 * matching, no regex routing, and no middleware stack: the kernel's surface is small and fixed,
 * and a general routing engine would be more machinery than the problem needs.
 */

export type RouteParams = Readonly<Record<string, string>>;

export type HttpResult = {
  readonly status: number;
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string>>;
};

export type RouteHandler<Ctx> = (context: Ctx, params: RouteParams) => Promise<HttpResult>;

type Route<Ctx> = {
  readonly method: string;
  readonly segments: readonly string[];
  readonly handler: RouteHandler<Ctx>;
  readonly pattern: string;
  /** Public routes skip authentication (health and readiness only). */
  readonly requiresAuth: boolean;
};

export type RouteMatch<Ctx> = {
  readonly handler: RouteHandler<Ctx>;
  readonly params: RouteParams;
  readonly requiresAuth: boolean;
  readonly pattern: string;
};

/**
 * A `const` object rather than a TypeScript `enum`: `enum` is not erasable syntax, so Node's
 * native type-stripping cannot execute it (see ADR-0015 and `erasableSyntaxOnly` in tsconfig).
 */
export const MatchKind = {
  Found: 'found',
  MethodNotAllowed: 'method_not_allowed',
  NotFound: 'not_found',
} as const;

export type MatchKind = (typeof MatchKind)[keyof typeof MatchKind];

export class Router<Ctx> {
  private readonly routes: Route<Ctx>[] = [];

  add(
    method: string,
    pattern: string,
    handler: RouteHandler<Ctx>,
    options: { requiresAuth?: boolean } = {},
  ): this {
    this.routes.push({
      method: method.toUpperCase(),
      segments: splitPath(pattern),
      handler,
      pattern,
      requiresAuth: options.requiresAuth ?? true,
    });
    return this;
  }

  match(
    method: string,
    path: string,
  ):
    | { kind: typeof MatchKind.Found; route: RouteMatch<Ctx> }
    | { kind: typeof MatchKind.MethodNotAllowed; allowed: string[] }
    | { kind: typeof MatchKind.NotFound } {
    const segments = splitPath(path);
    const pathMatches: Route<Ctx>[] = [];

    for (const route of this.routes) {
      const params = matchSegments(route.segments, segments);
      if (params === null) continue;
      pathMatches.push(route);
      if (route.method === method.toUpperCase()) {
        return {
          kind: MatchKind.Found,
          route: {
            handler: route.handler,
            params,
            requiresAuth: route.requiresAuth,
            pattern: route.pattern,
          },
        };
      }
    }

    if (pathMatches.length > 0) {
      return {
        kind: MatchKind.MethodNotAllowed,
        allowed: [...new Set(pathMatches.map((route) => route.method))].sort(),
      };
    }

    return { kind: MatchKind.NotFound };
  }
}

function splitPath(path: string): string[] {
  return path.split('/').filter((segment) => segment.length > 0);
}

function matchSegments(
  pattern: readonly string[],
  actual: readonly string[],
): RouteParams | null {
  if (pattern.length !== actual.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < pattern.length; index += 1) {
    const expected = pattern[index] as string;
    const received = actual[index] as string;

    if (expected.startsWith(':')) {
      // Percent-decoding happens here rather than on the whole path, so an encoded slash in a
      // parameter cannot change how the path was segmented.
      try {
        params[expected.slice(1)] = decodeURIComponent(received);
      } catch {
        return null;
      }
      continue;
    }
    if (expected !== received) return null;
  }
  return params;
}
