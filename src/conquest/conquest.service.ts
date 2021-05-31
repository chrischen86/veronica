import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateNodeCommand from './commands/create-node.command';
import CreateZoneCommand from './commands/create-zone.command';
import SetupConquestCommand from './commands/setup-conquest.command';
import SetupPhaseCommand from './commands/setup-phase.command';
import {
  Conquest,
  Node,
  NodeStatus,
  Phase,
  Zone,
} from './interfaces/conquest.interface';
import { GetConquestQuery } from './queries/get-conquest.query';
import { GetNodeQuery } from './queries/get-node.query';
import { GetPhasesQuery } from './queries/get-phase.query';
import { GetZoneQuery } from './queries/get-zone.query';
import { ListConquestQuery } from './queries/list-conquest.query';
import { ListNodesQuery } from './queries/list-nodes.query';
import { ListPhasesQuery } from './queries/list-phases.query';
import { ListZonesQuery } from './queries/list-zones.query';

@Injectable()
export class ConquestService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //CONQUEST METHODS
  async findAllConquest(): Promise<Conquest[]> {
    return this.queryBus.execute(new ListConquestQuery());
  }

  async findOneConquest(conquestId: string): Promise<Conquest> {
    //Alternatively split entities into seperate stores, combine here
    return this.queryBus.execute(new GetConquestQuery(conquestId));
  }

  async createConquest(allianceId: string, to: Date, from: Date) {
    return this.commandBus.execute(
      new SetupConquestCommand(allianceId, to, from),
    );
  }

  //PHASE METHODS
  async findAllPhasesOnConquest(conquestId: string): Promise<Phase[]> {
    return this.queryBus.execute(new ListPhasesQuery(conquestId));
  }

  async findOnePhaseOnConquest(conquestId: string, id: string): Promise<Phase> {
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

  //ZONE METHODS
  async findAllZonesOnPhase(
    conquestId: string,
    phaseId: string,
  ): Promise<Zone[]> {
    return this.queryBus.execute(new ListZonesQuery(conquestId, phaseId));
  }

  async findOneZonesOnPhase(
    conquestId: string,
    phaseId: string,
    id: string,
  ): Promise<Zone> {
    return this.queryBus.execute(new GetZoneQuery(conquestId, phaseId, id));
  }

  async createZone(
    conquestId: string,
    phaseId: string,
    zoneNumber: number,
  ): Promise<Zone> {
    return this.commandBus.execute(
      new CreateZoneCommand(conquestId, phaseId, zoneNumber),
    );
  }

  //NODE METHODS
  async findAllNodesOnZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
  ): Promise<Node[]> {
    return this.queryBus.execute(
      new ListNodesQuery(conquestId, phaseId, zoneId),
    );
  }

  async findOneNodeOnZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    id: string,
  ): Promise<Node> {
    return this.queryBus.execute(
      new GetNodeQuery(conquestId, phaseId, zoneId, id),
    );
  }

  async createNode(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeNumber: number,
    ownerId: string,
    status: NodeStatus,
  ): Promise<Zone> {
    return this.commandBus.execute(
      new CreateNodeCommand(
        conquestId,
        phaseId,
        zoneId,
        nodeNumber,
        ownerId,
        status,
      ),
    );
  }
}
