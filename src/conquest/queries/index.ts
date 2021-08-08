import { GetConquestHandler } from './get-conquest.handler';
import { ListConquestHandler } from './list-conquest.handler';
import { GetPhaseHandler } from './get-phase.handler';
import { ListPhasesHandler } from './list-phases.handler';
import { GetZoneHandler } from './get-zone.handler';
import { ListZonesHandler } from './list-zones.handler';
import { GetNodeHandler } from './get-node.handler';
import { ListNodesHandler } from './list-nodes.handler';
import { GetActiveConquestHandler } from './get-active-conquest.handler';

export const QueryHandlers = [
  GetConquestHandler,
  ListConquestHandler,
  GetPhaseHandler,
  ListPhasesHandler,
  GetZoneHandler,
  ListZonesHandler,
  GetNodeHandler,
  ListNodesHandler,
  GetActiveConquestHandler,
];
