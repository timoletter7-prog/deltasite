-- Add missing columns to giftcard table for event giftcards
ALTER TABLE giftcard
ADD COLUMN IF NOT EXISTS event BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS items TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Update existing giftcards to have default values
UPDATE giftcard
SET event = false,
    items = '{}',
    used = false
WHERE event IS NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN giftcard.event IS 'Whether this is an event giftcard that redirects to reward selection';
COMMENT ON COLUMN giftcard.items IS 'Array of item names that can be chosen as rewards for event giftcards';
COMMENT ON COLUMN giftcard.used IS 'Whether the giftcard has been redeemed';
COMMENT ON COLUMN giftcard.used_at IS 'Timestamp when the giftcard was redeemed';
