-- Migration to create a function for verifying the current user password before allowing changes
-- This addresses the security issue where any password could be used to update the user's password

-- Create the function to verify user password
-- This function will return true if the password matches, false otherwise
CREATE OR REPLACE FUNCTION public.verify_user_password(password text)
RETURNS BOOLEAN
SECURITY DEFINER 
SET search_path = extensions, public, auth
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- Return whether the password matches
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id 
    AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to change the user password securely
-- This function checks the current password before allowing an update
CREATE OR REPLACE FUNCTION public.change_user_password(current_plain_password text, new_plain_password text)
RETURNS JSONB
SECURITY DEFINER 
SET search_path = extensions, public, auth
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- Check if user is logged in
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Validate new password
  IF length(new_plain_password) < 8 THEN
    RAISE EXCEPTION 'New password must be at least 8 characters long';
  END IF;

  -- Verify the current password
  IF NOT public.verify_user_password(current_plain_password) THEN
    RAISE EXCEPTION 'Current password is incorrect';
  END IF;
  
  -- Update the password
  UPDATE auth.users 
  SET encrypted_password = crypt(new_plain_password, gen_salt('bf'))
  WHERE id = user_id;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql; 