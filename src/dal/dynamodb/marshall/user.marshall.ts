import { User } from '../../../auth/interfaces/user.interface';

export const marshallUser = (user: User) => {
  const { id, allianceId, name } = user;

  const toReturn = {
    ...marshallUserKey(id),
    GSI1PK: { S: 'USER' },
    GSI1SK: { S: `NAME#${name}` },
    id: { S: id },
    name: { S: name },
  };

  if (allianceId !== undefined) {
    toReturn['allianceId'] = { S: allianceId };
    toReturn['GSI2PK'] = { S: `ALLIANCE#${allianceId}` };
    toReturn['GSI2SK'] = { S: `USERNAME#${name}` };
  }

  return toReturn;
};

export const marshallUserKey = (id: string) => {
  return {
    PK: { S: `USER` },
    SK: { S: `USER#${id}` },
  };
};
