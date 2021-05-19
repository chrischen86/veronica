import { Conquest, Phase } from '../interfaces/conquest.interface';

export abstract class ConquestRepository {
  abstract findAll(): Promise<Conquest[]>;
  abstract findOneById(id: string): Promise<Conquest>;
  abstract create(conquest: Conquest): Promise<Conquest>;

  abstract createPhase(conquestId: string, phase: Phase): Promise<Conquest>;
}
