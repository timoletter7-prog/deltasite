-- Add unlimited_use column to giftcard table if it doesn't exist
ALTER TABLE giftcard ADD COLUMN IF NOT EXISTS unlimited_use BOOLEAN DEFAULT false;

-- Create unlimited use gift card - Can be used multiple times
INSERT INTO giftcard (code, remaining, percentage_discount, event, used, unlimited_use)
VALUES ('DELTA20', 0, 20, false, false, true)
ON CONFLICT (code) DO NOTHING;

-- View all gift cards with their discount information
-- SELECT code, remaining, percentage_discount, event, used, unlimited_use FROM giftcard ORDER BY created_at DESC;
