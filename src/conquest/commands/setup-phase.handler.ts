import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Phase } from '../interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';
import SetupPhaseCommand from './setup-phase.command';

@CommandHandler(SetupPhaseCommand)
export class SetupPhaseHandler implements ICommandHandler<SetupPhaseCommand> {
  constructor(
    private readonly repository: ConquestRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SetupPhaseCommand) {
    console.log('SetupPhaseCommand...');

    const { phase: phaseNumber, to, from } = command;
    const phase: Phase = {
      id: '1',
      to,
      from,
      number: phaseNumber,
      zones: [],
    };
    await this.repository.createPhase('1', phase);
  }
}
