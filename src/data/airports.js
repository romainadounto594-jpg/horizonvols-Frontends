// Base de données réaliste d'aéroports internationaux et africains
export const AIRPORTS = [
  // Afrique de l'Ouest & Centrale
  {
    code: 'DSS',
    name: 'Aéroport International Blaise Diagne',
    city: 'Dakar',
    country: 'Sénégal',
    region: 'Afrique',
    timezone: 'UTC+0',
    popular: true,
    flag: '🇸🇳'
  },
  {
    code: 'ABJ',
    name: 'Aéroport International Félix-Houphouët-Boigny',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    region: 'Afrique',
    timezone: 'UTC+0',
    popular: true,
    flag: '🇨🇮'
  },
  {
    code: 'COO',
    name: 'Aéroport International Cardinal Bernardin Gantin',
    city: 'Cotonou',
    country: 'Bénin',
    region: 'Afrique',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇧🇯'
  },
  {
    code: 'DLA',
    name: 'Aéroport International de Douala',
    city: 'Douala',
    country: 'Cameroun',
    region: 'Afrique',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇨🇲'
  },
  {
    code: 'LFW',
    name: 'Aéroport International Gnassingbé Eyadéma',
    city: 'Lomé',
    country: 'Togo',
    region: 'Afrique',
    timezone: 'UTC+0',
    popular: true,
    flag: '🇹🇬'
  },
  {
    code: 'BKO',
    name: 'Aéroport International Modibo Keïta',
    city: 'Bamako',
    country: 'Mali',
    region: 'Afrique',
    timezone: 'UTC+0',
    popular: false,
    flag: '🇲🇱'
  },
  {
    code: 'OUA',
    name: 'Aéroport International de Ouagadougou',
    city: 'Ouagadougou',
    country: 'Burkina Faso',
    region: 'Afrique',
    timezone: 'UTC+0',
    popular: false,
    flag: '🇧🇫'
  },
  {
    code: 'LBV',
    name: 'Aéroport International Léon-Mba',
    city: 'Libreville',
    country: 'Gabon',
    region: 'Afrique',
    timezone: 'UTC+1',
    popular: false,
    flag: '🇬🇦'
  },

  // Afrique du Nord & Est / Australe
  {
    code: 'CMN',
    name: 'Aéroport Mohammed V',
    city: 'Casablanca',
    country: 'Maroc',
    region: 'Afrique',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇲🇦'
  },
  {
    code: 'TUN',
    name: 'Aéroport International de Tunis-Carthage',
    city: 'Tunis',
    country: 'Tunisie',
    region: 'Afrique',
    timezone: 'UTC+1',
    popular: false,
    flag: '🇹🇳'
  },
  {
    code: 'ADD',
    name: 'Aéroport International de Bole',
    city: 'Addis-Abeba',
    country: 'Éthiopie',
    region: 'Afrique',
    timezone: 'UTC+3',
    popular: true,
    flag: '🇪🇹'
  },
  {
    code: 'NBO',
    name: 'Aéroport International Jomo Kenyatta',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'Afrique',
    timezone: 'UTC+3',
    popular: false,
    flag: '🇰🇪'
  },
  {
    code: 'JNB',
    name: 'Aéroport O.R. Tambo',
    city: 'Johannesbourg',
    country: 'Afrique du Sud',
    region: 'Afrique',
    timezone: 'UTC+2',
    popular: true,
    flag: '🇿🇦'
  },

  // Europe
  {
    code: 'CDG',
    name: 'Aéroport Charles de Gaulle',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇫🇷'
  },
  {
    code: 'ORY',
    name: 'Aéroport de Paris-Orly',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇫🇷'
  },
  {
    code: 'BRU',
    name: 'Aéroport de Bruxelles-National',
    city: 'Bruxelles',
    country: 'Belgique',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: true,
    flag: '🇧🇪'
  },
  {
    code: 'LHR',
    name: 'Aéroport de Londres Heathrow',
    city: 'Londres',
    country: 'Royaume-Uni',
    region: 'Europe',
    timezone: 'UTC+0',
    popular: true,
    flag: '🇬🇧'
  },
  {
    code: 'GVA',
    name: 'Aéroport International de Genève',
    city: 'Genève',
    country: 'Suisse',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: false,
    flag: '🇨🇭'
  },
  {
    code: 'FRA',
    name: 'Aéroport de Francfort-sur-le-Main',
    city: 'Francfort',
    country: 'Allemagne',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: false,
    flag: '🇩🇪'
  },
  {
    code: 'MAD',
    name: 'Aéroport Adolfo Suárez Madrid-Barajas',
    city: 'Madrid',
    country: 'Espagne',
    region: 'Europe',
    timezone: 'UTC+1',
    popular: false,
    flag: '🇪🇸'
  },
  {
    code: 'LIS',
    name: 'Aéroport Humberto Delgado de Lisbonne',
    city: 'Lisbonne',
    country: 'Portugal',
    region: 'Europe',
    timezone: 'UTC+0',
    popular: false,
    flag: '🇵🇹'
  },

  // Moyen-Orient & Amériques
  {
    code: 'DXB',
    name: 'Aéroport International de Dubaï',
    city: 'Dubaï',
    country: 'Émirats Arabes Unis',
    region: 'Moyen-Orient',
    timezone: 'UTC+4',
    popular: true,
    flag: '🇦🇪'
  },
  {
    code: 'IST',
    name: 'Aéroport International d’Istanbul',
    city: 'Istanbul',
    country: 'Turquie',
    region: 'Europe / Asie',
    timezone: 'UTC+3',
    popular: true,
    flag: '🇹🇷'
  },
  {
    code: 'JFK',
    name: 'Aéroport John F. Kennedy',
    city: 'New York',
    country: 'États-Unis',
    region: 'Amérique',
    timezone: 'UTC-5',
    popular: true,
    flag: '🇺🇸'
  },
  {
    code: 'YUL',
    name: 'Aéroport Pierre-Elliott-Trudeau',
    city: 'Montréal',
    country: 'Canada',
    region: 'Amérique',
    timezone: 'UTC-5',
    popular: true,
    flag: '🇨🇦'
  }
];

