import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NodeUpdatedEvent } from '../events/node-updated.event';
import { ZoneOrdersUpdatedEvent } from '../events/zone-orders-updated.event';
import { ZoneRepository } from '../repository/zone.repository';
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

    await this.repository.update(conquestId, phaseId, zoneId, orders);
    this.eventBus.publish(new ZoneOrdersUpdatedEvent(conquestId, zoneId));
  }
}
