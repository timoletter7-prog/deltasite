-- Create users table (corrected version)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    minecraft_username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_purchases table to track what users have bought
CREATE TABLE IF NOT EXISTS user_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(100) NOT NULL, -- 'shop_item', 'giftcard', etc.
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_minecraft_username ON users(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_created_at ON user_purchases(created_at);

-- Insert some test users (optional, for development)
INSERT INTO users (minecraft_username) VALUES
('Notch'),
('Steve')
ON CONFLICT (minecraft_username) DO NOTHING;
