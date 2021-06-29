import { GetAllianceHandler } from './get-alliance.handler';
import { GetAllianceWithMembersHandler } from './get-alliance-with-members.handler';
import { ListAlliancesHandler } from './list-alliances.handler';

export const QueryHandlers = [
  GetAllianceHandler,
  GetAllianceWithMembersHandler,
  ListAlliancesHandler,
];
