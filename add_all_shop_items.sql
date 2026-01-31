-- Insert all shop items from shopItems.ts into the shop table
INSERT INTO shop (name, price, category, description, available) VALUES
-- Rank Packages
('Member+', 4.99, 'rank', 'Member+ rank with basic perks and 1 bronze + 1 silver key', true),
('Elite', 9.99, 'rank', 'Elite rank with all Member+ perks plus 1 gold + 1 silver key and firework gadget', true),
('Mythic', 14.99, 'rank', 'Mythic rank with all previous perks plus platinum key and special gadgets', true),
('Extreme', 25.99, 'rank', 'Extreme rank with all perks plus extreme key and 2 extra event lives', true),

-- Particle Trails
('Flame', 3.99, 'trail', 'Flame particle trail', true),
('Totem', 6.99, 'trail', 'Totem particle trail', true),
('Ender', 6.99, 'trail', 'Ender particle trail', true),
('Lightning', 9.99, 'trail', 'Lightning particle trail', true),

-- Gadgets
('Double Jump', 4.99, 'gadget', 'Spring hoger dan normaal mogelijk is', true),
('Grappling Hook', 7.99, 'gadget', 'Swing door de wereld met een grappling hook', true),
('Parkour Gadget', 7.99, 'gadget', 'Verbeterde parkour bewegingen', true),
('Teleport Gadget', 12.99, 'gadget', 'Teleporteer korte afstanden', true),

-- Trails
('Void Trail', 6.99, 'trail', 'Void particle trail', true),
('Ice Trail', 5.99, 'trail', 'Water, ice particle trail', true),
('Nature Trail', 3.99, 'trail', 'Leaf particle trail', true),
('Cloud Trail', 2.99, 'trail', 'Cloud particle trail', true),
('Enchant Trail', 7.99, 'trail', 'Enchantment table particle trail', true),
('Heart Trail', 4.99, 'trail', 'Heart particle trail', true),
('Event Winner Trail', 0, 'trail', 'Villager happy particle trail (Event Winner Only)', false),
('Fire Trail', 0, 'trail', 'Particle spawner or angry villager trail (Rank Item)', false),
('Totem Trail', 0, 'trail', 'Totem of Undying particle trail (Rank Item)', false),

-- Nametag Gadgets
('Confetti Cannon', 2.99, 'nametag_gadget', 'Shoot confetti in the air (cooldown)', true),
('Firework Gun', 2.99, 'nametag_gadget', 'Right click → firework (cooldown)', true),
('Knockback Rod', 6.99, 'nametag_gadget', 'Push players/mobs away (cooldown)', true),
('Slime Ride', 4.99, 'nametag_gadget', 'Spawn and ride a slime!', true),
('Lightning Staff', 7.99, 'nametag_gadget', 'Lightning without damage (cooldown)', true),
('Grappling Hook Nametag', 5.99, 'nametag_gadget', 'Swing through the world (cooldown)', true),
('Elytra Launcher', 0, 'nametag_gadget', 'Fly for a few seconds in the air (Rank Item)', false),
('Jump Shoes', 0, 'nametag_gadget', 'Jump higher than normal (Rank Item, cooldown)', false),

-- Nametag Prefixes
('Master Prefix', 4.99, 'prefix', '[Master] prefix', true),
('Pro Prefix', 2.99, 'prefix', '[Pro] prefix', true),
('VIP Prefix', 8.99, 'prefix', '[VIP] prefix', true),
('Killer Prefix', 2.99, 'prefix', '[Killer] prefix', true),
('Noob Prefix', 0.99, 'prefix', '[Noob] prefix', true),
('SUS Prefix', 0.99, 'prefix', '[SUS] prefix', true),
('Dragon Prefix', 3.99, 'prefix', '[DRAGON] prefix', true),
('Immortal Prefix', 6.99, 'prefix', '[IMMORTAL] prefix', true),

-- Lobby Keys
('Bronze Key', 1.99, 'key', 'Toegang tot Bronze Crate', true),
('Silver Key', 2.99, 'key', 'Toegang tot Silver Crate', true),
('Gold Key', 4.99, 'key', 'Toegang tot Gold Crate', true),
('Platinum Key', 8.99, 'key', 'Toegang tot Platinum Crate', true),
('Diamond Key', 11.99, 'key', 'Toegang tot Diamond Crate', true),
('Extreme Key', 15.99, 'key', 'Toegang tot Extreme Crate (BESTE CRATE!)', true),

-- Skyblock Keys
('Basic Key', 1.99, 'skyblock_key', 'Basic crate', true),
('Common Key', 2.99, 'skyblock_key', 'Starter crate', true),
('Rare Key', 4.99, 'skyblock_key', 'Middenklasse', true),
('Epic Key', 7.99, 'skyblock_key', 'High value crate', true),
('Legendary Key', 11.99, 'skyblock_key', 'Top crate', true),
('Mythic Key', 15.99, 'skyblock_key', 'Premium / store exclusive', true);
