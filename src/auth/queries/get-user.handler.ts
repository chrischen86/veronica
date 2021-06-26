import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../dal/repository/user.repository';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetUserQuery) {
    const { userId } = query;
    return this.repository.findOneById(userId);
  }
}
