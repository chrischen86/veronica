import { ZoneCreatedEventHandler } from './zone-created.handler';
import { NodeUpdatedEventHandler } from './node-updated.handler';
import { ZoneOrdersUpdatedHandler } from './zone-orders-updated.handler';
import { NodeClearedEventHandler } from './node-cleared.handler';
import { NodeAssignedEventHandler } from './node-assigned.handler';
import { RoomParticipantsUpdatedEventHandler } from './room-participants-updated.handler';

export const EventHandlers = [
  ZoneCreatedEventHandler,
  NodeUpdatedEventHandler,
  ZoneOrdersUpdatedHandler,
  NodeClearedEventHandler,
  NodeAssignedEventHandler,
  RoomParticipantsUpdatedEventHandler,
];
