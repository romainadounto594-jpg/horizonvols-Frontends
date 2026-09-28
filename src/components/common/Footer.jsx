import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, CreditCard, Headphones, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20 no-print">
      {/* Reassurance Bar */}
      <div className="border-b border-slate-900 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Sécurité Maximale</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Données chiffrées SSL 256 bits et conformité aux standards IATA.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Paiement Multi-Moyens</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Cartes Bancaires, Wave, Orange Money, MTN et virements sécurisés.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Support Dédié 24h/7j</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Une équipe d'agents experts à votre écoute avant, pendant et après votre vol.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Tarifs Garantis & Clairs</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Zéro frais cachés lors de la validation. Transparence totale des taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Horizon<span className="text-sky-400">Vols</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              La plateforme de référence pour réserver des billets d'avion vers l'Afrique et les métropoles internationales. Comparez les meilleures compagnies et voyagez l'esprit tranquille.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>+33 1 89 20 40 50 / +221 33 800 12 34</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>contact@horizonvols.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Aérogare CDG & Hub Blaise Diagne</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Réservations
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Rechercher un vol</Link></li>
              <li><Link to="/espace-client" className="hover:text-white transition-colors">Mes réservations</Link></li>
              <li><Link to="/espace-client" className="hover:text-white transition-colors">Enregistrement en ligne</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Guide des bagages</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Plan de cabine</span></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Destinations Clés
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Paris - Dakar</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Paris - Abidjan</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Bruxelles - Cotonou</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Paris - Casablanca</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Paris - New York</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vols Paris - Dubaï</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Espace Professionnel
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-medium">Tableau de bord Admin</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Compagnies partenaires</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Conditions générales</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Politique de confidentialité</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Gestion des cookies</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HorizonVols Inc. Tous droits réservés. Plateforme officielle de réservation.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Wave</span>
            <span>Orange Money</span>
            <span>MTN</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
