-- ALTER TABLE statements to fix the users and user_purchases tables

-- Add created_at column to user_purchases if it doesn't exist
-- (or rename purchase_date to created_at if it exists)
DO $$
BEGIN
    -- Check if purchase_date column exists and created_at doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_purchases'
        AND column_name = 'purchase_date'
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_purchases'
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        -- Rename purchase_date to created_at
        ALTER TABLE user_purchases RENAME COLUMN purchase_date TO created_at;
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_purchases'
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        -- Add created_at column
        ALTER TABLE user_purchases ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add price column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_purchases'
        AND column_name = 'price'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_purchases ADD COLUMN price DECIMAL(10,2);
    END IF;

    -- Add item_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_purchases'
        AND column_name = 'item_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_purchases ADD COLUMN item_type VARCHAR(100) NOT NULL DEFAULT 'shop_item';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_minecraft_username ON users(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_created_at ON user_purchases(created_at);
