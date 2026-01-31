-- Test SQL om een event giftcard aan te maken met de juiste array format
-- Voer deze uit in Supabase SQL Editor

-- Maak een test event giftcard aan
INSERT INTO giftcard (code, remaining, event, items, used, created_at)
VALUES (
  'EVENTTEST123',
  1,
  true,
  ARRAY['Member+', 'Elite', 'Mythic', 'Extreme'],
  false,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  remaining = 1,
  event = true,
  items = ARRAY['Member+', 'Elite', 'Mythic', 'Extreme'],
  used = false,
  used_at = null;

-- Of update een bestaande giftcard
-- UPDATE giftcard
-- SET event = true,
--     items = ARRAY['Member+', 'Elite', 'Mythic', 'Extreme'],
--     used = false,
--     used_at = null
-- WHERE code = 'JE_CODE_HIER';

-- Check of het werkt
SELECT code, event, items, used FROM giftcard WHERE code = 'EVENTTEST123';
