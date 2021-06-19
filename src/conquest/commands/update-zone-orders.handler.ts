import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ZoneOrdersUpdatedEvent } from '../events/zone-orders-updated.event';
import { UpdateZoneDto } from '../interfaces/update-zone-dto.interface';
import { ZoneRepository } from '../../dal/repository/zone.repository';
import UpdateZoneOrdersCommand from './update-zone-orders.command';

@CommandHandler(UpdateZoneOrdersCommand)
export class UpdateZoneOrdersCommandHandler
  implements ICommandHandler<UpdateZoneOrdersCommand>
{
  constructor(
    private readonly repository: ZoneRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateZoneOrdersCommand) {
    console.log('UpdateZoneOrdersCommand...');

    const { conquestId, phaseId, zoneId, orders } = command;
    const zone = await this.repository.findOneOnPhaseById(
      conquestId,
      phaseId,
      zoneId,
    );

    if (zone === null) {
      return;
    }

    const zoneUpdateDto: UpdateZoneDto = {
      conquestId,
      phaseId,
      zoneId,
      orders,
    };

    await this.repository.update(zoneUpdateDto);
    this.eventBus.publish(new ZoneOrdersUpdatedEvent(conquestId, zoneId));
  }
}
