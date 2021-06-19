import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DalModule } from '../dal/dal.module';
import { CommandHandlers } from './commands';
import { ConquestController } from './conquest.controller';
import { ConquestService } from './conquest.service';
import { EventHandlers } from './events';
import { NodeController } from './node.controller';
import { PhaseController } from './phase.controller';
import { QueryHandlers } from './queries';
import { ConquestSagas } from './sagas/conquest.sagas';
import { ZoneController } from './zone.controller';

@Module({
  imports: [CqrsModule, DalModule],
  exports: [ConquestService],
  controllers: [
    ConquestController,
    PhaseController,
    ZoneController,
    NodeController,
  ],
  providers: [
    ConquestService,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ConquestSagas,
  ],
})
export class ConquestModule {}
