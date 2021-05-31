import { SetupConquestHandler } from './setup-conquest.handler';
import { SetupPhaseHandler } from './setup-phase.handler';
import { CreateZoneHandler } from './create-zone.handler';
import { CreateNodeHandler } from './create-node.handler';

export const CommandHandlers = [
  SetupConquestHandler,
  SetupPhaseHandler,
  CreateZoneHandler,
  CreateNodeHandler,
];
