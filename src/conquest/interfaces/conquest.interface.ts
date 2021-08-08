export class Conquest {
  id: string;
  allianceId: string;
  startDate: Date;
  endDate: Date;
  phases?: Phase[];
}

export interface Phase {
  id: string;
  conquestId: string;
  number: number;
  startDate: Date;
  endDate: Date;
  zones: Zone[];
}

export interface Zone {
  id: string;
  phaseId: string;
  number: number;
  nodes: Node[];
  orders: ZoneOrders;
  status: ZoneStatus;
}

export interface Node {
  id: string;
  zoneId: string;
  number: number;
  ownerId: string;
  ownerName?: string;
  status: NodeStatus;
}

export enum NodeStatus {
  'OPEN',
  'HOLD',
}

export enum ZoneOrders {
  Call = 'CALL',
  Attack = 'ATTACK',
  Finish = 'FINISH',
  Stop = 'STOP',
}

export enum ZoneStatus {
  Open = 'OPEN',
  Sealing = 'SEALING',
  Lost = 'LOST',
}
