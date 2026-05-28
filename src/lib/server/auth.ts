import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { Pool } from "@neondatabase/serverless";
import { DATABASE_URL, BETTER_AUTH_URL } from "$env/static/private";
import { sendResetEmail } from "$lib/server/email";

const pool = new Pool({ connectionString: DATABASE_URL });

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { data, error } = await sendResetEmail(user.email, url, user.name);

      if (error) {
        console.error("Failed to send reset email:", error);
      } else {
        console.log(data);
      }
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});
