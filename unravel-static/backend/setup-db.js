const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneno VARCHAR(50),
  
  riddle_set_id INTEGER,
  start_time BIGINT,
  
  -- Scores
  scorepoints INTEGER DEFAULT 0,     -- phase1 + phase2 + phase3
  timebonus INTEGER DEFAULT 0,       -- bonus points
  finalscore INTEGER DEFAULT 0,      -- scorepoints + timebonus
  timetaken INTEGER,                -- seconds

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 🔁 Backward-compatible upgrades (SAFE)
ALTER TABLE users ADD COLUMN IF NOT EXISTS finalscore INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timetaken INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timebonus INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS scorepoints INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS game_data JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS riddle_set_id INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS start_time BIGINT;
`;

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to database...");
    await pool.query(schema);
    console.log("✅ Database schema ready (users table)");

    await pool.end();
  } catch (err) {
    console.error("❌ Database setup failed:", err);
    process.exit(1);
  }
}

setupDatabase();
