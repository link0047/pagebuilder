import { getRequestEvent, query, command } from "$app/server";
import { error, redirect, isHttpError } from "@sveltejs/kit";
import { sql } from "$lib/server/database";
import { uploadToCloudinary } from "$lib/server/cloudinary";
import {
  createBuildSchema,
  createTemplateSchema,
  updateBuildSchema,
  updateTemplateSchema,
  deleteBuildSchema,
  deleteTemplateSchema,
  duplicateBuildSchema,
  lockBuildSchema,
  getBuildSchema,
  listBuildsSchema,
  recentBuildsSchema,
  uploadThumbnailSchema,
} from "$lib/schema/builds";

const LOCK_STALE_INTERVAL = "5 minutes";
const DEFAULT_PAGE_SIZE = 20;

export type BuildListItem = {
  id: string;
  name: string;
  build_type: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  locked_by: string | null;
  locked_at: string | null;
  author: string;
  updated_by_name: string;
  locked_by_name: string | null;
};

export type BuildResult = BuildListItem & {
  content: any; // or RootNode if you import it
};

export type TemplateResult = {
  id: string;
  name: string;
  description: string | null;
  build_type: string;
  content: any;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

type Cursor = { created_at: string; id: string };

function requireAuth() {
  const { locals } = getRequestEvent();
  if (!locals.user) redirect(307, "/login");
  return locals.user;
}

// Shared SELECT for list rows. No `content` (fetched lazily via getBuild).
const buildListSelect = sql`
  SELECT
    b.id,
    b.name,
    b.build_type,
    b.created_at,
    b.updated_at,
    b.thumbnail_url,
    b.locked_by,
    b.locked_at,
    u1.name AS author,
    u2.name AS updated_by_name,
    u3.name AS locked_by_name
  FROM builds b
  LEFT JOIN "user" u1 ON b.created_by = u1.id
  LEFT JOIN "user" u2 ON b.updated_by = u2.id
  LEFT JOIN "user" u3 ON b.locked_by = u3.id
`;

// Keyset clause. Order columns/directions MUST match the ORDER BY in each caller.
function keysetClause(cursor?: Cursor) {
  return cursor
    ? sql`(b.created_at, b.id) < (${cursor.created_at}, ${cursor.id})`
    : sql`TRUE`;
}

export const getBuilds = query(listBuildsSchema, async ({ cursor, limit = DEFAULT_PAGE_SIZE }) => {
  requireAuth();
  return await sql`
    ${buildListSelect}
    WHERE ${keysetClause(cursor)}
    ORDER BY b.created_at DESC, b.id DESC
    LIMIT ${limit}
  ` as BuildListItem[];
});

export const getUserBuilds = query(listBuildsSchema, async ({ cursor, limit = DEFAULT_PAGE_SIZE }) => {
  const user = requireAuth();
  return await sql`
    ${buildListSelect}
    WHERE b.created_by = ${user.id}
      AND ${keysetClause(cursor)}
    ORDER BY b.created_at DESC, b.id DESC
    LIMIT ${limit}
  ` as BuildListItem[];
});

export const getRecentBuilds = query(recentBuildsSchema, async ({ limit = 5 }) => {
  requireAuth();
  return await sql`
    ${buildListSelect}
    ORDER BY b.created_at DESC, b.id DESC
    LIMIT ${limit}
  ` as BuildListItem[];
});

// Single full row (with content) for opening a build in the editor.
export const getBuild = query(getBuildSchema, async ({ id }) => {
  requireAuth();
  const result = await sql`
    SELECT
      b.id, b.name, b.build_type, b.created_at, b.updated_at,
      b.content, b.thumbnail_url, b.locked_by, b.locked_at,
      u1.name AS author,
      u2.name AS updated_by_name,
      u3.name AS locked_by_name
    FROM builds b
    LEFT JOIN "user" u1 ON b.created_by = u1.id
    LEFT JOIN "user" u2 ON b.updated_by = u2.id
    LEFT JOIN "user" u3 ON b.locked_by = u3.id
    WHERE b.id = ${id}
  ` as BuildResult[];

  if (result.length === 0) error(404, "Build not found");
  return result[0];
});

export const createBuild = command(createBuildSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  const createdBy = user.id;
  try {
    const result = await sql`
      INSERT INTO builds (name, build_type, content, thumbnail_url, created_by, updated_by)
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createdBy})
      RETURNING id, name;
    `;
    return result[0] as { id: string; name: string };
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to create build: ${message}`);
    error(500, `Failed to create build: ${message}`);
  }
});

export const updateBuild = command(updateBuildSchema, async ({ id, name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  try {
    const result = await sql`
      UPDATE builds
      SET
        name = COALESCE(${name}, name),
        build_type = COALESCE(${buildType}, build_type),
        content = COALESCE(${content}, content),
        thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
        updated_by = ${user.id},
        updated_at = NOW()
      WHERE id = ${id}
        AND (
          locked_by IS NULL
          OR locked_by = ${user.id}
          OR locked_at < NOW() - (${LOCK_STALE_INTERVAL})::interval
        )
      RETURNING id, name, updated_at, locked_by, locked_at;
    `;
    if (result.length === 0) {
      const existing = await sql`
        SELECT u.name AS locked_by_name
        FROM builds b
        LEFT JOIN "user" u ON b.locked_by = u.id
        WHERE b.id = ${id}
      `;
      if (existing.length === 0) error(404, "Build not found");
      error(423, `Build is locked by ${existing[0].locked_by_name ?? "another user"}`);
    }
    return result[0];
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to update build: ${message}`);
    error(500, `Failed to update build: ${message}`);
  }
});

