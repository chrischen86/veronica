import { Zone } from '../interfaces/conquest.interface';

export abstract class ZoneRepository {
  abstract findAllOnPhase(conquestId: string, phaseId: string): Promise<Zone[]>;
  abstract findOneOnPhaseById(
    conquestId: string,
    phaseId: string,
    id: string,
  ): Promise<Zone>;
  abstract create(conquestId: string, zone: Zone): Promise<Zone>;
}