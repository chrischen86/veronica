import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DalModule } from '../dal/dal.module';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { QueryHandlers } from './queries';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  providers: [
    StatsService,
    ...EventHandlers,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  imports: [DalModule, CqrsModule],
  controllers: [StatsController],
})
export class StatsModule {}
