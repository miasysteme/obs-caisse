-- Script pour créer le profil admin pour sonutecsarl@gmail.com
-- À exécuter dans l'éditeur SQL de Supabase

INSERT INTO user_profiles (
  id,
  user_id,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '40cf7451-6c66-44e6-af97-437b4f61bbae',
  'admin_system',
  true,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET 
  role = 'admin_system',
  is_active = true,
  updated_at = NOW();
