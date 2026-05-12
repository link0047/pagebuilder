import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/server/auth";
import { building } from "$app/environment";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason);
  // Don't crash — log and continue
  // Sentry.captureException(reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  // Don't crash — log and continue
  // Sentry.captureException(error);
});
