import { Stats } from '../../../stats/interfaces/stats.interface';

export const getAttackDateString = (attackDate: Date) => {
  return attackDate.toISOString().substring(0, 10);
};

export const marshallAlliance = (stats: Stats) => {
  const {
    id,
    ownerId,
    ownerName,
    allianceName,
    allianceId,
    attacks,
    attackDate,
  } = stats;

  const attackDateString = getAttackDateString(attackDate);
  const toReturn = {
    ...marshallStatsKey(ownerId, attackDate),
    GSI1PK: { S: `ALLIANCESTATS#${allianceId}` },
    GSI1SK: { S: `DATE#${attackDateString}#USER#${ownerId}` },
    GSI2PK: { S: `USERSTATS#${ownerId}` },
    GSI2SK: { S: `${attackDateString}` },
    id: { S: id },
    attacks: { N: attacks },
    attackDate: { S: attackDateString },
    ownerId: { S: ownerId },
    ownerName: { S: ownerName },
    allianceId: { S: allianceId },
    allianceName: { S: allianceName },
  };

  return toReturn;
};

export const marshallStatsKey = (ownerId: string, attackDate: Date) => {
  const attackDateString = getAttackDateString(attackDate);
  return {
    PK: { S: `STATS` },
    SK: {
      S: `USER#${ownerId}#DATE#${attackDateString}`,
    },
  };
};
