import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import SetupConquestCommand from './commands/setup-conquest.command';
import SetupPhaseCommand from './commands/setup-phase.command';
import { Conquest, Phase } from './interfaces/conquest.interface';
import { GetConquestQuery } from './queries/get-conquest.query';
import { GetPhasesQuery } from './queries/get-phase.query';
import { ListConquestQuery } from './queries/list-conquest.query';
import { ListPhasesQuery } from './queries/list-phases.query';

@Injectable()
export class ConquestService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findAllConquest(): Promise<Conquest[]> {
    return this.queryBus.execute(new ListConquestQuery());
  }

  async findOneConquest(conquestId: string): Promise<Conquest> {
    return this.queryBus.execute(new GetConquestQuery(conquestId));
  }

  async createConquest(allianceId: string, to: Date, from: Date) {
    return this.commandBus.execute(
      new SetupConquestCommand(allianceId, to, from),
    );
  }

  async findAllPhasesOnConquest(conquestId: string): Promise<Phase[]> {
    return this.queryBus.execute(new ListPhasesQuery(conquestId));
  }

  async findOnePhaseOnconquest(conquestId: string, id: string): Promise<Phase> {
    return this.queryBus.execute(new GetPhasesQuery(conquestId, id));
  }

  async createPhase(
    phaseNumber: number,
    to: Date,
    from: Date,
    conquestId: string,
  ): Promise<Phase> {
    return this.commandBus.execute(
      new SetupPhaseCommand(phaseNumber, to, from, conquestId),
    );
  }
}
