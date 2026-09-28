// Mock de réservations passées et futures réalistes pour HorizonVols
export const INITIAL_BOOKINGS = [
  {
    id: 'BK-98421',
    pnr: 'HZV-7842A',
    createdAt: '2026-08-20T14:32:00Z',
    status: 'CONFIRMED', // CONFIRMED, PENDING, CANCELLED, COMPLETED
    customer: {
      firstName: 'Amadou',
      lastName: 'Diallo',
      email: 'amadou.diallo@horizonvols.com',
      phone: '+221 77 654 32 10'
    },
    flight: {
      id: 'FL-001',
      flightNumber: 'AF 718',
      airlineCode: 'AF',
      airlineName: 'Air France',
      from: 'CDG',
      to: 'DSS',
      departureDate: '2026-10-12',
      departureTime: '15:40',
      arrivalDate: '2026-10-12',
      arrivalTime: '19:35',
      aircraft: 'Boeing 777-300ER',
      cabinClass: 'economy',
      duration: '5h 55m',
      terminal: 'Terminal 2E',
      gate: 'K42'
    },
    passengers: [
      {
        id: 'p1',
        civility: 'M.',
        firstName: 'Amadou',
        lastName: 'Diallo',
        birthDate: '1988-06-14',
        nationality: 'Sénégalaise',
        gender: 'M',
        documentType: 'Passeport',
        documentNumber: 'A12894562',
        documentExpiry: '2030-04-18',
        seat: '12A'
      }
    ],
    selectedOptions: {
      extraBaggage: 1, // 1 bagage 23kg supplémentaire
      meal: 'Halal Gourmet',
      insurance: 'Pack Sérénité Horizon',
      premiumSeat: true
    },
    pricing: {
      basePrice: 489,
      taxes: 78,
      extraBaggagePrice: 65,
      insurancePrice: 39,
      seatPrice: 25,
      total: 696,
      currency: 'EUR'
    },
    payment: {
      method: 'Carte Bancaire',
      last4: '4242',
      status: 'Payé',
      paidAt: '2026-08-20T14:35:10Z'
    }
  },
  {
    id: 'BK-98422',
    pnr: 'HZV-5120B',
    createdAt: '2026-09-02T09:12:00Z',
    status: 'CONFIRMED',
    customer: {
      firstName: 'Koffi',
      lastName: 'Mensah',
      email: 'koffi.mensah@gmail.com',
      phone: '+228 90 12 34 56'
    },
    flight: {
      id: 'FL-007',
      flightNumber: 'SN 251',
      airlineCode: 'SN',
      airlineName: 'Brussels Airlines',
      from: 'BRU',
      to: 'COO',
      departureDate: '2026-11-04',
      departureTime: '10:50',
      arrivalDate: '2026-11-04',
      arrivalTime: '17:35',
      aircraft: 'Airbus A330-300',
      cabinClass: 'business',
      duration: '6h 45m',
      terminal: 'Terminal B',
      gate: 'B18'
    },
    passengers: [
      {
        id: 'p1',
        civility: 'M.',
        firstName: 'Koffi',
        lastName: 'Mensah',
        birthDate: '1979-11-23',
        nationality: 'Togolaise',
        gender: 'M',
        documentType: 'Passeport',
        documentNumber: 'TG8841920',
        documentExpiry: '2029-08-11',
        seat: '2A'
      }
    ],
    selectedOptions: {
      extraBaggage: 0,
      meal: 'Chef Business Menu',
      insurance: 'Assurance Horizon Premium',
      premiumSeat: false
    },
    pricing: {
      basePrice: 1450,
      taxes: 120,
      extraBaggagePrice: 0,
      insurancePrice: 65,
      seatPrice: 0,
      total: 1635,
      currency: 'EUR'
    },
    payment: {
      method: 'Mobile Money (Wave)',
      last4: 'Wave Pay',
      status: 'Payé',
      paidAt: '2026-09-02T09:15:00Z'
    }
  },
  {
    id: 'BK-98423',
    pnr: 'HZV-3310C',
    createdAt: '2026-06-10T18:40:00Z',
    status: 'COMPLETED',
    customer: {
      firstName: 'Fatou',
      lastName: 'Traoré',
      email: 'fatou.traore@yahoo.fr',
      phone: '+223 76 11 22 33'
    },
    flight: {
      id: 'FL-005',
      flightNumber: 'AF 702',
      airlineCode: 'AF',
      airlineName: 'Air France',
      from: 'CDG',
      to: 'ABJ',
      departureDate: '2026-07-15',
      departureTime: '13:45',
      arrivalDate: '2026-07-15',
      arrivalTime: '18:15',
      aircraft: 'Boeing 777-300ER',
      cabinClass: 'economy',
      duration: '6h 30m',
      terminal: 'Terminal 2E',
      gate: 'L21'
    },
    passengers: [
      {
        id: 'p1',
        civility: 'Mme',
        firstName: 'Fatou',
        lastName: 'Traoré',
        birthDate: '1992-03-05',
        nationality: 'Ivoirienne',
        gender: 'F',
        documentType: 'Passeport',
        documentNumber: 'CI9021884',
        documentExpiry: '2028-12-01',
        seat: '15F'
      }
    ],
    selectedOptions: {
      extraBaggage: 1,
      meal: 'Standard',
      insurance: 'Sans assurance',
      premiumSeat: false
    },
    pricing: {
      basePrice: 520,
      taxes: 84,
      extraBaggagePrice: 60,
      insurancePrice: 0,
      seatPrice: 0,
      total: 664,
      currency: 'EUR'
    },
    payment: {
      method: 'Orange Money',
      last4: 'OM CI',
      status: 'Payé',
      paidAt: '2026-06-10T18:44:00Z'
    }
  },
  {
    id: 'BK-98424',
    pnr: 'HZV-9012D',
    createdAt: '2026-08-01T11:00:00Z',
    status: 'CANCELLED',
    customer: {
      firstName: 'Jean-Marc',
      lastName: 'Durand',
      email: 'jm.durand@orange.fr',
      phone: '+33 6 12 34 56 78'
    },
    flight: {
      id: 'FL-004',
      flightNumber: 'AT 791',
      airlineCode: 'AT',
      airlineName: 'Royal Air Maroc',
      from: 'CDG',
      to: 'CMN',
      departureDate: '2026-08-25',
      departureTime: '11:20',
      arrivalDate: '2026-08-25',
      arrivalTime: '13:30',
      aircraft: 'Boeing 737 MAX 8',
      cabinClass: 'economy',
      duration: '3h 10m',
      terminal: 'Terminal 1',
      gate: 'A12'
    },
    passengers: [
      {
        id: 'p1',
        civility: 'M.',
        firstName: 'Jean-Marc',
        lastName: 'Durand',
        birthDate: '1975-04-12',
        nationality: 'Française',
        gender: 'M',
        documentType: 'CNI',
        documentNumber: '140975892110',
        documentExpiry: '2031-01-15',
        seat: '08C'
      }
    ],
    selectedOptions: {
      extraBaggage: 0,
      meal: 'Standard',
      insurance: 'Assurance Annulation',
      premiumSeat: false
    },
    pricing: {
      basePrice: 210,
      taxes: 45,
      extraBaggagePrice: 0,
      insurancePrice: 25,
      seatPrice: 0,
      total: 280,
      currency: 'EUR'
    },
    payment: {
      method: 'Carte Bancaire',
      last4: '8821',
      status: 'Remboursé',
      paidAt: '2026-08-01T11:05:00Z'
    }
  }
];

export function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HZV-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
