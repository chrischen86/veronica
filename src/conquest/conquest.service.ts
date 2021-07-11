import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Context } from '../shared/interfaces/context.interface';
import ClearNodeCommand from './commands/clear-node.command';
import CreateNodeCommand from './commands/create-node.command';
import CreateZoneCommand from './commands/create-zone.command';
import DeleteConquestCommand from './commands/delete-conquest.command';
import RequestNodeCommand from './commands/request-node.command';
import SetupConquestCommand from './commands/setup-conquest.command';
import SetupPhaseCommand from './commands/setup-phase.command';
import UpdateNodeCommand from './commands/update-node.command';
import UpdateZoneOrdersCommand from './commands/update-zone-orders.command';
import UpdateZoneStatusCommand from './commands/update-zone-status.command';
import { ClearNodeDto } from './dtos/clear-node.dto';
import { RequestNodeDto } from './dtos/request-node.dto';
import {
  Conquest,
  Node,
  NodeStatus,
  Phase,
  Zone,
  ZoneOrders,
  ZoneStatus,
} from './interfaces/conquest.interface';
import { GetConquestQuery } from './queries/get-conquest.query';
import { GetNodeQuery } from './queries/get-node.query';
import { GetPhasesQuery } from './queries/get-phase.query';
import { GetZoneQuery } from './queries/get-zone.query';
import { ListConquestQuery } from './queries/list-conquest.query';
import { ListNodesQuery } from './queries/list-nodes.query';
import { ListPhasesQuery } from './queries/list-phases.query';
import { ListZonesQuery } from './queries/list-zones.query';
import { getEndDate } from './sagas/phase.helper';

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

  async createConquest(allianceId: string, startDate: Date) {
    const endDate = getEndDate(startDate);
    return this.commandBus.execute(
      new SetupConquestCommand(allianceId, startDate, endDate),
    );
  }

  async createConquestOverride(
    allianceId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.commandBus.execute(
      new SetupConquestCommand(allianceId, startDate, endDate),
    );
  }

  async deleteOneConquest(conquestId: string) {
    return this.commandBus.execute(new DeleteConquestCommand(conquestId));
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
    startDate: Date,
    endDate: Date,
    conquestId: string,
  ): Promise<Phase> {
    return this.commandBus.execute(
      new SetupPhaseCommand(phaseNumber, startDate, endDate, conquestId),
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
    holds: number[] = [],
  ): Promise<Zone> {
    return this.commandBus.execute(
      new CreateZoneCommand(conquestId, phaseId, zoneNumber, holds),
    );
  }

  async updateZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    orders: ZoneOrders,
  ) {
    return this.commandBus.execute(
      new UpdateZoneOrdersCommand(conquestId, phaseId, zoneId, orders),
    );
  }

  async updateZoneStatus(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    status: ZoneStatus,
  ) {
    return this.commandBus.execute(
      new UpdateZoneStatusCommand(conquestId, phaseId, zoneId, status),
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
  ): Promise<Node> {
    return this.commandBus.execute(
      new CreateNodeCommand(
        conquestId,
        phaseId,
        zoneId,
        nodeNumber,
        status,
        ownerId,
      ),
    );
  }

  async updateNode(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
    ownerId?: string,
    status?: NodeStatus,
  ) {
    return this.commandBus.execute(
      new UpdateNodeCommand(
        conquestId,
        phaseId,
        zoneId,
        nodeId,
        status,
        ownerId,
      ),
    );
  }

  async requestNode(requestNodeDto: RequestNodeDto, context?: Context) {
    const { conquestId, phaseId, zoneId, nodeId, ownerId, ownerName } =
      requestNodeDto;
    return this.commandBus.execute(
      new RequestNodeCommand(
        conquestId,
        phaseId,
        zoneId,
        nodeId,
        ownerId,
        ownerName,
        context,
      ),
    );
  }

  async clearNode(clearNodeDto: ClearNodeDto, context?: Context) {
    const { conquestId, phaseId, zoneId, nodeId } = clearNodeDto;
    return this.commandBus.execute(
      new ClearNodeCommand(conquestId, phaseId, zoneId, nodeId, context),
    );
  }
}
