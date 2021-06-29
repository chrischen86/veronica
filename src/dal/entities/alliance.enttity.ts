import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Alliance } from '../../alliance/interfaces/alliance.interface';

export class AllianceEntity extends Alliance {
  another: string;
  constructor(item: { [key: string]: AttributeValue }) {
    super();
    this.parse(item);
  }

  parse(item: { [key: string]: AttributeValue }) {
    const data = unmarshall(item);
    const { id, name, ownerId, ownerName } = data;

    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.members = [];

    this.another = 'whyy';
  }
}
