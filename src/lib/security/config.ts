import { dev } from "$app/environment";

export type SecurityHeader = {
  name: string;
  value: string;
};

export type SecurityConfig = {
  headers: SecurityHeader[];
  verbose?: boolean;
};

const base: SecurityHeader[] = [
  { name: "X-Content-Type-Options", value: "nosniff" },
  { name: "X-Frame-Options", value: "SAMEORIGIN" },
  { name: "X-XSS-Protection", value: "0" },
  { name: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { name: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
];

const strict: SecurityHeader[] = [
  ...base,
  { name: "Cross-Origin-Resource-Policy", value: "same-site" },
  { name: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { name: "Server", value: "webserver" },
];

const hsts = {
  rampUp: "max-age=300",
  short: "max-age=86400",
  medium: "max-age=2592000",
  long: "max-age=63072000; includeSubDomains",
  preload: "max-age=63072000; includeSubDomains; preload",
} as const;

const production: SecurityHeader[] = [
  ...strict,
  { name: "Strict-Transport-Security", value: hsts.long },
];

export const RuleSet = {
  base,
  strict,
  production: dev ? strict : production,
  hsts,
};
