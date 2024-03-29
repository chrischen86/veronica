import { Phase } from '../../../conquest/interfaces/conquest.interface';

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
    PK: { S: `CONQUEST` },
    SK: { S: `CONQUEST#${conquestId}#PHASE#${id}#NULL` },
  };
};
