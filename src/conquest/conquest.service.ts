import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import SetupConquestCommand from './commands/setup-conquest.command';
import SetupPhaseCommand from './commands/setup-phase.command';
import { Conquest } from './interfaces/conquest.interface';
import { GetConquestQuery } from './queries/get-conquest.query';
import { ListConquestQuery } from './queries/list-conquest.query';

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

  async setupPhase(phase: number) {
    const conquest = await this.queryBus.execute(new GetConquestQuery('1'));
    if (conquest === null) {
      await this.commandBus.execute(
        new SetupConquestCommand(
          'alphaflight',
          new Date('May 17, 2021 01:00:00'),
          new Date('May 15, 2021 01:00:00'),
        ),
      );
    }
    return await this.commandBus.execute(
      new SetupPhaseCommand(
        1,
        new Date('May 16, 2021 01:00:00'),
        new Date('May 16, 2021 02:00:00'),
        '1',
      ),
    );
  }
}
