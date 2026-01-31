-- Add shop items that match the event giftcard items
INSERT INTO shop (name, price, category, description, available) VALUES
('Member+', 4.99, 'rank', 'Member+ rank with basic perks and 1 bronze + 1 silver key', true),
('Elite', 9.99, 'rank', 'Elite rank with all Member+ perks plus 1 gold + 1 silver key and firework gadget', true),
('Mythic', 14.99, 'rank', 'Mythic rank with all previous perks plus platinum key and special gadgets', true),
('Extreme', 25.99, 'rank', 'Extreme rank with all perks plus extreme key and 2 extra event lives', true);
