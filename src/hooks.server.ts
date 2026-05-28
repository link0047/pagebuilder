import type { Handle } from "@sveltejs/kit";

import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";
import { building, dev } from "$app/environment";
import { auth } from "$lib/server/auth";
import { securityHandle } from "$lib/security";
import { attempt } from "$lib/utils/attempt";

if (dev) {
  if (!process.listenerCount("unhandledRejection")) {
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled rejection:", reason);
    });
  }

  if (!process.listenerCount("uncaughtException")) {
    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
    });
  }
}

const authHandle: Handle = async ({ event, resolve }) => {
  if (!event.route.id) return resolve(event);

  const [error, session] = await attempt(
    auth.api.getSession({ headers: event.request.headers })
  );

  if (error) {
    console.error("[auth] getSession failed:", error);
  }

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}

export const handle = sequence(securityHandle, authHandle);
