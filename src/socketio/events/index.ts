import { ZoneCreatedEventHandler } from './zone-created.handler';
import { NodeUpdatedEventHandler } from './node-updated.handler';
import { ZoneOrdersUpdatedHandler } from './zone-orders-updated.handler';

export const EventHandlers = [
  ZoneCreatedEventHandler,
  NodeUpdatedEventHandler,
  ZoneOrdersUpdatedHandler,
];
