import { getAirportByCode } from './airports.js';
import { getAirlineByCode, AIRLINES } from './airlines.js';

// Base fixe de vols pré-configurés réalistes
export const BASE_FLIGHTS = [
  // Paris CDG -> Dakar DSS
  {
    id: 'FL-001',
    flightNumber: 'AF 718',
    airlineCode: 'AF',
    airlineName: 'Air France',
    from: 'CDG',
    to: 'DSS',
    departureTime: '15:40',
    arrivalTime: '19:35',
    duration: '5h 55m',
    durationMinutes: 355,
    stops: 0,
    stopDetails: [],
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'economy',
    price: 489,
    taxes: 78,
    baggage: { cabin: '1x 12kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Modifiable avec frais de 80€',
    refundable: false,
    services: ['Wi-Fi à bord', 'Repas chaud & Boissons', 'Prise USB/AC', 'Écran individuel HD'],
    seatsAvailable: 14,
    recommended: true
  },
  {
    id: 'FL-002',
    flightNumber: 'HC 404',
    airlineCode: 'HC',
    airlineName: 'Air Sénégal',
    from: 'CDG',
    to: 'DSS',
    departureTime: '10:15',
    arrivalTime: '14:20',
    duration: '6h 05m',
    durationMinutes: 365,
    stops: 0,
    stopDetails: [],
    aircraft: 'Airbus A330-900neo',
    cabinClass: 'economy',
    price: 429,
    taxes: 72,
    baggage: { cabin: '1x 10kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Billet échangeable sous conditions',
    refundable: true,
    services: ['Repas traditionnel sénégalais', 'Écran tactile', 'Bagages généreux'],
    seatsAvailable: 22,
    recommended: false
  },
  {
    id: 'FL-003',
    flightNumber: 'SS 982',
    airlineCode: 'SS',
    airlineName: 'Corsair',
    from: 'ORY',
    to: 'DSS',
    departureTime: '13:00',
    arrivalTime: '17:15',
    duration: '6h 15m',
    durationMinutes: 375,
    stops: 0,
    stopDetails: [],
    aircraft: 'Airbus A330neo',
    cabinClass: 'economy',
    price: 445,
    taxes: 70,
    baggage: { cabin: '1x 12kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Flexibilité Horizon',
    refundable: false,
    services: ['Wi-Fi haut débit', 'Repas inclus', 'Prise USB'],
    seatsAvailable: 8,
    recommended: false
  },
  {
    id: 'FL-004',
    flightNumber: 'AT 791 / AT 501',
    airlineCode: 'AT',
    airlineName: 'Royal Air Maroc',
    from: 'CDG',
    to: 'DSS',
    departureTime: '11:20',
    arrivalTime: '19:50',
    duration: '9h 30m',
    durationMinutes: 570,
    stops: 1,
    stopDetails: [{ airport: 'CMN', city: 'Casablanca', duration: '2h 10m' }],
    aircraft: 'Boeing 787-9 Dreamliner',
    cabinClass: 'economy',
    price: 368,
    taxes: 65,
    baggage: { cabin: '1x 10kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Tarif Éco Promo - Non remboursable',
    refundable: false,
    services: ['2 Repas inclus', 'Divertissement à bord', 'Transit assistance'],
    seatsAvailable: 19,
    recommended: false
  },

  // Paris CDG -> Abidjan ABJ
  {
    id: 'FL-005',
    flightNumber: 'AF 702',
    airlineCode: 'AF',
    airlineName: 'Air France',
    from: 'CDG',
    to: 'ABJ',
    departureTime: '13:45',
    arrivalTime: '18:15',
    duration: '6h 30m',
    durationMinutes: 390,
    stops: 0,
    stopDetails: [],
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'economy',
    price: 520,
    taxes: 84,
    baggage: { cabin: '1x 12kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Modifiable sans frais (ajustement tarifaire)',
    refundable: true,
    services: ['Wi-Fi à bord', 'Menu Chef', 'Écrans HD 4K', 'Prises 220V'],
    seatsAvailable: 11,
    recommended: true
  },
  {
    id: 'FL-006',
    flightNumber: 'SS 988',
    airlineCode: 'SS',
    airlineName: 'Corsair',
    from: 'ORY',
    to: 'ABJ',
    departureTime: '14:20',
    arrivalTime: '19:10',
    duration: '6h 50m',
    durationMinutes: 410,
    stops: 0,
    stopDetails: [],
    aircraft: 'Airbus A330-900neo',
    cabinClass: 'economy',
    price: 479,
    taxes: 75,
    baggage: { cabin: '1x 12kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Modifiable avec frais',
    refundable: false,
    services: ['Repas complet inclus', 'Wi-Fi disponible', 'Divertissement'],
    seatsAvailable: 18,
    recommended: false
  },
  {
    id: 'FL-007',
    flightNumber: 'SN 251',
    airlineCode: 'SN',
    airlineName: 'Brussels Airlines',
    from: 'BRU',
    to: 'COO',
    departureTime: '10:50',
    arrivalTime: '17:35',
    duration: '6h 45m',
    durationMinutes: 405,
    stops: 0,
    stopDetails: [],
    aircraft: 'Airbus A330-300',
    cabinClass: 'economy',
    price: 560,
    taxes: 88,
    baggage: { cabin: '1x 8kg', hold: '2x 23kg inclus' },
    ticketPolicy: 'Billet Standard - Modifiable',
    refundable: false,
    services: ['Chocolat belge offert', 'Repas chaud', 'Prises USB'],
    seatsAvailable: 9,
    recommended: true
  },

  // Paris CDG -> New York JFK
  {
    id: 'FL-008',
    flightNumber: 'AF 006',
    airlineCode: 'AF',
    airlineName: 'Air France',
    from: 'CDG',
    to: 'JFK',
    departureTime: '14:00',
    arrivalTime: '16:25',
    duration: '8h 25m',
    durationMinutes: 505,
    stops: 0,
    stopDetails: [],
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'economy',
    price: 410,
    taxes: 95,
    baggage: { cabin: '1x 12kg', hold: '1x 23kg inclus' },
    ticketPolicy: 'Modifiable',
    refundable: true,
    services: ['Wi-Fi connecté', 'Champagne offert', 'Écran 13 pouces'],
    seatsAvailable: 31,
    recommended: true
  },

  // Paris CDG -> Dubaï DXB
  {
    id: 'FL-009',
    flightNumber: 'EK 074',
    airlineCode: 'EK',
    airlineName: 'Emirates',
    from: 'CDG',
    to: 'DXB',
    departureTime: '15:35',
    arrivalTime: '00:20',
    duration: '6h 45m',
    durationMinutes: 405,
    stops: 0,
    stopDetails: [],
    aircraft: 'Airbus A380-800',
    cabinClass: 'economy',
    price: 580,
    taxes: 110,
    baggage: { cabin: '1x 7kg', hold: '30kg soute inclus' },
    ticketPolicy: 'Flex Plus Emirates',
    refundable: true,
    services: ['ICE 5000 chaînes', 'Wi-Fi ultra rapide', 'Repas gastronomique', 'Sièges spacieux'],
    seatsAvailable: 40,
    recommended: true
  }
];

// Helper qui génère des vols dynamiques et réalistes selon la recherche de l'utilisateur
export function searchFlights({
  from = 'CDG',
  to = 'DSS',
  departureDate = '',
  returnDate = '',
  cabinClass = 'economy',
  passengers = { adults: 1, children: 0, infants: 0 }
}) {
  const fromAirport = getAirportByCode(from);
  const toAirport = getAirportByCode(to);

  // Multiplicateurs de classe
  const classMultipliers = {
    economy: 1,
    premium: 1.65,
    business: 2.8,
    first: 4.5
  };

  const multiplier = classMultipliers[cabinClass] || 1;

  // Filtrer les vols pré-enregistrés qui matchent
  const exactMatches = BASE_FLIGHTS.filter(
    f => f.from === from && f.to === to
  );

  if (exactMatches.length >= 3) {
    return exactMatches.map(flight => ({
      ...flight,
      cabinClass,
      price: Math.round(flight.price * multiplier),
      taxes: Math.round(flight.taxes * (cabinClass === 'business' || cabinClass === 'first' ? 1.5 : 1))
    }));
  }

  // Si peu ou pas de matches directs pré-enregistrés, générer 5-8 options réalistes
  const availableAirlines = [
    AIRLINES[0], // Air France
    AIRLINES[1], // Air Sénégal
    AIRLINES[3], // Ethiopian Airlines
    AIRLINES[4], // Royal Air Maroc
    AIRLINES[5], // Emirates
    AIRLINES[6], // Brussels Airlines
    AIRLINES[7]  // Turkish Airlines
  ];

  const generated = [];

  // Durée estimée selon les villes (entre 4h et 11h)
  const isIntercontinental = fromAirport.country !== toAirport.country;
  const baseDurationMins = isIntercontinental ? 380 : 180;

  const schedules = [
    { dep: '07:30', stops: 0, stopAirport: null, extraPrice: 30 },
    { dep: '10:15', stops: 0, stopAirport: null, extraPrice: 0 },
    { dep: '13:40', stops: 1, stopAirport: 'CMN', extraPrice: -70 },
    { dep: '16:20', stops: 0, stopAirport: null, extraPrice: 45 },
    { dep: '19:45', stops: 1, stopAirport: 'ADD', extraPrice: -90 },
    { dep: '21:30', stops: 0, stopAirport: null, extraPrice: 15 }
  ];

  schedules.forEach((sch, index) => {
    const airline = availableAirlines[index % availableAirlines.length];
    const durationMinutes = sch.stops === 0 ? baseDurationMins + (index * 15) : baseDurationMins + 150 + (index * 20);
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationStr = `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;

    // Calcul heure d'arrivée
    const [depH, depM] = sch.dep.split(':').map(Number);
    const totalDepM = depH * 60 + depM + durationMinutes;
    const arrH = Math.floor((totalDepM / 60) % 24);
    const arrM = totalDepM % 60;
    const arrStr = `${arrH < 10 ? '0' : ''}${arrH}:${arrM < 10 ? '0' : ''}${arrM}`;

    // Prix réaliste de base
    let basePrice = 390 + (index * 35) + sch.extraPrice;
    if (basePrice < 280) basePrice = 295;

    const flightNumber = `${airline.code} ${200 + index * 37}`;
    const aircraft = airline.aircrafts[index % airline.aircrafts.length];

    const stopDetails = sch.stops > 0 ? [
      {
        airport: sch.stopAirport || 'CMN',
        city: sch.stopAirport === 'ADD' ? 'Addis-Abeba' : 'Casablanca',
        duration: '1h 55m'
      }
    ] : [];

    generated.push({
      id: `DYN-${from}-${to}-${index + 1}`,
      flightNumber,
      airlineCode: airline.code,
      airlineName: airline.name,
      from,
      to,
      departureTime: sch.dep,
      arrivalTime: arrStr,
      duration: durationStr,
      durationMinutes,
      stops: sch.stops,
      stopDetails,
      aircraft,
      cabinClass,
      price: Math.round(basePrice * multiplier),
      taxes: Math.round(75 * (cabinClass === 'business' || cabinClass === 'first' ? 1.4 : 1)),
      baggage: {
        cabin: cabinClass === 'first' || cabinClass === 'business' ? '2x 14kg' : '1x 12kg',
        hold: cabinClass === 'first' ? '3x 32kg inclus' : cabinClass === 'business' ? '2x 32kg inclus' : '2x 23kg inclus'
      },
      ticketPolicy: cabinClass === 'business' || cabinClass === 'first' ? 'Modifiable & Remboursable sans frais' : 'Modifiable avec conditions',
      refundable: cabinClass === 'business' || cabinClass === 'first' || index % 2 === 0,
      services: [
        'Repas chaud complet & Boissons',
        cabinClass === 'business' || cabinClass === 'first' ? 'Accès Salon VIP Lounge' : 'Divertissement à bord',
        'Prise d\'alimentation & USB',
        'Wi-Fi haut débit à bord'
      ],
      seatsAvailable: 7 + (index * 4),
      recommended: index === 0 || index === 1
    });
  });

  return generated;
}

// Détail complet d'un vol par ID
export function getFlightById(flightId) {
  const found = BASE_FLIGHTS.find(f => f.id === flightId);
  if (found) return found;

  // Si c'est un vol dynamique
  const parts = flightId.split('-');
  const from = parts[1] || 'CDG';
  const to = parts[2] || 'DSS';
  const flights = searchFlights({ from, to });
  return flights.find(f => f.id === flightId) || flights[0];
}
