import { Injectable } from '@nestjs/common';
import { Conquest, Phase, Zone } from '../interfaces/conquest.interface';
import MemoryStore from './memory.store';
import { ZoneRepository } from './zone.repository';

@Injectable()
export class ZoneRepositoryMemoryAdapter extends ZoneRepository {
  private conquestMap: Map<string, Conquest>;

  constructor(private readonly store: MemoryStore) {
    super();
    this.conquestMap = this.store.get();
  }

  async findAllOnPhase(conquestId: string, phaseId: string): Promise<Zone[]> {
    if (!this.conquestMap.has(conquestId)) {
      return [];
    }
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }

    return phase.zones;
  }

  async findOneOnPhaseById(
    conquestId: string,
    phaseId: string,
    id: string,
  ): Promise<Zone> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    return phase.zones.find((p) => p.id === id);
  }

  async create(conquestId: string, zone: Zone): Promise<Zone> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }

    const { phaseId } = zone;
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    const phase = phases.find((p) => p.id === phaseId);
    if (phase === undefined) {
      return null;
    }
    const updatedPhase: Phase = {
      ...phase,
      zones: [...phase.zones, zone],
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
}