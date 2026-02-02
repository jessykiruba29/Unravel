CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneno VARCHAR(50),

  riddle_set_id INTEGER NOT NULL,
  start_time BIGINT,
  
  scorepoints INTEGER DEFAULT 0,
  timebonus INTEGER DEFAULT 0,
  finalscore INTEGER DEFAULT 0,
  timetaken INTEGER,

  game_data JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
