import { Node } from '../../../conquest/interfaces/conquest.interface';

export const marshallNode = (
  conquestId: string,
  phaseId: string,
  node: Node,
) => {
  const { id, zoneId, number, status, ownerId } = node;
  const toReturn = {
    ...marshallNodeKey(conquestId, phaseId, zoneId, id),
    id: { S: id },
    zoneId: { S: zoneId },
    number: { N: `${number}` },
    status: { N: `${status}` },
  };

  if (ownerId !== undefined) {
    toReturn['ownerId'] = { S: ownerId };
  }

  return toReturn;
};

export const marshallNodeKey = (
  conquestId: string,
  phaseId: string,
  zoneId: string,
  id: string,
) => {
  return {
    PK: { S: `CONQUEST#${conquestId}` },
    SK: { S: `PHASE#${phaseId}#ZONE#${zoneId}#NODE#${id}` },
  };
};
