import { Alliance } from '../../../alliance/interfaces/alliance.interface';

export const marshallAlliance = (alliance: Alliance) => {
  const { id, name, ownerId, ownerName } = alliance;

  const toReturn = {
    ...marshallAllianceKey(id),
    GSI1PK: { S: 'ALLIANCE' },
    GSI1SK: { S: `NAME#${name}` },
    GSI2PK: { S: `ALLIANCE#${id}` },
    GSI2SK: { S: `NAME#${name}` },
    id: { S: id },
    name: { S: name },
    ownerId: { S: ownerId },
    ownerName: { S: ownerName },
  };

  return toReturn;
};

export const marshallAllianceKey = (id: string) => {
  return {
    PK: { S: `ALLIANCE` },
    SK: { S: `ALLIANCE#${id}` },
  };
};
