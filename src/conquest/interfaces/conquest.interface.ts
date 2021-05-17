export interface Conquest {
  id: string;
  to: Date;
  from: Date;
  phases: Phase[];
}

export interface Phase {
  id: string;
  number: number;
  to: Date;
  from: Date;
  zones: Zone[];
}

export interface Zone {
  id: string;
  number: number;
  nodes: Node[];
}

export interface Node {
  id: string;
  number: number;
  ownerId: string;
  status: NodeStatus;
}

export enum NodeStatus {
  'OPEN',
  'HOLD',
}
