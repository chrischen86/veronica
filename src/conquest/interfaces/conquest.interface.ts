export interface Conquest {
  id: string;
  allianceId: string;
  startDate: Date;
  endDate: Date;
  phases: Phase[];
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
}

export interface Node {
  id: string;
  zoneId: string;
  number: number;
  ownerId: string;
  status: NodeStatus;
}

export enum NodeStatus {
  'OPEN',
  'HOLD',
}

export enum ZoneOrders {
  Fill = 'FILL',
  Finish = 'FINISH',
  Stop = 'STOP',
}
