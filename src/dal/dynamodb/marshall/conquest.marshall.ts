import { Conquest } from 'src/conquest/interfaces/conquest.interface';

export const marshallConquest = (conquest: Conquest) => {
  const { id, allianceId, startDate, endDate } = conquest;
  return {
    ...marshallConquestKey(id),
    id: { S: id },
    allianceId: { S: allianceId },
    startDate: { S: startDate.toISOString() },
    endDate: { S: endDate.toISOString() },
  };
};

export const marshallConquestKey = (id: string) => {
  return {
    PK: { S: `CONQUEST#${id}` },
    SK: { S: `METADATA#${id}` },
  };
};
