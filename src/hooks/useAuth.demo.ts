import { useState, useEffect } from 'react'

interface AuthUser {
  id: string
  email: string
  role: string
  boutique_id: string | null
  company_id: string | null
  boutique_name: string | null
  first_name: string | null
  last_name: string | null
}

// Utilisateurs de démonstration
const demoUsers: { [key: string]: AuthUser } = {
  'admin@sonutec.com': {
    id: '1',
    email: 'admin@sonutec.com',
    role: 'admin_master',
    boutique_id: null,
    company_id: null,
    boutique_name: null,
    first_name: 'Admin',
    last_name: 'SONUTEC'
  },
  'manager@restaurant.com': {
    id: '2',
    email: 'manager@restaurant.com',
    role: 'manager',
    boutique_id: 'rest-001',
    company_id: 'comp-001',
    boutique_name: 'Restaurant Le Palmier',
    first_name: 'Jean',
    last_name: 'KOUASSI'
  },
  'caissier@hotel.com': {
    id: '3',
    email: 'caissier@hotel.com',
    role: 'cashier',
    boutique_id: 'hotel-001',
    company_id: 'comp-002',
    boutique_name: 'Hôtel Ivoire Palace',
    first_name: 'Marie',
    last_name: 'AYA'
  }
}

// Mots de passe de démonstration
const demoPasswords: { [key: string]: string } = {
  'admin@sonutec.com': 'admin123',
  'manager@restaurant.com': 'manager123',
  'caissier@hotel.com': 'caissier123'
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier s'il y a un utilisateur connecté dans le localStorage
    const savedUser = localStorage.getItem('demo_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        localStorage.removeItem('demo_user')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Vérifier les identifiants
      if (demoUsers[email] && demoPasswords[email] === password) {
        const user = demoUsers[email]
        setUser(user)
        localStorage.setItem('demo_user', JSON.stringify(user))
        setLoading(false)
        return { data: { user }, error: null }
      } else {
        setLoading(false)
        return { 
          data: null, 
          error: { message: 'Email ou mot de passe incorrect' } 
        }
      }
    } catch (error) {
      setLoading(false)
      return { 
        data: null, 
        error: { message: 'Erreur lors de la connexion' } 
      }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('demo_user')
    return { error: null }
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
