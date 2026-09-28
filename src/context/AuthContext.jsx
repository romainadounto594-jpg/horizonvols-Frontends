import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';
import { INITIAL_CUSTOMERS } from '../data/customers.js';

const AuthContext = createContext(null);

const normalizeUser = (u) => {
  if (!u) return null;
  const firstName = u.first_name || u.firstName || (u.name ? u.name.split(' ')[0] : 'Voyageur');
  const lastName = u.last_name || u.lastName || (u.name ? u.name.split(' ').slice(1).join(' ') : '');
  const role = u.role || 'client';

  return {
    id: u.id,
    name: u.name || `${firstName} ${lastName}`.trim(),
    firstName: firstName,
    lastName: lastName,
    email: u.email,
    phone: u.phone || '',
    city: u.city || '',
    country: u.country || '',
    membershipTier: u.membership_tier || u.membershipTier || (role === 'admin' ? 'Administrateur' : 'Horizon Silver'),
    miles: u.miles ?? (role === 'admin' ? 125000 : 1000),
    role: role,
    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&background=0284c7&color=fff&bold=true`
  };
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hz_user');
    if (saved) {
      try {
        return normalizeUser(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Synchronisation avec l'API Laravel au démarrage si un token existe
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const token = localStorage.getItem('horizon_auth_token');
      if (token) {
        try {
          const user = await apiService.getMe();
          if (isMounted && user) {
            const normalized = normalizeUser(user);
            setCurrentUser(normalized);
            localStorage.setItem('hz_user', JSON.stringify(normalized));
          }
        } catch {
          // Token expiré ou serveur hors ligne, garder la session locale
        }
      }
      if (isMounted) setIsLoadingAuth(false);
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hz_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hz_user');
    }
  }, [currentUser]);

  /**
   * Connexion utilisateur
   */
  const login = async (email, password = 'password', role = 'client') => {
    // Si appelé avec un objet { email, password }
    if (typeof email === 'object' && email !== null) {
      password = email.password || 'password';
      role = email.role || 'client';
      email = email.email;
    }

    if (!email) {
      return { success: false, error: 'Veuillez saisir votre adresse email' };
    }

    // Appel API Laravel (POST /api/auth/login)
    const result = await apiService.login(email, password);

    if (result.success && result.user) {
      const normalized = normalizeUser(result.user);
      setCurrentUser(normalized);
      return { success: true, user: normalized };
    }

    // Si le serveur Laravel est hors-ligne ou si c'est un compte démo
    if (result.isOffline || email === 'admin@horizonvols.com' || email.includes('diallo')) {
      if (role === 'admin' || email === 'admin@horizonvols.com') {
        const adminUser = normalizeUser({
          id: 1,
          name: 'Directeur Opérations',
          first_name: 'Directeur',
          last_name: 'Opérations',
          email: 'admin@horizonvols.com',
          phone: '+33 1 42 68 00 00',
          city: 'Paris',
          country: 'France',
          role: 'admin',
          membership_tier: 'Administrateur',
          miles: 125000
        });
        setCurrentUser(adminUser);
        return { success: true, user: adminUser, isOfflineFallback: true };
      }

      const clientUser = normalizeUser({
        id: `CUST-${Date.now()}`,
        name: 'Amadou Diallo',
        first_name: 'Amadou',
        last_name: 'Diallo',
        email: email,
        phone: '+221 77 654 32 10',
        city: 'Dakar',
        country: 'Sénégal',
        role: 'client',
        membership_tier: 'Horizon Gold',
        miles: 45000
      });
      setCurrentUser(clientUser);
      return { success: true, user: clientUser, isOfflineFallback: true };
    }

    return {
      success: false,
      error: result.error || 'Identifiants incorrects ou compte inexistant'
    };
  };

  /**
   * Inscription d'un nouveau voyageur (POST /api/auth/register vers Laravel MySQL)
   */
  const register = async (userData) => {
    const firstName = userData.firstName || userData.first_name || (userData.name ? userData.name.trim().split(' ')[0] : 'Voyageur');
    const lastName = userData.lastName || userData.last_name || (userData.name ? userData.name.trim().split(' ').slice(1).join(' ') : 'Horizon');
    const fullName = userData.name || `${firstName} ${lastName}`.trim();

    const payload = {
      name: fullName,
      first_name: firstName,
      last_name: lastName,
      email: userData.email?.trim(),
      password: userData.password,
      password_confirmation: userData.password,
      phone: userData.phone || '',
      city: userData.city || '',
      country: userData.country || ''
    };

    // Appel API Laravel
    const result = await apiService.register(payload);

    if (result.success && result.user) {
      const normalized = normalizeUser(result.user);
      setCurrentUser(normalized);
      return { success: true, user: normalized };
    }

    // Si le serveur Laravel est hors-ligne
    if (result.isOffline) {
      const localUser = normalizeUser({
        id: `CUST-${Date.now()}`,
        name: fullName,
        first_name: firstName,
        last_name: lastName,
        email: payload.email,
        phone: payload.phone,
        city: payload.city,
        country: payload.country,
        role: 'client',
        membership_tier: 'Horizon Silver',
        miles: 1000
      });
      setCurrentUser(localUser);
      return { success: true, user: localUser, isOfflineFallback: true };
    }

    return {
      success: false,
      error: result.error || "Impossible d'enregistrer le compte. Veuillez vérifier vos informations."
    };
  };

  /**
   * Mise à jour du profil utilisateur
   */
  const updateUser = (updated) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      localStorage.setItem('hz_user', JSON.stringify(next));
      return next;
    });
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    await apiService.logout();
    setCurrentUser(null);
    localStorage.removeItem('hz_user');
    localStorage.removeItem('horizon_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoadingAuth,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
