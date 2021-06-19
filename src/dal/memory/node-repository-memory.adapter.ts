import { Injectable } from '@nestjs/common';
import {
  Conquest,
  Node,
  NodeStatus,
  Phase,
  Zone,
} from '../../conquest/interfaces/conquest.interface';
import MemoryStore from '../repository/memory.store';
import { NodeRepository } from '../../dal/repository/node.repository';

@Injectable()
export class NodeRepositoryMemoryAdapter extends NodeRepository {
  private conquestMap: Map<string, Conquest>;

  constructor(private readonly store: MemoryStore) {
    super();
    this.conquestMap = this.store.get();
  }

  async findAllOnZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
  ): Promise<Node[]> {
    if (!this.conquestMap.has(conquestId)) {
      return [];
    }
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    const { zones } = phase;
    const zone = zones.find((z) => z.id === zoneId);
    if (zone === undefined) {
      return null;
    }

    return zone.nodes;
  }

  async findOneOnZoneById(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    id: string,
  ): Promise<Node> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    const { zones } = phase;
    const zone = zones.find((z) => z.id === zoneId);
    if (zone === undefined) {
      return null;
    }
    return zone.nodes.find((n) => n.id === id);
  }

  async create(conquestId: string, phaseId: string, node: Node): Promise<Node> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }

    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    const { zones } = phase;
    const { zoneId } = node;
    const zone = zones.find((z) => z.id === zoneId);
    if (zone === undefined) {
      return null;
    }
    const updatedZone: Zone = {
      ...zone,
      nodes: [...zone.nodes, node],
    };
    const updatedZones = zones.map((z) => (z.id === zoneId ? updatedZone : z));
    const updatedPhase: Phase = {
      ...phase,
      zones: updatedZones,
    };
    const updatedPhases = phases.map((p) =>
      p.id === phaseId ? updatedPhase : p,
    );
    const newConquest = {
      ...conquest,
      phases: updatedPhases,
    };
    this.conquestMap.set(conquestId, newConquest);
  }

  async update(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
    ownerId?: string,
    status?: NodeStatus,
  ) {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }

    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    const { zones } = phase;
    const zone = zones.find((z) => z.id === zoneId);
    if (zone === undefined) {
      return null;
    }
    const { nodes } = zone;
    const node = nodes.find((n) => n.id === nodeId);
    if (node === undefined) {
      return null;
    }

    const updatedNode = {
      ...node,
      ownerId,
      status: status ?? node.status,
    };

    const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
    const updatedZone: Zone = {
      ...zone,
      nodes: updatedNodes,
    };
    const updatedZones = zones.map((z) => (z.id === zoneId ? updatedZone : z));
    const updatedPhase: Phase = {
      ...phase,
      zones: updatedZones,
    };
    const updatedPhases = phases.map((p) =>
      p.id === phaseId ? updatedPhase : p,
    );
    const newConquest = {
      ...conquest,
      phases: updatedPhases,
    };
    this.conquestMap.set(conquestId, newConquest);
  }

  async clearOwner(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
  ) {
    return this.update(conquestId, phaseId, zoneId, nodeId, undefined);
  }
}
