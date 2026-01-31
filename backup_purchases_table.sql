-- SQL voor backup_purchases tabel (voor aankoop backup)
CREATE TABLE backup_purchases (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  server_id VARCHAR(255) NOT NULL,
  player VARCHAR(255) NOT NULL,
  item VARCHAR(255) NOT NULL,
  executed BOOLEAN DEFAULT false,
  payment TEXT
);

-- Index voor betere performance
CREATE INDEX idx_backup_purchases_server_id ON backup_purchases(server_id);
CREATE INDEX idx_backup_purchases_player ON backup_purchases(player);
CREATE INDEX idx_backup_purchases_executed ON backup_purchases(executed);
