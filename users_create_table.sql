-- Create users table
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
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    price DECIMAL(10,2),
    metadata JSONB -- For additional item-specific data
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_minecraft_username ON users(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_purchase_date ON user_purchases(purchase_date);

-- Insert some test users (optional, for development)
INSERT INTO users (minecraft_username, skin_url) VALUES
('Notch', 'https://crafatar.com/avatars/069a79f444e94726a5befca90e38aaf5'),
('Steve', 'https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7')
ON CONFLICT (minecraft_username) DO NOTHING;
