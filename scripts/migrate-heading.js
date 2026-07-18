/**
 * One-off migration: collapse the five parallel `title*` props into a single
 * `headings` array on every block that renders through BlockSection.
 *
 *   { title, titleSize, titleWeight, titleColor, titleLink }
 *     -> { headings: [{ text, size, weight, color, link }] }
 *
 * `titleAlignment` and `headingLevel` are NOT moved — they stay block-level.
 * Per-heading levels would let an author build an <h2> -> <h5> -> <h3> outline,
 * which the current shape makes unrepresentable, and that's worth keeping.
 *
 * Run order matters:
 *   1. Deploy BlockSection with the back-compat shim (reads `headings ?? title`)
 *   2. Clear locks, run this script
 *   3. Delete the shim
 *
 * Skipping step 1 leaves a window where unmigrated builds render no heading.
 *
 * Usage:
 *   node migrate-headings.js --dry-run                  # report only, no writes
 *   node migrate-headings.js --build <uuid>             # one build
 *   node migrate-headings.js --build <uuid> --dry-run
 *   node migrate-headings.js --all                      # builds + templates
 *   node migrate-headings.js --all --skip-templates     # builds only
 *
 * Requires DATABASE_URL in the environment, same as your SQL runner.
 */

import { Pool } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Blocks that forward title* props into BlockSection.
 *
 * FeaturedCategories has the same props.title / props.titleSize shape in its
 * schema, so it probably belongs here — but confirm it actually renders
 * through BlockSection first. If it has its own heading markup, migrating its
 * props moves them to `headings` where its renderer won't look, and the title
 * silently disappears.
 */
const MIGRATABLE = new Set([
  "EditorialBlock",
  "CollectionBlock",
  "RecommendationBlock",
  // "FeaturedCategories",  // <- verify before enabling
]);

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

/** Drop keys whose value is undefined/null so we don't write `"size": null`. */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  );
}

/**
 * Rewrite one component's props. Returns the SAME object reference when there's
 * nothing to do, so callers can cheaply detect "unchanged" and skip the write.
 */
export function migrateProps(props) {
  // Already migrated — idempotent, so re-running the script is harmless.
  if (Array.isArray(props.headings)) return props;

  // Nothing to migrate. Note this leaves titleSize/titleWeight/etc. in place if
  // they somehow exist without a title; they're inert, and dropping them would
  // be a second, unrelated cleanup.
  if (typeof props.title !== "string" || props.title === "") return props;

  const { title, titleSize, titleWeight, titleColor, titleLink, ...rest } = props;

  const heading = compact({
    text: title,
    size: titleSize,
    weight: titleWeight,
    color: titleColor,
    link: titleLink,
  });

  return { ...rest, headings: [heading] };
}

/**
 * Walk the node tree, migrating any block that uses BlockSection. Returns the
 * original reference when nothing changed anywhere in the subtree.
 */
export function migrateTree(node) {
  if (!node || typeof node !== "object") return node;

  let changed = false;

  let props = node.props;
  if (node.name && MIGRATABLE.has(node.name) && node.props) {
    const next = migrateProps(node.props);
    if (next !== node.props) {
      props = next;
      changed = true;
    }
  }

  let children = node.children;
  if (Array.isArray(node.children)) {
    const nextChildren = node.children.map(migrateTree);
    if (nextChildren.some((c, i) => c !== node.children[i])) {
      children = nextChildren;
      changed = true;
    }
  }

  if (!changed) return node;
  return {
    ...node,
    ...(props ? { props } : {}),
    ...(children ? { children } : {}),
  };
}

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    dryRun: false,
    all: false,
    buildId: null,
    skipTemplates: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--all":
        args.all = true;
        break;
      case "--skip-templates":
        args.skipTemplates = true;
        break;
      case "--build":
        args.buildId = argv[++i];
        if (!args.buildId || args.buildId.startsWith("--")) {
          throw new Error("--build requires a build id");
        }
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  // Require an explicit choice. Defaulting to --all would mean a bare
  // `node migrate-headings.js` rewrites every row in the database.
  if (!args.all && !args.buildId) {
    throw new Error(
      "Specify --all or --build <uuid>. Add --dry-run to preview."
    );
  }

  if (args.all && args.buildId) {
    throw new Error("--all and --build are mutually exclusive.");
  }

  return args;
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

