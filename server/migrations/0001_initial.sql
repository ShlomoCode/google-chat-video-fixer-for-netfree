CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL,
  user_agent TEXT,
  installation_uuid TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_date_type 
ON analytics(date, type);