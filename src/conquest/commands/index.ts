import { SetupConquestHandler } from './setup-conquest.handler';
import { SetupPhaseHandler } from './setup-phase.handler';
import { CreateZoneHandler } from './create-zone.handler';
import { CreateNodeHandler } from './create-node.handler';
import { DeleteConquestHandler } from './delete-conquest.handler';
import { UpdateNodeHandler } from './update-node.handler';
import { CreateNodesHandler } from './create-nodes.handler';
import { UpdateZoneOrdersCommandHandler } from './update-zone-orders.handler';
import { UpdateZoneStatusCommandHandler } from './update-zone-status.handler';
import { RequestNodeHandler } from './request-node.handler';

export const CommandHandlers = [
  SetupConquestHandler,
  SetupPhaseHandler,
  CreateZoneHandler,
  CreateNodeHandler,
  DeleteConquestHandler,
  UpdateNodeHandler,
  CreateNodesHandler,
  UpdateZoneOrdersCommandHandler,
  UpdateZoneStatusCommandHandler,
  RequestNodeHandler,
];
