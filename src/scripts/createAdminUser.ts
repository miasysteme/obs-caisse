import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhahwekekuuntqlkvtoc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh3ZWtla3V1bnRxbGt2dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzAzNzI5NCwiZXhwIjoyMDM4NjEzMjk0fQ.pCOBhGJoKJoJhGJoKJoJhGJoKJoJhGJoKJoJhGJoKJo'; // Vous devrez utiliser votre vraie clé de service

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    // ID de l'utilisateur existant dans auth.users
    const userId = '40cf7451-6c66-44e6-af97-437b4f61bbae';
    
    // Créer ou mettre à jour le profil utilisateur
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        role: 'admin_system',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Erreur lors de la création du profil:', error);
    } else {
      console.log('✅ Profil admin créé avec succès:', data);
    }

    // Vérifier que le profil a été créé
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Erreur lors de la vérification:', fetchError);
    } else {
      console.log('📋 Profil utilisateur:', profile);
    }

  } catch (error) {
    console.error('Erreur générale:', error);
  }
}

createAdminUser();
