import { Pool, neonConfig } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

neonConfig.fetchConnectionCache = true;

const migrationFile = process.argv[2];
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!migrationFile) {
  console.error("Error: Missing migration file path.");
  process.exit(1);
}

async function runMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log(`Running migration: ${migrationFile}`);
    const sqlContent = await readFile(migrationFile, "utf-8");
    await pool.query(sqlContent);
    console.log("SQL file executed migration successfully!");
  } catch (error) {
    console.error("Error executing SQL file:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();