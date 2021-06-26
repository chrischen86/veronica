import { Conquest } from '../../conquest/interfaces/conquest.interface';

export abstract class ConquestRepository {
  abstract findAll(): Promise<Conquest[]>;
  abstract findAllByAllianceId(allianceId: string): Promise<Conquest[]>;
  abstract findOneById(id: string): Promise<Conquest>;
  abstract create(conquest: Conquest): Promise<Conquest>;
  abstract delete(conquestId: string);
}
