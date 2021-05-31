export interface Conquest {
  id: string;
  allianceId: string;
  to: Date;
  from: Date;
  phases: Phase[];
}

export interface Phase {
  id: string;
  conquestId: string;
  number: number;
  to: Date;
  from: Date;
  zones: Zone[];
}

export interface Zone {
  id: string;
  phaseId: string;
  number: number;
  nodes: Node[];
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
