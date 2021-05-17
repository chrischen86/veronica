import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import SetupConquestCommand from './commands/setup-conquest.command';
import SetupPhaseCommand from './commands/setup-phase.command';
import { Conquest } from './interfaces/conquest.interface';
import { GetConquestQuery } from './queries/get-conquest.query';

@Injectable()
export class ConquestService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getConquest(): Promise<Conquest> {
    return this.queryBus.execute(new GetConquestQuery());
  }

  async createConquest(): Promise<Conquest> {
    return this.commandBus.execute(
      new SetupConquestCommand(
        new Date('May 17, 2021 01:00:00'),
        new Date('May 15, 2021 01:00:00'),
      ),
    );
  }

  async setupPhase(phase: number) {
    const conquest = await this.queryBus.execute(new GetConquestQuery());
    if (conquest === null) {
      await this.commandBus.execute(
        new SetupConquestCommand(
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
