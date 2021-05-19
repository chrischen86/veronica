import { Injectable } from '@nestjs/common';
import { Conquest, Phase } from '../interfaces/conquest.interface';
import MemoryStore from './memory.store';
import { PhaseRepository } from './phase.repository';

@Injectable()
export class PhaseRepositoryMemoryAdapter extends PhaseRepository {
  private conquestMap: Map<string, Conquest>;

  constructor(private readonly store: MemoryStore) {
    super();
    this.conquestMap = this.store.get();
  }

  async findAllOnConquest(conquestId: string): Promise<Phase[]> {
    if (!this.conquestMap.has(conquestId)) {
      return [];
    }
    const conquest = this.conquestMap.get(conquestId);
    return conquest.phases;
  }

  async findOneOnConquestById(conquestId: string, id: string): Promise<Phase> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }
    const conquest = this.conquestMap.get(conquestId);
    const { phases } = conquest;
    return phases.find((p) => p.id === id);
  }

  async create(phase: Phase): Promise<Phase> {
    const { conquestId } = phase;
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }

    const conquest = this.conquestMap.get(conquestId);
    const newConquest = {
      ...conquest,
      phases: [...conquest.phases, phase],
    };
    this.conquestMap.set(conquestId, newConquest);
  }
}
