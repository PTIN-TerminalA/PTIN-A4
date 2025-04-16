{/* 
  Definicion del tipo BoardingPass. Este archivo funciona acorde a la definicion de los datos de boardingPassesInfoTest.
  Cuando ya tengamos la api, habrá que redefinir este tipo BoardingPass (seguramente sobrarán cosas).   
*/}

export interface AirlineImage {
  uri: string;
}

export interface FlightRoute {
  origin: string;
  originName?: string;
  destination: string;
  destinationName?: string;
  departureTime: Date | string;
  arrivalTime: Date | string;
  terminal?: string;
  gate?: string;
}

export interface PassengerInfo {
  name: string;
  seat: string;
  ticketNumber?: string;
  frequentFlyer?: string;
}

export interface BoardingPass {
  id: string;
  airline: string;
  airlineImage: AirlineImage;
  flightNumber: string;
  route: FlightRoute;
  passenger: PassengerInfo;
  bookingReference?: string;
  boardingTime?: Date | string;
  baggageAllowance?: string;
  qrCode?: string;
}