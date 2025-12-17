import { getRequestEvent, query, command } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { sql } from "$lib/server/database";
import { 
  createBuildSchema,
  createTemplateSchema,
  updateBuildSchema,
  updateTemplateSchema,
  deleteBuildSchema,
  deleteTemplateSchema,
  duplicateBuildSchema
} from "$lib/schema/builds";

type BuildResult = {
  id: string;
  name: string;
  build_type: string;
  author: string;
  updated_at: string;
  content: any; // or RootNode if you import it
  thumbnail_url: string | null;
};

function requireAuth() {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    redirect(307, "/login");
  }

  return locals.user;
}

export const getBuilds = query(async () => {
  requireAuth();

  const builds = await sql`
    SELECT 
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content, 
      b.thumbnail_url,
      u.name as author
    FROM builds b
    LEFT JOIN "user" u ON b.created_by = u.id
    ORDER BY b.created_at DESC
  ` as BuildResult[];

  return builds;
});

export const getRecentBuilds = query(async () => {
  requireAuth();

  const builds = await sql`
    SELECT 
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content, 
      b.thumbnail_url,
      u.name as author
    FROM builds b
    LEFT JOIN "user" u ON b.created_by = u.id
    ORDER BY b.created_at DESC
    LIMIT 5
  ` as BuildResult[];

  return builds;
});

export const getUserBuilds = query(async () => {
  const user = requireAuth();

  const builds = await sql`
    SELECT 
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content, 
      b.thumbnail_url,
      u.name as author
    FROM builds b
    LEFT JOIN "user" u ON b.created_by = u.id
    WHERE b.created_by = ${user.id}
    ORDER BY b.created_at DESC
  ` as BuildResult[];

  return builds;
});

export const getTemplates = query(async () => {
  requireAuth();
  
  const builds = await sql`SELECT * FROM templates ORDER BY created_at DESC`;
  return builds;
});

export const createBuild = command(createBuildSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  const createdBy = user.id;

  try {
    await sql`
      INSERT INTO builds (
        name, 
        build_type, 
        content, 
        thumbnail_url, 
        created_by, 
        updated_by
      )
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createdBy})
      RETURNING id;
    `;
  } catch(err) {
    console.error("Error creating build:", err);
    error(500, "Failed to create build");
  }
});

export const createTemplate = command(createTemplateSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  const createdBy = user.id;
  
  try {
    const result = await sql`
      INSERT INTO templates (
        name, 
        build_type, 
        content, 
        thumbnail_url, 
        created_by, 
        updated_by
      )
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createdBy})
      RETURNING id;
    `;
    
    return result[0];
  } catch(err) {
    console.error('Error creating template:', err);
    error(500, 'Failed to create template');
  }
});

export const updateBuild = command(updateBuildSchema, async ({ id, name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  
  try {
    // Verify ownership
    const existing = await sql`SELECT created_by FROM builds WHERE id = ${id}`;
    
    if (existing.length === 0) {
      error(404, "Build not found");
    }
    
    if (existing[0].created_by !== user.id) {
      error(403, "Unauthorized");
    }

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
      RETURNING *;
    `;
    
    return result[0];
  } catch(err) {
    console.error("Error updating build:", err);
    error(500, "Failed to update build");
  }
});

export const updateTemplate = command(updateTemplateSchema, async ({ id, name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  
  try {
    // Verify ownership
    const existing = await sql`SELECT created_by FROM templates WHERE id = ${id}`;
    
    if (existing.length === 0) {
      error(404, "Template not found");
    }
    
    if (existing[0].created_by !== user.id) {
      error(403, "Unauthorized");
    }
    
    const result = await sql`
      UPDATE templates
      SET 
        name = COALESCE(${name}, name),
        build_type = COALESCE(${buildType}, build_type),
        content = COALESCE(${content}, content),
        thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
        updated_by = ${user.id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    
    return result[0];
  } catch(err) {
    console.error("Error updating template:", err);
    error(500, "Failed to update template");
  }
});

export const deleteBuild = command(deleteBuildSchema, async ({ id }) => {
  const user = requireAuth();
  
  try {
    const existing = await sql`SELECT created_by FROM builds WHERE id = ${id}`;
    
    if (existing.length === 0) {
      error(404, "Build not found");
    }
    
    if (existing[0].created_by !== user.id) {
      error(403, "Unauthorized");
    }
    
    await sql`DELETE FROM builds WHERE id = ${id}`;
    
    return { success: true };
  } catch(err) {
    console.error("Error deleting build:", err);
    error(500, "Failed to delete build");
  }
});

export const deleteTemplate = command(deleteTemplateSchema, async ({ id }) => {
  const user = requireAuth();
  
  try {
    const existing = await sql`SELECT created_by FROM templates WHERE id = ${id}`;
    
    if (existing.length === 0) {
      error(404, "Template not found");
    }
    
    if (existing[0].created_by !== user.id) {
      error(403, "Unauthorized");
    }
    
    await sql`DELETE FROM templates WHERE id = ${id}`;
    
    return { success: true };
  } catch(err) {
    console.error("Error deleting template:", err);
    error(500, "Failed to delete template");
  }
});

export const duplicateBuild = command(duplicateBuildSchema, async ({ id }) => {
  const user = requireAuth();
  
  try {
    const original = await sql`
      SELECT 
        name,
        build_type,
        content,
        thumbnail_url
      FROM builds 
      WHERE id = ${id}
    `;
    
    if (original.length === 0) {
      error(404, "Build not found");
    }
    
    const build = original[0];

    console.log({ build });
    
    const result = await sql`
      INSERT INTO builds (
        name,
        build_type,
        content,
        thumbnail_url,
        created_by,
        updated_by
      )
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
    
    return result[0];
  } catch(err) {
    console.error("Error duplicating build:", err);
    error(500, "Failed to duplicate build");
  }
});