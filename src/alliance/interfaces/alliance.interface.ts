import { Exclude, Expose } from 'class-transformer';
import { User } from '../../auth/interfaces/user.interface';

export class Alliance {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  members?: User[];

  @Expose()
  ownerId: string;

  @Expose()
  ownerName: string;
}
