import { Zone } from 'src/conquest/interfaces/conquest.interface';

export const marshallZone = (conquestId: string, zone: Zone) => {
  const { id, phaseId, number, orders, status } = zone;
  return {
    ...marshallZoneKey(conquestId, phaseId, id),
    id: { S: id },
    phaseId: { S: phaseId },
    number: { N: `${number}` },
    orders: { S: orders },
    status: { S: status },
  };
};

export const marshallZoneKey = (
  conquestId: string,
  phaseId: string,
  id: string,
) => {
  return {
    PK: { S: `CONQUEST#${conquestId}` },
    SK: { S: `PHASE#${phaseId}#ZONE#${id}#NULL` },
  };
};
