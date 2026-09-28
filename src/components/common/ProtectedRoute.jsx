import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldAlert, LogIn, ArrowLeft, Loader2 } from 'lucide-react';

/**
 * Garde de sécurité pour les routes privées (Espace Client ou Admin)
 * @param {Array} allowedRoles - Ex: ['client'] ou ['admin'] ou ['client', 'admin']
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, isLoadingAuth } = useAuth();

  // 1. En cours de vérification de session
  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Vérification des autorisations...</p>
      </div>
    );
  }

  // 2. Non connecté
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center">
        <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Connexion requise</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
          Vous devez être connecté pour accéder à cet espace.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>
    );
  }

 // 3. Connecté mais vérification du rôle (accepte 'client', 'customer', 'voyageur')
  const userRole = (currentUser.role || 'customer').toLowerCase();
  const isCustomer = ['client', 'customer', 'user', 'voyageur'].includes(userRole);
  const isAdmin = userRole === 'admin' || userRole === 'administrator';

  const isAllowed =
    allowedRoles.length === 0 ||
    allowedRoles.includes(userRole) ||
    (isAdmin && (allowedRoles.includes('admin') || allowedRoles.includes('administrator'))) ||
    (isCustomer && (allowedRoles.includes('client') || allowedRoles.includes('customer') || allowedRoles.includes('user')));

  if (!isAllowed) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
          Erreur 403 : Accès Interdit
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-3">Espace Administrateur Réservé</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          Votre compte est configuré avec le profil <strong>Voyageur ({currentUser.role})</strong>. Seul le personnel autorisé peut accéder au tableau de bord d'administration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/customer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Aller à mon Espace Client
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            Accueil
          </Link>
        </div>
      </div>
    );
  }

  // 4. Autorisé
  return children;
}