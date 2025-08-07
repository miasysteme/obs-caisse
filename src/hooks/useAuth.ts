import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthUser extends User {
  role: string
  boutique_id: string | null
  company_id: string | null
  boutique_name: string | null
  first_name: string | null
  last_name: string | null
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string, email?: string) => {
    try {
      // Récupérer le profil utilisateur depuis user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.error('Erreur lors de la récupération du profil:', profileError)
        // Si pas de profil, créer un utilisateur basique
        setUser({
          id: userId,
          email: email || '',
          role: 'vendeur',
          boutique_id: null,
          company_id: null,
          boutique_name: null,
          first_name: null,
          last_name: null,
          aud: '',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {}
        } as AuthUser)
        setLoading(false)
        return
      }

      // Récupérer les informations de l'employé si disponible
      let employeeData = null
      if (profile.employe_id) {
        const { data: employee } = await supabase
          .from('employes')
          .select(`
            *,
            boutique:boutiques(nom)
          `)
          .eq('id', profile.employe_id)
          .single()
        
        employeeData = employee
      }

      setUser({
        id: userId,
        email: email || '',
        role: profile.role,
        boutique_id: employeeData?.boutique_id || null,
        company_id: null,
        boutique_name: employeeData?.boutique?.nom || null,
        first_name: employeeData?.prenom || null,
        last_name: employeeData?.nom || null,
        aud: '',
        created_at: profile.created_at,
        app_metadata: {},
        user_metadata: {}
      } as AuthUser)
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
    }
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin_system',
    isCentral: user?.role === 'proprietaire',
    isManager: user?.role === 'manager',
    isCashier: user?.role === 'caissier'
  }
}
