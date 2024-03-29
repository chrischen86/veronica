import { Zone } from '../../conquest/interfaces/conquest.interface';
import { UpdateZoneDto } from '../../conquest/interfaces/update-zone-dto.interface';

export abstract class ZoneRepository {
  abstract findAllOnPhase(conquestId: string, phaseId: string): Promise<Zone[]>;
  abstract findOneOnPhaseById(
    conquestId: string,
    phaseId: string,
    id: string,
  ): Promise<Zone>;
  abstract create(conquestId: string, zone: Zone): Promise<Zone>;
  abstract update(updateZoneDto: UpdateZoneDto);
}