export const deleteBuild = command(deleteBuildSchema, async ({ id }) => {
  const user = requireAuth();
  try {
    const result = await sql`
      DELETE FROM builds
      WHERE id = ${id} AND created_by = ${user.id}
      RETURNING id;
    `;
    if (result.length === 0) error(404, "Build not found or unauthorized");
    return { success: true };
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to delete build: ${message}`);
    error(500, `Failed to delete build: ${message}`);
  }
});

export const duplicateBuild = command(duplicateBuildSchema, async ({ id }) => {
  const user = requireAuth();
  try {
    const original = await sql`
      SELECT name, build_type, content, thumbnail_url
      FROM builds
      WHERE id = ${id}
    `;
    if (original.length === 0) error(404, "Build not found");
    const build = original[0];
    const result = await sql`
      INSERT INTO builds (name, build_type, content, thumbnail_url, created_by, updated_by)
      VALUES (
        ${`${build.name} (Copy)`},
        ${build.build_type},
        ${build.content},
        ${build.thumbnail_url},
        ${user.id},
        ${user.id}
      )
      RETURNING id, name;
    `;
    return result[0] as { id: string; name: string };
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to duplicate build: ${message}`);
    error(500, `Failed to duplicate build: ${message}`);
  }
});

export const getTemplates = query(async () => {
  requireAuth();
  return await sql`
    SELECT
      id,
      name,
      description,
      build_type,
      content,
      thumbnail_url,
      created_at,
      updated_at
    FROM templates
    ORDER BY created_at DESC
  ` as TemplateResult[];
});

export const createTemplate = command(createTemplateSchema, async ({ name, description, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  try {
    const result = await sql`
      INSERT INTO templates (name, description, build_type, content, thumbnail_url, created_by, updated_by)
      VALUES (${name}, ${description ?? null}, ${buildType}, ${content}, ${thumbnailUrl}, ${user.id}, ${user.id})
      RETURNING id, name;
    `;
    return result[0] as { id: string; name: string };
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to create template: ${message}`);
    error(500, `Failed to create template: ${message}`);
  }
});

export const updateTemplate = command(updateTemplateSchema, async ({ id, name, description, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  try {
    const result = await sql`
      UPDATE templates
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        build_type = COALESCE(${buildType}, build_type),
        content = COALESCE(${content}, content),
        thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
        updated_by = ${user.id},
        updated_at = NOW()
      WHERE id = ${id} AND created_by = ${user.id}
      RETURNING *;
    `;
    if (result.length === 0) error(404, "Template not found or unauthorized");
    return result[0];
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to update template: ${message}`);
    error(500, `Failed to update template: ${message}`);
  }
});

export const deleteTemplate = command(deleteTemplateSchema, async ({ id }) => {
  const user = requireAuth();
  try {
    const result = await sql`DELETE FROM templates WHERE id = ${id} AND created_by = ${user.id} RETURNING *`;
    if (result.length === 0) error(404, "Template not found or unauthorized");
    return { success: true };
  } catch (err) {
    if (isHttpError(err)) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to delete template: ${message}`);
    error(500, `Failed to delete template: ${message}`);
  }
});

export const acquireLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();
  const result = await sql`
    UPDATE builds
    SET locked_by = ${user.id}, locked_at = NOW()
    WHERE id = ${id}
      AND (
        locked_by IS NULL
        OR locked_by = ${user.id}
        OR locked_at < NOW() - (${LOCK_STALE_INTERVAL})::interval
      )
    RETURNING id, locked_by, locked_at
  `;
  if (result.length === 0) {
    const existing = await sql`
      SELECT u.name AS locked_by_name
      FROM builds b
      LEFT JOIN "user" u ON b.locked_by = u.id
      WHERE b.id = ${id}
    `;
    if (existing.length === 0) error(404, "Build not found");
    error(423, `Build is locked by ${existing[0].locked_by_name ?? "another user"}`);
  }
  return result[0];
});

export const releaseLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();
  await sql`
    UPDATE builds SET locked_by = NULL, locked_at = NULL
    WHERE id = ${id} AND locked_by = ${user.id}
  `;
  return { success: true };
});

export const refreshLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();
  await sql`
    UPDATE builds SET locked_at = NOW()
    WHERE id = ${id} AND locked_by = ${user.id}
  `;
  return { success: true };
});

export const uploadThumbnail = command(uploadThumbnailSchema, async ({ base64, buildId, folder }) => {
  const response = await fetch(base64);
  const blob = await response.blob();
  const publicId = `${folder}/${buildId}`;
  const url = await uploadToCloudinary(blob, publicId);
  return { url };
});
