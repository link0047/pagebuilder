import { goto } from "$app/navigation";
import { getBuild, acquireLock } from "$lib/api/builds.remote";
import { getAppState } from "$lib/components/app-state.svelte";

export type OpenBuildResult =
  | { ok: true }
  | { ok: false; error: unknown };

// Opens an existing, persisted build into the editor:
// acquire the lock, fetch full content, load into app state, navigate.
// On failure (e.g. 423 locked) it surfaces a status message and returns
// { ok: false, error } — it never throws, so callers branch on `ok`.
export async function openBuild(
  appState: ReturnType<typeof getAppState>,
  build: { id: string; locked_by_name?: string | null }
): Promise<OpenBuildResult> {
  try {
    await acquireLock({ id: build.id });
    const full = await getBuild({ id: build.id });
    appState.loadBuild(full.content, full.id, full.name);
    appState.acquireLock(appState.user?.id ?? "");
    await goto("/editor");
    return { ok: true };
  } catch (error) {
    appState.setStatusMessage(
      `This build is being edited by ${build.locked_by_name ?? "another user"}`
    );
    return { ok: false, error };
  }
}
