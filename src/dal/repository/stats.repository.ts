import { UpdateStatsDto } from '../../stats/dtos/update-stats.dto';
import { Stats } from '../../stats/interfaces/stats.interface';

export abstract class StatsRepository {
  abstract incrementAttack(dto: UpdateStatsDto);
  abstract decrementAttack(dto: UpdateStatsDto);
  abstract findAllUserStats(ownerId: string): Promise<Stats[]>;
  abstract findUserStatsByDate(
    ownerId: string,
    startDate: Date,
  ): Promise<Stats[]>;
  abstract findAllianceStats(allianceId: string): Promise<Stats[]>;
}
