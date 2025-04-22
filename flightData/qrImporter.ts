import type { BoardingPass } from '@/flightData/boardingPass';
import { BoardingPasses, airportNames } from '@/flightData/boardingPassesInfoTest';

type QRData = {
    id: string;
    airline: string;
    airlineImage: {
        uri: string;
    };
    flightNumber: string;
    route: {
        origin: keyof typeof airportNames;
        originName: string;
        destination: keyof typeof airportNames;
        destinationName: string;
        departureTime: string;
        arrivalTime: string;
        terminal: string;
        gate: string;
    };
    passenger: {
        name: string;
        seat: string;
        ticketNumber: string;
    };
    boardingTime: string;
    baggageAllowance: string;
    qrCode: string;
};
  
export const insertFromQR = (boardingPass: QRData) => {
    const nextId = BoardingPasses.length+1;
    const newBoardingPass: BoardingPass = 
    {
        id: nextId.toString(), //boardingPass.airline,
        airline: boardingPass.airline,
        airlineImage: { uri: boardingPass.airlineImage.uri },
        flightNumber: boardingPass.flightNumber,
        route: {
          origin: boardingPass.route.origin,
          originName: boardingPass.route.originName,
          destination: boardingPass.route.destination,
          destinationName: boardingPass.route.destinationName,
          departureTime: boardingPass.route.departureTime,
          arrivalTime: boardingPass.route.arrivalTime,
          terminal: boardingPass.route.terminal,
          gate: boardingPass.route.gate,
        },
        passenger: {
          name: boardingPass.passenger.name,
          seat: boardingPass.passenger.seat,
          ticketNumber: boardingPass.passenger.ticketNumber,
        },
        boardingTime: boardingPass.boardingTime,
        baggageAllowance: boardingPass.baggageAllowance,
        qrCode: boardingPass.qrCode,
      }
  
      BoardingPasses.push(newBoardingPass);
  };
  