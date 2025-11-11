import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const sql = neon(DATABASE_URL);