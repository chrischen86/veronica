import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { User } from '../../auth/interfaces/user.interface';

export class UserEntity extends User {
  constructor(item: { [key: string]: AttributeValue }) {
    super();
    this.parse(item);
  }

  parse(item: { [key: string]: AttributeValue }) {
    const data = unmarshall(item);
    const { id, name, allianceId, allianceName } = data;

    this.id = id;
    this.name = name;
    this.allianceId = allianceId;
    this.allianceName = allianceName;
  }
}
