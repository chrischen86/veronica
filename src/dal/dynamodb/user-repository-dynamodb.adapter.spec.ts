import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../auth/interfaces/user.interface';
import configuration from '../../config/configuration';
import { DynamoDbService } from './dynamodb.service';
import { UserRepositoryDynamoDbAdapter } from './user-repository-dynamodb.adapter';
import { v4 as uuidv4 } from 'uuid';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

xdescribe('UserRepositoryDynamoDbAdapter', () => {
  let service: UserRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, UserRepositoryDynamoDbAdapter],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<UserRepositoryDynamoDbAdapter>(
      UserRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one user without alliance', async () => {
    const user: User = {
      id: 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d',
      name: 'PulsarShock',
    };
    const results = await service.create(user);
    expect(results).toBeDefined();
  });

  it('should create one user with alliance', async () => {
    const user: User = {
      id: 'acc0c8d7-9bac-45e9-aa4e-ccb50cdbb590',
      allianceId: '152f58ed-6a79-44e1-b3a0-8046a291ea3b',
      name: 'Pulse',
    };
    const results = await service.create(user);
    expect(results).toBeDefined();
  });

  it('should query by id', async () => {
    const id = 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d';
    const user: User = {
      id,
      name: 'PulsarShock',
    };
    await service.create(user);
    const actualUser = await service.findOneById(id);
    expect(actualUser).toBeDefined();
    expect(actualUser.id).toEqual(id);
  });

  it('should query by alliance', async () => {
    const id = 'acc0c8d7-9bac-45e9-aa4e-ccb50cdbb590';
    const allianceId = '152f58ed-6a79-44e1-b3a0-8046a291ea3b';
    const user: User = {
      id,
      allianceId,
      name: 'Pulse',
    };
    await service.create(user);
    const users = await service.findAllByAllianceId(allianceId);
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users.find((u) => u.id === id)).toBeDefined();
  });

  it('should create user then join alliance', async () => {
    const id = uuidv4();
    const name = `Username${getRandomInt(9999)}`;
    const user: User = {
      id,
      name,
    };
    await service.create(user);

    const allianceId = uuidv4();
    //const allianceId = 'b6448b1a-df14-4bf3-bad7-e255e7266e7c';
    user.allianceId = allianceId;
    await service.joinAlliance(user);

    const results = await service.findAllByAllianceId(allianceId);
    const actualUser = results.find((u) => u.id === id);
    expect(actualUser).toBeDefined();
    expect(actualUser.allianceId).toEqual(allianceId);
  });

  it('should create user then updateProfile with new name and alliance', async () => {
    const id = uuidv4();
    const name = `Username${getRandomInt(9999)}`;
    const user: User = {
      id,
      name,
    };
    await service.create(user);

    const allianceId = uuidv4();
    //const allianceId = 'b6448b1a-df14-4bf3-bad7-e255e7266e7c';
    user.allianceId = allianceId;
    const updatedName = user.name + '-Updated';
    user.name = updatedName;
    await service.updateProfile(user);
    const actualUser = await service.findOneById(user.id);

    expect(actualUser).toBeDefined();
    expect(actualUser.allianceId).toEqual(allianceId);
    expect(actualUser.name).toEqual(updatedName);
  });
});
