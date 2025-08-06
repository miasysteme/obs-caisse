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
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          boutique:boutiques(name, commercial_name)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error

      setUser({
        id: userId,
        email: data.email,
        role: data.role,
        boutique_id: data.boutique_id,
        company_id: data.company_id,
        boutique_name: data.boutique?.commercial_name || data.boutique?.name || null,
        first_name: data.first_name,
        last_name: data.last_name,
        // Autres propriétés User de Supabase
        aud: '',
        created_at: data.created_at,
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
    isAdmin: user?.role === 'admin_master',
    isCentral: user?.role === 'admin_central',
    isManager: user?.role === 'manager',
    isCashier: user?.role === 'cashier'
  }
}
