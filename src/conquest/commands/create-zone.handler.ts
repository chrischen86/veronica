import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ZoneCreatedEvent } from '../events/zone-created.event';
import { Zone, ZoneOrders, ZoneStatus } from '../interfaces/conquest.interface';
import { ZoneRepository } from '../../dal/repository/zone.repository';
import CreateZoneCommand from './create-zone.command';

@CommandHandler(CreateZoneCommand)
export class CreateZoneHandler implements ICommandHandler<CreateZoneCommand> {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateZoneCommand) {
    console.log('CreateZoneCommand...');

    const { conquestId, phaseId, zone: zoneNumber, holds } = command;
    const zone: Zone = {
      id: uuidv4(),
      phaseId,
      number: zoneNumber,
      nodes: [],
      orders: ZoneOrders.Fill,
      status: ZoneStatus.Open,
    };
    await this.repository.create(conquestId, zone);
    this.eventBus.publish(new ZoneCreatedEvent(conquestId, zone, holds));
  }
}
