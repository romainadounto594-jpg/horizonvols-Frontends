import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { CURRENCIES } from '../../utils/formatters.js';
import { apiService, getApiBaseUrl, setApiBaseUrl } from '../../services/api.js';
import AuthModal from './AuthModal.jsx';
import {
  Plane,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Globe,
  Briefcase,
  Headphones,
  Compass,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { currency, setCurrency } = useBooking();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [apiDropdownOpen, setApiDropdownOpen] = useState(false);

  // Statut Backend Laravel
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());

  const checkBackendStatus = async () => {
    setIsCheckingBackend(true);
    const online = await apiService.checkHealth();
    setIsBackendOnline(online);
    setIsCheckingBackend(false);
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              id="brand-logo-link"
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                  Horizon<span className="text-sky-400">Vols</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium -mt-1 hidden sm:block">
                  Aviation & Voyages
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav" className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                id="nav-link-vols"
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Rechercher
              </Link>
              <Link
                id="nav-link-reservations"
                to="/espace-client"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/espace-client') || isActive('/customer')
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Mes Réservations
              </Link>

              {/* Lien Admin réservé UNIQUEMENT au rôle 'admin' */}
              {currentUser?.role === 'admin' && (
                <Link
                  id="nav-link-admin"
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Administration
                </Link>
              )}
            </nav>

            {/* Actions: API Status, Currency, Auth, User */}
            <div className="hidden md:flex items-center gap-3">
              {/* Statut Backend Laravel */}
              <div className="relative">
                <button
                  id="btn-backend-status-badge"
                  onClick={() => setApiDropdownOpen(!apiDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isBackendOnline
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <Server className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">
                    {isBackendOnline ? 'Laravel 11 Connecté' : 'API Déconnectée'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {apiDropdownOpen && (
                  <div
                    id="api-status-dropdown"
                    className="absolute right-0 mt-2 w-80 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-50 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold flex items-center gap-1.5 text-white">
                        <Server className="w-4 h-4 text-sky-400" />
                        Backend HorizonVols
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBackendOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isBackendOnline ? 'Connecté (Live)' : 'Mode Fallback'}
                      </span>
                    </div>

                    <div className="mt-3 text-slate-300 text-[11px] leading-relaxed">
                      {isBackendOnline ? (
                        <div className="flex items-start gap-2 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                          <span>Connecté à l'API Laravel 11. Les vols, réservations et comptes proviennent directement de votre base MySQL.</span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-amber-300">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <span>L'API locale n'a pas répondu. Le frontend utilise le cache local de démonstration pour que tout reste navigable.</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
                        URL de l'API Laravel
                      </label>
                      <input
                        type="text"
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        placeholder="http://127.0.0.1:8000/api"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setApiBaseUrl(apiUrlInput);
                            checkBackendStatus();
                          }}
                          disabled={isCheckingBackend}
                          className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs"
                        >
                          <RefreshCw className={`w-3 h-3 ${isCheckingBackend ? 'animate-spin' : ''}`} />
                          <span>Tester connexion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  id="btn-currency-selector"
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {currencyDropdownOpen && (
                  <div
                    id="currency-dropdown-menu"
                    className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in"
                  >
                    {Object.entries(CURRENCIES).map(([code, cur]) => (
                      <button
                        key={code}
                        id={`currency-opt-${code}`}
                        onClick={() => {
                          setCurrency(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currency === code ? 'font-bold text-sky-600 bg-sky-50/50' : 'text-slate-600'
                        }`}
                      >
                        <span>{cur.label}</span>
                        <span>{cur.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User / Login */}
              {currentUser ? (
                <div className="relative">
                  <button
                    id="btn-user-profile"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all text-left"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={currentUser.firstName}
                      className="w-7 h-7 rounded-full object-cover border border-sky-400/40"
                    />
                    <div className="hidden lg:block text-xs">
                      <div className="font-semibold text-white truncate max-w-[110px]">
                        {currentUser.firstName}
                      </div>
                      <div className="text-[10px] text-sky-400">
                        {currentUser.membershipTier || (currentUser.role === 'admin' ? 'Administrateur' : 'Voyageur')}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      id="user-dropdown-menu"
                      className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          currentUser.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {currentUser.role === 'admin' ? 'Compte Administrateur' : 'Compte Voyageur'}
                        </span>
                      </div>

                      <Link
                        id="user-menu-client-dashboard"
                        to="/espace-client"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Mon Espace Client
                      </Link>

                      {/* Visible uniquement si ADMIN */}
                      {currentUser.role === 'admin' && (
                        <Link
                          id="user-menu-admin-dashboard"
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-indigo-500" />
                          Administration HorizonVols
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          id="btn-user-logout"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="btn-open-auth-modal"
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="btn-currency-mobile-trigger"
                onClick={() => setCurrency(currency === 'EUR' ? 'XOF' : currency === 'XOF' ? 'USD' : 'EUR')}
                className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-sky-400 border border-slate-700"
              >
                {currency}
              </button>
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4">
            <div className="flex flex-col space-y-1">
              <Link
                id="mobile-nav-link-vols"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                Recherche de vols
              </Link>
              <Link
                id="mobile-nav-link-espace-client"
                to="/espace-client"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Mes Réservations & Billets
              </Link>
              {currentUser?.role === 'admin' && (
                <Link
                  id="mobile-nav-link-admin"
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-indigo-400" />
                  Tableau de bord Administrateur
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{currentUser.firstName}</p>
                      <p className="text-[10px] text-sky-400">{currentUser.role === 'admin' ? 'Administrateur' : 'Voyageur'}</p>
                    </div>
                  </div>
                  <button
                    id="btn-mobile-logout"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <button
                  id="btn-mobile-auth"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-sky-500 text-white rounded-xl text-xs font-bold text-center"
                >
                  Se connecter / S'inscrire
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}