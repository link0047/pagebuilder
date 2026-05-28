import type { Handle } from "@sveltejs/kit";
import { RuleSet, type SecurityHeader, type SecurityConfig } from "./config";

const prepareHeaders = (headers: SecurityHeader[]): Map<string, string | null> => {
  const map = new Map<string, string | null>();

  for (const header of headers) {
    const safeName = header.name.trim().toLowerCase();

    if (map.has(safeName)) {
      throw new Error(`Duplicate security header: "${header.name}"`);
    }

    map.set(safeName, header.value);
  }

  return map;
};

export const createSecurityHandle = (
  config: SecurityConfig = { headers: RuleSet.base }
): Handle => {
  const processedHeaders = prepareHeaders(config.headers);

  return async ({ event, resolve }) => {
    const response = await resolve(event);

    for (const [name, value] of processedHeaders) {
      if (value !== null) {
        if (config.verbose) console.log(`[security] setting "${name}" -> "${value}"`);
        response.headers.set(name, value);
      } else {
        if (config.verbose) console.log(`[security] deleting "${name}"`);
        response.headers.delete(name);
      }
    }

    return response;
  };
};

export const securityHandle = createSecurityHandle({ headers: RuleSet.production });
export { RuleSet };
