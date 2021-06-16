import { Phase } from 'src/conquest/interfaces/conquest.interface';

export const marshallPhase = (phase: Phase) => {
  const { id, conquestId, number, startDate, endDate } = phase;
  return {
    ...marshallPhaseKey(conquestId, id),
    id: { S: id },
    conquestId: { S: conquestId },
    number: { N: `${number}` },
    startDate: { S: startDate.toISOString() },
    endDate: { S: endDate.toISOString() },
  };
};

export const marshallPhaseKey = (conquestId: string, id: string) => {
  return {
    PK: { S: `CONQUEST#${conquestId}` },
    SK: { S: `PHASE#${id}#NULL` },
  };
};
