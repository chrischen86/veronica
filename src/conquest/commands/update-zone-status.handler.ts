import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ZoneOrdersUpdatedEvent } from '../events/zone-orders-updated.event';
import { UpdateZoneDto } from '../interfaces/update-zone-dto.interface';
import { ZoneRepository } from '../../dal/repository/zone.repository';
import UpdateZoneStatusCommand from './update-zone-status.command';

@CommandHandler(UpdateZoneStatusCommand)
export class UpdateZoneStatusCommandHandler
  implements ICommandHandler<UpdateZoneStatusCommand>
{
  constructor(
    private readonly repository: ZoneRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateZoneStatusCommand) {
    console.log('UpdateZoneStatusCommand...');

    const { conquestId, phaseId, zoneId, status } = command;
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
      status,
    };
    await this.repository.update(zoneUpdateDto);
    this.eventBus.publish(new ZoneOrdersUpdatedEvent(conquestId, zoneId));
  }
}
