import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { Pool } from "@neondatabase/serverless";
import { DATABASE_URL } from "$env/static/private";


const pool = new Pool({ connectionString: DATABASE_URL });

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {

    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});