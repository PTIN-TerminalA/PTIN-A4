import { BoardingPass } from '@/flightData/boardingPass';

{/* 
  Este archivo ha sido generado mediante IA, es solo de prueba. Una vez se haya implementado la api, se usaran los datos recividos por esta.
  El archivo será eliminado cuando eso suceda, mientras tanto sirve de prueba para el forntend. 
*/}


export const airportNames: Record<string, string> = {
  BCN: 'Barcelona-El Prat',
  MAD: 'Madrid-Barajas',
  GRX: 'Granada-Jaén',
  HKG: 'Hong Kong International',
  ALC: 'Alicante-Elche'
};

export const passengerNames = [
  'Joel Esteller Planesas',
  'Laia Esteller Planesas',
  'Juan Carlos Esteller Alcarria',
  'Maria Jesus Beltran de Heredia',
  'Maria del Carmen Planesa Benavent'
];

export let BoardingPasses: BoardingPass[] = [
    // Ryan Air BCN-MAD (Flight 1)
    {
      id: '1',
      airline: 'Ryan Air',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/UlvFF-Zo2h6_8RdoMh9xWbAcaqSrsIU_yhQPOcH5rbTQ7Av9EvfWFTrAen1EX4X-JxA_' },
      flightNumber: 'FR 7123',
      route: {
        origin: 'BCN',
        originName: airportNames.BCN,
        destination: 'MAD',
        destinationName: airportNames.MAD,
        departureTime: '2025-03-15T07:45:00',
        arrivalTime: '2025-03-15T09:00:00',
        terminal: '1',
        gate: 'B12'
      },
      passenger: {
        name: passengerNames[0],
        seat: '14F',
        ticketNumber: 'FR-2154763829'
      },
      boardingTime: '2025-03-15T07:15:00',
      baggageAllowance: '1 × 10kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Ryan Air MAD-BCN (Flight 2)
    {
      id: '2',
      airline: 'Ryan Air',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/UlvFF-Zo2h6_8RdoMh9xWbAcaqSrsIU_yhQPOcH5rbTQ7Av9EvfWFTrAen1EX4X-JxA_' },
      flightNumber: 'FR 7124',
      route: {
        origin: 'MAD',
        originName: airportNames.MAD,
        destination: 'BCN',
        destinationName: airportNames.BCN,
        departureTime: '2025-03-16T18:30:00',
        arrivalTime: '2025-03-16T19:45:00',
        terminal: '2',
        gate: 'A5'
      },
      passenger: {
        name: passengerNames[1],
        seat: '8C',
        ticketNumber: 'FR-5487632109'
      },
      boardingTime: '2025-03-16T18:00:00',
      baggageAllowance: '1 × 10kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Iberia GRX-MAD (Flight 3)
    {
      id: '3',
      airline: 'Iberia',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/bn9i62M-CaGiVYlglz5uoDKa_uhWCRKux4_NrVqQ5R70C79v7sR88FETqlGxulDbvdk' },
      flightNumber: 'IB 3241',
      route: {
        origin: 'GRX',
        originName: airportNames.GRX,
        destination: 'MAD',
        destinationName: airportNames.MAD,
        departureTime: '2025-03-17T11:20:00',
        arrivalTime: '2025-03-17T12:35:00',
        terminal: '1',
        gate: 'C3'
      },
      passenger: {
        name: passengerNames[2],
        seat: '5A',
        ticketNumber: 'IB-9821345678',
        frequentFlyer: 'IB45678901'
      },
      boardingTime: '2025-03-17T10:45:00',
      baggageAllowance: '1 × 23kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Iberia MAD-GRX (Flight 4)
    {
      id: '4',
      airline: 'Iberia',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/bn9i62M-CaGiVYlglz5uoDKa_uhWCRKux4_NrVqQ5R70C79v7sR88FETqlGxulDbvdk' },
      flightNumber: 'IB 3242',
      route: {
        origin: 'MAD',
        originName: airportNames.MAD,
        destination: 'GRX',
        destinationName: airportNames.GRX,
        departureTime: '2025-03-18T20:15:00',
        arrivalTime: '2025-03-18T21:30:00',
        terminal: '4',
        gate: 'D7'
      },
      passenger: {
        name: passengerNames[3],
        seat: '12D',
        ticketNumber: 'IB-5678123490',
        frequentFlyer: 'IB34567890'
      },
      boardingTime: '2025-03-18T19:40:00',
      baggageAllowance: '1 × 23kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Air China BCN-HKG (Flight 5)
    {
      id: '5',
      airline: 'Air China',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/kdbH6FdwVCbmTEJFSO_pjHQzQ0LWDM1cYE-tmv8ZPV37adZY0y9ktTyYlah4X5hgxXY' },
      flightNumber: 'CA 1032',
      route: {
        origin: 'BCN',
        originName: airportNames.BCN,
        destination: 'HKG',
        destinationName: airportNames.HKG,
        departureTime: '2025-03-18T13:20:00',
        arrivalTime: '2025-03-19T07:45:00',
        terminal: '1',
        gate: 'D8'
      },
      passenger: {
        name: passengerNames[3],
        seat: '22A',
        ticketNumber: 'CA-9876543210',
        frequentFlyer: 'CA12345678'
      },
      boardingTime: '2025-03-18T12:35:00',
      baggageAllowance: '2 × 23kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Air China HKG-BCN (Flight 6)
    {
      id: '6',
      airline: 'Air China',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/kdbH6FdwVCbmTEJFSO_pjHQzQ0LWDM1cYE-tmv8ZPV37adZY0y9ktTyYlah4X5hgxXY' },
      flightNumber: 'CA 1033',
      route: {
        origin: 'HKG',
        originName: airportNames.HKG,
        destination: 'BCN',
        destinationName: airportNames.BCN,
        departureTime: '2025-03-25T23:15:00',
        arrivalTime: '2025-03-26T06:30:00',
        terminal: '1',
        gate: 'A12'
      },
      passenger: {
        name: passengerNames[4],
        seat: '18C',
        ticketNumber: 'CA-1234567890',
        frequentFlyer: 'CA87654321'
      },
      boardingTime: '2025-03-25T22:30:00',
      baggageAllowance: '2 × 23kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Vueling BCN-ALC (Flight 7)
    {
      id: '7',
      airline: 'Vueling',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/PUEfpx0TaaLM52ZjX70d2_HZUUvN1RJ6VwtAejTwxPIat_GMuVuGShKx2JGG38_yi7c=w600-h300-pc0xffffff-pd' },
      flightNumber: 'VY 6124',
      route: {
        origin: 'BCN',
        originName: airportNames.BCN,
        destination: 'ALC',
        destinationName: airportNames.ALC,
        departureTime: '2025-04-21T02:22:00',
        arrivalTime: '2025-04-21T03:30:00',
        terminal: '2',
        gate: 'B5'
      },
      passenger: {
        name: passengerNames[1],
        seat: '9D',
        ticketNumber: 'VY-4567891230'
      },
      boardingTime: '2025-04-21T02:21:00',
      baggageAllowance: '1 × 10kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },

    // Vueling ALC-BCN (Flight 8)
    {
      id: '8',
      airline: 'Vueling',
      airlineImage: { uri: 'https://play-lh.googleusercontent.com/PUEfpx0TaaLM52ZjX70d2_HZUUvN1RJ6VwtAejTwxPIat_GMuVuGShKx2JGG38_yi7c=w600-h300-pc0xffffff-pd' },
      flightNumber: 'VY 6125',
      route: {
        origin: 'ALC',
        originName: airportNames.ALC,
        destination: 'BCN',
        destinationName: airportNames.BCN,
        departureTime: '2025-04-22T17:45:00',
        arrivalTime: '2025-04-22T19:00:00',
        terminal: '1',
        gate: 'C2'
      },
      passenger: {
        name: passengerNames[0],
        seat: '3F',
        ticketNumber: 'VY-7891234560'
      },
      boardingTime: '2025-04-22T17:15:00',
      baggageAllowance: '1 × 10kg',
      qrCode: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'
    },
];