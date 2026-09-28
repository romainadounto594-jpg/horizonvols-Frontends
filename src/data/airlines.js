// Données réalistes des compagnies aériennes partenaires
export const AIRLINES = [
  {
    code: 'AF',
    name: 'Air France',
    alliance: 'SkyTeam',
    country: 'France',
    logoColor: '#002157',
    accentColor: '#ED1C24',
    rating: 4.6,
    baggagePolicy: '1 bagage cabine 12kg + 2x 23kg en soute en standard',
    aircrafts: ['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9']
  },
  {
    code: 'HC',
    name: 'Air Sénégal',
    alliance: 'Indépendant',
    country: 'Sénégal',
    logoColor: '#00853F',
    accentColor: '#FDEF42',
    rating: 4.2,
    baggagePolicy: '1 bagage cabine 10kg + 2x 23kg en soute inclus',
    aircrafts: ['Airbus A330-900neo', 'Airbus A321']
  },
  {
    code: 'SS',
    name: 'Corsair',
    alliance: 'Indépendant',
    country: 'France',
    logoColor: '#0A3B7B',
    accentColor: '#00A3E0',
    rating: 4.3,
    baggagePolicy: '1 bagage cabine 12kg + 2x 23kg en soute',
    aircrafts: ['Airbus A330-900neo']
  },
  {
    code: 'ET',
    name: 'Ethiopian Airlines',
    alliance: 'Star Alliance',
    country: 'Éthiopie',
    logoColor: '#006B3F',
    accentColor: '#D3202A',
    rating: 4.7,
    baggagePolicy: '1 bagage cabine 7kg + 2x 23kg en soute inclus',
    aircrafts: ['Airbus A350-900', 'Boeing 787-8 Dreamliner']
  },
  {
    code: 'AT',
    name: 'Royal Air Maroc',
    alliance: 'Oneworld',
    country: 'Maroc',
    logoColor: '#A30026',
    accentColor: '#C49A45',
    rating: 4.4,
    baggagePolicy: '1 bagage cabine 10kg + 2x 23kg en soute',
    aircrafts: ['Boeing 787-9 Dreamliner', 'Boeing 737 MAX 8']
  },
  {
    code: 'EK',
    name: 'Emirates',
    alliance: 'Indépendant',
    country: 'Émirats Arabes Unis',
    logoColor: '#D71921',
    accentColor: '#D4AF37',
    rating: 4.9,
    baggagePolicy: '1 bagage cabine 7kg + 30kg en soute inclus',
    aircrafts: ['Airbus A380-800', 'Boeing 777-300ER']
  },
  {
    code: 'SN',
    name: 'Brussels Airlines',
    alliance: 'Star Alliance',
    country: 'Belgique',
    logoColor: '#001A9C',
    accentColor: '#E4002B',
    rating: 4.3,
    baggagePolicy: '1 bagage cabine 8kg + 2x 23kg en soute',
    aircrafts: ['Airbus A330-300', 'Airbus A320neo']
  },
  {
    code: 'TK',
    name: 'Turkish Airlines',
    alliance: 'Star Alliance',
    country: 'Turquie',
    logoColor: '#C8102E',
    accentColor: '#232931',
    rating: 4.7,
    baggagePolicy: '1 bagage cabine 8kg + 2x 23kg en soute',
    aircrafts: ['Airbus A350-900', 'Boeing 787-9 Dreamliner']
  }
];

export function getAirlineByCode(code) {
  return AIRLINES.find(a => a.code === code) || {
    code: code || 'HZ',
    name: 'Compagnie Partenaire',
    alliance: 'SkyAlliance',
    logoColor: '#0284c7',
    accentColor: '#0369a1',
    rating: 4.5,
    baggagePolicy: '1 bagage cabine + 1 bagage soute inclus',
    aircrafts: ['Boeing 777', 'Airbus A330']
  };
}
