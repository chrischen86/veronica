import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../auth/interfaces/user.interface';
import configuration from '../../config/configuration';
import { DynamoDbService } from './dynamodb.service';
import { UserRepositoryDynamoDbAdapter } from './user-repository-dynamodb.adapter';
import { v4 as uuidv4 } from 'uuid';
import { AllianceRepositoryDynamoDbAdapter } from './alliance-repository-dynamodb.adapter';
import { Alliance } from '../../alliance/interfaces/alliance.interface';

xdescribe('AllianceRepositoryDynamoDbAdapter', () => {
  let service: AllianceRepositoryDynamoDbAdapter;
  let userService: UserRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        AllianceRepositoryDynamoDbAdapter,
        UserRepositoryDynamoDbAdapter,
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<AllianceRepositoryDynamoDbAdapter>(
      AllianceRepositoryDynamoDbAdapter,
    );
    userService = module.get<UserRepositoryDynamoDbAdapter>(
      UserRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create alliance', async () => {
    const alliance: Alliance = {
      id: 'da0276a6-e30d-4b71-ad09-55a3145644f0',
      name: 'Alpha Flight',
      ownerId: 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0',
      ownerName: 'Vindicator',
    };
    const results = await service.create(alliance);
    expect(results).toBeDefined();
  });

  it('should query by id', async () => {
    const id = 'da0276a6-e30d-4b71-ad09-55a3145644f0';
    const alliance: Alliance = {
      id,
      name: 'Alpha Flight',
      ownerId: 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0',
      ownerName: 'Vindicator',
    };
    await service.create(alliance);
    const actual = await service.findOneById(id);
    expect(actual).toBeDefined();
    expect(actual.id).toEqual(id);
  });

  it('should query all', async () => {
    const id = 'da0276a6-e30d-4b71-ad09-55a3145644f0';
    const alliance: Alliance = {
      id,
      name: 'Alpha Flight',
      ownerId: 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0',
      ownerName: 'Vindicator',
    };
    await service.create(alliance);

    const id2 = 'b8baddd6-ec85-4587-b938-14dc6e047606';
    const alliance2: Alliance = {
      id: id2,
      name: 'X-Men',
      ownerId: 'bd868e28-3224-47c3-9861-bc25855b2b98',
      ownerName: 'Charles Xavier',
    };
    await service.create(alliance2);

    const alliances = await service.findAll();
    expect(alliances).toBeDefined();
    expect(alliances.length).toBeGreaterThanOrEqual(2);
    expect(alliances.find((a) => a.id === id)).toBeDefined();
    expect(alliances.find((a) => a.id === id2)).toBeDefined();
  });

  it('should find all alliances starting with', async () => {
    const id = 'da0276a6-e30d-4b71-ad09-55a3145644f0';
    const alliance: Alliance = {
      id,
      name: 'Alpha Flight',
      ownerId: 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0',
      ownerName: 'Vindicator',
    };
    await service.create(alliance);

    const id2 = 'b8baddd6-ec85-4587-b938-14dc6e047606';
    const alliance2: Alliance = {
      id: id2,
      name: 'X-Men',
      ownerId: 'bd868e28-3224-47c3-9861-bc25855b2b98',
      ownerName: 'Charles Xavier',
    };
    await service.create(alliance2);

    const id3 = '56144dfc-a6ba-4129-a575-70bf51aa9a46';
    const alliance3: Alliance = {
      id: id3,
      name: 'Alpha Omega',
      ownerId: '0aeab736-354a-40b6-9f78-ca6e40dfb22e',
      ownerName: 'Delta Gamma',
    };
    await service.create(alliance3);

    const alliances = await service.findAllByName('Alpha');
    expect(alliances).toBeDefined();
    expect(alliances.length).toBeGreaterThanOrEqual(2);
    expect(alliances.find((a) => a.id === id)).toBeDefined();
    expect(alliances.find((a) => a.id === id3)).toBeDefined();
  });

  it('should query by id and return with members', async () => {
    const id = 'da0276a6-e30d-4b71-ad09-55a3145644f0';
    const alliance: Alliance = {
      id,
      name: 'Alpha Flight',
      ownerId: 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0',
      ownerName: 'Vindicator',
    };
    await service.create(alliance);

    const userId = 'c32f79bc-2156-40c3-a537-7cfa73a5d2b0';
    const user: User = {
      id: userId,
      name: 'Vindicator',
      allianceId: id,
    };
    await userService.create(user);
    const actual = await service.findOneByIdIncludeMembers(id);
    expect(actual).toBeDefined();
    expect(actual.id).toEqual(id);
  });
});