export const POPULAR_ROUTES = [
  { from: 'CDG', to: 'DSS', label: 'Paris ➔ Dakar', fromCity: 'Paris', toCity: 'Dakar', price: 449, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=80', tag: 'Populaire' },
  { from: 'CDG', to: 'ABJ', label: 'Paris ➔ Abidjan', fromCity: 'Paris', toCity: 'Abidjan', price: 489, image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80', tag: 'Promo Été' },
  { from: 'BRU', to: 'COO', label: 'Bruxelles ➔ Cotonou', fromCity: 'Bruxelles', toCity: 'Cotonou', price: 520, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80', tag: 'Top Vente' },
  { from: 'ORY', to: 'CMN', label: 'Paris ➔ Casablanca', fromCity: 'Paris', toCity: 'Casablanca', price: 189, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&auto=format&fit=crop&q=80', tag: 'Flash -25%' },
  { from: 'CDG', to: 'YUL', label: 'Paris ➔ Montréal', fromCity: 'Paris', toCity: 'Montréal', price: 395, image: 'https://images.unsplash.com/photo-1519178173456-42fcfb839ec9?w=800&auto=format&fit=crop&q=80', tag: 'Meilleur Tarif' },
  { from: 'CDG', to: 'DXB', label: 'Paris ➔ Dubaï', fromCity: 'Paris', toCity: 'Dubaï', price: 460, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80', tag: 'Luxe & Soleil' }
];

export function getAirportByCode(code) {
  return AIRPORTS.find(a => a.code === code) || {
    code: code || 'XXX',
    name: 'Aéroport ' + (code || ''),
    city: code || 'Ville inconnue',
    country: 'International',
    region: 'Monde',
    flag: '✈️'
  };
}
