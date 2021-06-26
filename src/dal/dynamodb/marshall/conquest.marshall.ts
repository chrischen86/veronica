import { Conquest } from '../../../conquest/interfaces/conquest.interface';

export const marshallConquest = (conquest: Conquest) => {
  const { id, allianceId, startDate, endDate } = conquest;
  const startDateString = startDate.toISOString();
  return {
    ...marshallConquestKey(id),
    GSI1PK: { S: `AC#${allianceId}` },
    GSI1SK: { S: startDateString },
    id: { S: id },
    allianceId: { S: allianceId },
    startDate: { S: startDateString },
    endDate: { S: endDate.toISOString() },
  };
};

export const marshallConquestKey = (id: string) => {
  return {
    PK: { S: `CONQUEST` },
    SK: { S: `CONQUEST#${id}#NULL` },
  };
};
