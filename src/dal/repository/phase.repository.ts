import { Phase } from '../../conquest/interfaces/conquest.interface';

export abstract class PhaseRepository {
  abstract findAllOnConquest(conquestId: string): Promise<Phase[]>;
  abstract findOneOnConquestById(
    conquestId: string,
    id: string,
  ): Promise<Phase>;
  abstract create(phase: Phase): Promise<Phase>;
}
