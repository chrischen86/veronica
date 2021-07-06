import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { StatsRepository } from '../../dal/repository/stats.repository';
import { UpdateStatsDto } from '../dtos/update-stats.dto';
import IncrementAttackCommand from './increment-attack.command';

@CommandHandler(IncrementAttackCommand)
export class IncrementAttackHandler
  implements ICommandHandler<IncrementAttackCommand>
{
  constructor(private readonly repository: StatsRepository) {}

  async execute(command: IncrementAttackCommand) {
    console.log('IncrementAttackCommand Handler...');
    const { ownerId, ownerName, allianceId, allianceName } = command;
    if (
      ownerId === undefined ||
      ownerName === undefined ||
      allianceId === undefined ||
      allianceName === undefined
    ) {
      return;
    }

    const id = uuidv4();
    const now = new Date();
    const dto: UpdateStatsDto = {
      id,
      ownerId,
      ownerName,
      allianceId,
      allianceName,
      attackDate: now,
    };
    this.repository.incrementAttack(dto);
  }
}
