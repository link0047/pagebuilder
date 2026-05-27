import type { RemoteQuery } from "@sveltejs/kit";
import { deleteBuild, duplicateBuild, type BuildResult } from "$lib/api/builds.remote";

export async function duplicateBuildAction(
  id: string,
  queries: RemoteQuery<BuildResult[]>[]
): Promise<void> {
  try {
    await duplicateBuild({ id });
    await Promise.all(queries.map((q) => q.refresh()));
  } catch (error) {
    console.error("Failed to duplicate build:", error);
  }
}

export async function deleteBuildAction(
  id: string,
  queries: RemoteQuery<BuildResult[]>[]
): Promise<void> {
  try {
    await deleteBuild({ id });
    await Promise.all(queries.map((q) => q.refresh()));
  } catch (error) {
    console.error("Failed to delete build:", error);
  }
}
