import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { Zone } from '../interfaces/conquest.interface';
import { ZoneRepository } from '../repository/zone.repository';
import CreateZoneCommand from './create-zone.command';

@CommandHandler(CreateZoneCommand)
export class CreateZoneHandler implements ICommandHandler<CreateZoneCommand> {
  constructor(private readonly repository: ZoneRepository) {}

  async execute(command: CreateZoneCommand) {
    console.log('CreateZoneCommand...');

    const { conquestId, phaseId, zone: zoneNumber } = command;
    const zone: Zone = {
      id: uuidv4(),
      phaseId,
      number: zoneNumber,
      nodes: [],
    };
    await this.repository.create(conquestId, zone);
  }
}
