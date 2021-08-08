import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Conquest } from '../../conquest/interfaces/conquest.interface';

export class ConquestEntity extends Conquest {
  constructor(item: { [key: string]: AttributeValue }) {
    super();
    this.parse(item);
  }

  parse(item: { [key: string]: AttributeValue }) {
    const data = unmarshall(item);
    const { id, allianceId, startDate, endDate } = data;
    console.log(item);

    this.id = id;
    this.allianceId = allianceId;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
