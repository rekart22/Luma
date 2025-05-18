-- Add has_password_setup column to user_profiles table
-- This column tracks whether the user has set up a password
-- Used to redirect users through the password setup flow after magic link authentication

-- First, check if the user_profiles table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'user_profiles'
    ) THEN
        -- Check if the column already exists to avoid errors
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name = 'user_profiles'
            AND column_name = 'has_password_setup'
        ) THEN
            -- Add the column
            ALTER TABLE public.user_profiles ADD COLUMN has_password_setup BOOLEAN DEFAULT FALSE;
            
            -- Add a comment to describe the column
            COMMENT ON COLUMN public.user_profiles.has_password_setup IS 'Flag indicating whether the user has completed password setup';
        END IF;
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            has_password_setup BOOLEAN DEFAULT FALSE
        );
        
        -- Add comment for the table
        COMMENT ON TABLE public.user_profiles IS 'Profile information for users';
        
        -- Add a comment to describe the column
        COMMENT ON COLUMN public.user_profiles.has_password_setup IS 'Flag indicating whether the user has completed password setup';
        
        -- Set up RLS policies
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to view and update their own profile
        CREATE POLICY "Users can view their own profile" 
            ON public.user_profiles FOR SELECT 
            USING (auth.uid() = id);
            
        CREATE POLICY "Users can update their own profile" 
            ON public.user_profiles FOR UPDATE 
            USING (auth.uid() = id);
    END IF;
END
$$;

-- Create update function to set password flag when user updates their password
CREATE OR REPLACE FUNCTION public.handle_password_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the user_profiles record
    INSERT INTO public.user_profiles (id, has_password_setup)
    VALUES (NEW.id, TRUE)
    ON CONFLICT (id) 
    DO UPDATE SET has_password_setup = TRUE, updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger for password changes
DROP TRIGGER IF EXISTS on_password_update ON auth.users;
CREATE TRIGGER on_password_update
AFTER UPDATE OF encrypted_password ON auth.users
FOR EACH ROW
WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password AND NEW.encrypted_password IS NOT NULL)
EXECUTE FUNCTION public.handle_password_update(); 