import { Pool } from 'pg';

let pool;
if (!pool) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function query(text, params) {
  return pool.query(text, params);
}
