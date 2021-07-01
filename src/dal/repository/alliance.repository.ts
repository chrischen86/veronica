import { Alliance } from '../../alliance/interfaces/alliance.interface';

export abstract class AllianceRepository {
  abstract findOneById(allianceId: string): Promise<Alliance>;
  abstract findAll(maxItems?: number, lastId?: string): Promise<Alliance[]>;
  abstract create(alliance: Alliance): Promise<Alliance>;
  //abstract delete(allianceId: string);
  abstract findAllByName(name: string): Promise<Alliance[]>;
  abstract findOneByIdIncludeMembers(allianceId: string): Promise<Alliance>;
}
