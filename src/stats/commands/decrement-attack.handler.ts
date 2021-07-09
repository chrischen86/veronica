import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { StatsRepository } from '../../dal/repository/stats.repository';
import { UpdateStatsDto } from '../dtos/update-stats.dto';
import DecrementAttackCommand from './decrement-attack.command';

@CommandHandler(DecrementAttackCommand)
export class DecrementAttackHandler
  implements ICommandHandler<DecrementAttackCommand>
{
  constructor(private readonly repository: StatsRepository) {}

  async execute(command: DecrementAttackCommand) {
    console.log('DecrementAttackCommand Handler...');
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
    this.repository.decrementAttack(dto);
  }
}
