import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Exclude } from 'class-transformer';
import { Stats } from '../../stats/interfaces/stats.interface';

@Exclude()
export class StatsEntity extends Stats {
  constructor(item: { [key: string]: AttributeValue }) {
    super();
    this.parse(item);
  }

  parse(item: { [key: string]: AttributeValue }) {
    const data = unmarshall(item);
    const {
      id,
      ownerId,
      ownerName,
      allianceId,
      allianceName,
      attackDate,
      attacks,
    } = data;

    this.id = id;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.allianceId = allianceId;
    this.allianceName = allianceName;
    this.attackDate = attackDate;
    this.attacks = attacks;
  }
}
