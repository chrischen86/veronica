import { User } from '../../auth/interfaces/user.interface';

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findOneById(userId: string): Promise<User>;
  abstract create(conquest: User): Promise<User>;
  //abstract delete(conquestId: string);
  abstract findAllByAllianceId(allianceId: string): Promise<User[]>;
  abstract joinAlliance(user: User);
}
