import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomBytes, randomInt } from 'crypto';

const configService = {
  get: jest.fn().mockReturnValue(randomBytes(randomInt(512)).toString()),
};

const randomStrings = [
  randomBytes(0).toString(),
  randomBytes(1).toString(),
  randomBytes(2).toString(),
  randomBytes(4).toString(),
  randomBytes(8).toString(),
  randomBytes(16).toString(),
  randomBytes(32).toString(),
  randomBytes(64).toString(),
  randomBytes(128).toString(),
  randomBytes(256).toString(),
  randomBytes(512).toString(),
];

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return length hash to be 96', async () => {
    for (const randomString of randomStrings) {
      const hashString = await service.hash(randomString);
      expect(hashString.length).toBe(96);
    }
  });
});
