import { Injectable } from '@nestjs/common';
import { Conquest, Phase } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';
import MemoryStore from '../repository/memory.store';

@Injectable()
export class ConquestRepositoryMemoryAdapter extends ConquestRepository {
  findByQuery(
    allianceId: string,
    start: string,
    end: string,
  ): Promise<Conquest[]> {
    throw new Error('Method not implemented.');
  }
  findAllByAllianceId(allianceId: string): Promise<Conquest[]> {
    throw new Error('Method not implemented.');
  }
  private conquestMap: Map<string, Conquest>;

  constructor(private readonly store: MemoryStore) {
    super();
    this.conquestMap = this.store.get();
  }

  async findAll(): Promise<Conquest[]> {
    return [...this.conquestMap.values()];
  }

  async findOneById(id: string): Promise<Conquest> {
    if (!this.conquestMap.has(id)) {
      return null;
    }
    return this.conquestMap.get(id);
  }

  async create(conquest: Conquest): Promise<Conquest> {
    const { id } = conquest;
    if (!this.conquestMap.has(id)) {
      this.conquestMap.set(id, conquest);
    }
    this.conquestMap.set(id, conquest);
    return conquest;
  }

  async createPhase(conquestId: string, phase: Phase): Promise<Conquest> {
    if (!this.conquestMap.has(conquestId)) {
      return null;
    }

    const conquest = this.conquestMap.get(conquestId);
    conquest.phases.push(phase);

    return conquest;
  }

  async delete(conquestId: string) {
    if (!this.conquestMap.has(conquestId)) {
      return false;
    }

    this.conquestMap.delete(conquestId);

    return true;
  }
}
