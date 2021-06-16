import { Injectable } from '@nestjs/common';
import { Conquest, Phase } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';

@Injectable()
export class ConquestRepositoryMemoryAdapter extends ConquestRepository {
  private conquestMap: Map<string, Conquest>;

  constructor() {
    super();

    this.conquestMap = new Map<string, Conquest>(); // this.store.get();
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
