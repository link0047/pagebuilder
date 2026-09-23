import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { Pool } from "@neondatabase/serverless";
import { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } from "$env/static/private";
import { sendResetEmail } from "$lib/server/email";

const pool = new Pool({
  connectionString: DATABASE_URL,
  idleTimeoutMillis: 60_000,
});

pool.on("error", (err: Error) => {
  console.error(JSON.stringify({
    level: "warn",
    source: "neon-auth-pool",
    message: err.message,
    time: new Date().toISOString(),
  }));
});

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { data, error } = await sendResetEmail(user.email, url, user.name);

      if (error) {
        console.error(JSON.stringify({
          level: "error",
          source: "auth-reset-email",
          message: error instanceof Error ? error.message : String(error),
          time: new Date().toISOString(),
        }));
      } else {
        console.log(JSON.stringify({
          level: "info",
          source: "auth-reset-email",
          message: "reset email sent",
          id: data?.id ?? null,
          time: new Date().toISOString(),
        }));
      }
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});
