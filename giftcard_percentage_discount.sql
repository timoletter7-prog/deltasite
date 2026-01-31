-- Add percentage discount column to giftcard table
ALTER TABLE giftcard
ADD COLUMN IF NOT EXISTS percentage_discount DECIMAL(5,2) DEFAULT 0;

-- Add comment to explain the column
COMMENT ON COLUMN giftcard.percentage_discount IS 'Percentage discount (0-100) that applies even when remaining balance is 0';

-- Update existing giftcards to have default percentage discount of 0
UPDATE giftcard
SET percentage_discount = 0
WHERE percentage_discount IS NULL;
