import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PhaseRepository } from '../../dal/repository/phase.repository';
import { Phase } from '../interfaces/conquest.interface';
import SetupPhaseCommand from './setup-phase.command';

@CommandHandler(SetupPhaseCommand)
export class SetupPhaseHandler implements ICommandHandler<SetupPhaseCommand> {
  constructor(
    private readonly repository: PhaseRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SetupPhaseCommand) {
    console.log('SetupPhaseCommand...');

    const { phase: phaseNumber, startDate, endDate, conquestId } = command;
    const phase: Phase = {
      id: uuidv4(),
      startDate,
      endDate,
      number: phaseNumber,
      conquestId,
      zones: [],
    };
    await this.repository.create(phase);
  }
}
