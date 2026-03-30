import { neon } from '@neondatabase/serverless';

// Connect to Neon Postgres using DATABASE_URL from environment variables
const sql = neon(process.env.DATABASE_URL);

export default sql;
