import { Module } from '@nestjs/common';
import { AllianceService } from './alliance.service';
import { AllianceController } from './alliance.controller';
import { DalModule } from '../dal/dal.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { AllianceSagas } from './sagas/alliance.sagas';

@Module({
  providers: [
    AllianceService,
    ...QueryHandlers,
    ...CommandHandlers,
    AllianceSagas,
  ],
  controllers: [AllianceController],
  imports: [DalModule, CqrsModule],
})
export class AllianceModule {}
