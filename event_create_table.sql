-- SQL voor event_create tabel
CREATE TABLE event_create (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  informatie TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  time INTEGER DEFAULT 60, -- Duration in minutes
  prize VARCHAR(255),
  max_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  icon VARCHAR(50) DEFAULT 'Trophy',
  image_url TEXT
);

-- Tabel voor event deelnemers
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_id INTEGER REFERENCES event_create(id) ON DELETE CASCADE,
  player_name VARCHAR(255) NOT NULL,
  player_uuid VARCHAR(255),
  UNIQUE(event_id, player_name)
);

-- Voorbeeld data invoegen
INSERT INTO event_create (name, informatie, event_date, time, prize, max_participants, icon) VALUES
('Weekly PvP Tournament', 'Deel mee aan ons wekelijkse PvP toernooi en win geweldige prijzen! Toernooi vindt plaats elke zaterdagavond.', '2024-12-28 20:00:00+00', 120, '-giftcard -prefix [winnaar]👑', 64, 'Trophy'),
('Build Contest', 'Laat je creativiteit zien in onze maandelijkse build contest. Thema wordt elke maand bekend gemaakt.', '2025-01-31 18:00:00+00', 1440, 'VIP Rank (1 maand)', 0, 'Star'),
('Survival Race', 'Race tegen de klok in onze survival race! Verzamel items zo snel mogelijk en word de snelste speler.', '2024-12-29 19:00:00+00', 30, 'Custom Cape', 32, 'Zap'),
('Community Meetup', 'Kom gezellig bij elkaar in onze community meetup. Praat met andere spelers en deel je ervaringen.', '2025-01-05 15:00:00+00', 180, 'Community Badge', 0, 'Users');
