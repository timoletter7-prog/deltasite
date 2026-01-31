

-- SQL code to create gift cards with percentage discounts in the database
-- These gift cards will provide percentage discounts even when remaining balance is 0

-- IMPORTANT: First run the column addition SQL from giftcard_percentage_discount.sql
-- ALTER TABLE giftcard ADD COLUMN IF NOT EXISTS percentage_discount DECIMAL(5,2) DEFAULT 0;

-- Method 1: Create new gift cards with unique codes
-- Use this if you want to add new gift cards to the table

INSERT INTO giftcard (code, remaining, percentage_discount, event, used)
VALUES ('DISCOUNT20', 0, 20, false, false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO giftcard (code, remaining, percentage_discount, event, used)
VALUES ('SAVE15', 0, 15, false, false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO giftcard (code, remaining, percentage_discount, event, used)
VALUES ('COMBO10', 5.00, 10, false, false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO giftcard (code, remaining, percentage_discount, event, used)
VALUES ('HALFOFF', 0, 50, false, false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO giftcard (code, remaining, percentage_discount, event, used)
VALUES ('EVENT25', 0, 25, true, false)
ON CONFLICT (code) DO NOTHING;

-- Method 2: Update existing gift cards to add percentage discounts
-- Uncomment and modify these to update existing gift cards:

-- UPDATE giftcard SET percentage_discount = 20, remaining = 0 WHERE code = 'YOUR_EXISTING_CODE';
-- UPDATE giftcard SET percentage_discount = 15 WHERE code = 'ANOTHER_CODE';
-- UPDATE giftcard SET percentage_discount = 10 WHERE code = 'THIRD_CODE';

-- Update existing gift cards to add percentage discounts
-- Uncomment and modify as needed:

-- UPDATE giftcard SET percentage_discount = 20 WHERE code = 'EXISTING_CODE';
-- UPDATE giftcard SET percentage_discount = 15, remaining = 0 WHERE code = 'ANOTHER_CODE';

-- View all gift cards with their discount information
-- SELECT code, remaining, percentage_discount, event, used FROM giftcard ORDER BY created_at DESC;