async function migrateTable(pool, table, { dryRun, buildId }) {
  // Table name can't be parameterised, so it's interpolated — safe here because
  // it's one of two literals below, never user input.
  const where = buildId ? "WHERE id = $1" : "";
  const params = buildId ? [buildId] : [];

  const { rows } = await pool.query(
    `SELECT id, name, content FROM ${table} ${where}`,
    params
  );

  if (buildId && rows.length === 0) {
    console.log(`  ${table}: no row with id ${buildId}`);
    return 0;
  }

  let migrated = 0;
  let skipped = 0;

  for (const row of rows) {
    // `content` defaults to '{}' on builds, so guard the walk.
    if (!row.content || typeof row.content !== "object") {
      skipped++;
      continue;
    }

    const next = migrateTree(row.content);
    if (next === row.content) {
      skipped++;
      continue;
    }

    if (!dryRun) {
      // Write `content` only. Going through updateBuild() would refuse on a
      // locked row and would stamp updated_by with whoever runs this.
      //
      // The update_updated_at_column trigger still fires, so migrated rows get
      // a fresh updated_at. Rows we skip keep theirs — which is why the
      // unchanged check above matters beyond just saving a write.
      await pool.query(`UPDATE ${table} SET content = $1 WHERE id = $2`, [
        JSON.stringify(next),
        row.id,
      ]);
    }

    migrated++;
    console.log(`  ${dryRun ? "would migrate" : "migrated"}  ${row.id}  ${row.name}`);
  }

  console.log(
    `  ${table}: ${migrated} migrated, ${skipped} unchanged, ${rows.length} total\n`
  );
  return migrated;
}

async function clearLocks(pool, { dryRun, buildId }) {
  const where = buildId
    ? "WHERE locked_by IS NOT NULL AND id = $1"
    : "WHERE locked_by IS NOT NULL";
  const params = buildId ? [buildId] : [];

  if (dryRun) {
    const { rows } = await pool.query(
      `SELECT count(*)::int AS n FROM builds ${where}`,
      params
    );
    console.log(`  would clear ${rows[0].n} lock(s)\n`);
    return;
  }

  const { rows } = await pool.query(
    `UPDATE builds SET locked_by = NULL, locked_at = NULL ${where} RETURNING id`,
    params
  );
  console.log(`  cleared ${rows.length} lock(s)\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  const scope = args.buildId ? `build ${args.buildId}` : "all builds";
  console.log(`\n${args.dryRun ? "DRY RUN — no writes" : "MIGRATING"}  (${scope})\n`);

  try {
    // Clear first: a build open in someone's editor can save over the migration
    // afterwards, since their client still holds the pre-migration tree.
    await clearLocks(pool, args);

    let total = await migrateTable(pool, "builds", args);

    // Templates are global — a single build id doesn't identify one, and
    // migrating every template while targeting one build would be surprising.
    if (args.all && !args.skipTemplates) {
      total += await migrateTable(pool, "templates", args);
    } else if (args.buildId) {
      console.log("  templates: skipped (use --all to include them)\n");
    }

    console.log(`total: ${total} row(s) ${args.dryRun ? "would be " : ""}migrated`);

    if (!args.dryRun && total > 0) {
      console.log(
        "\nAnyone with an editor open still holds the old tree in memory."
      );
      console.log("Their next save will write it back. Confirm nobody is editing.");
    }

    if (args.buildId && !args.dryRun) {
      console.log(
        "\nNote: templates were not migrated. New builds created from an\n" +
        "unmigrated template will still carry the old title* shape."
      );
    }
  } finally {
    await pool.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\nMigration failed:", err.message ?? err);
    console.error("\nSafe to re-run — migrated rows short-circuit on props.headings.");
    process.exit(1);
  });
