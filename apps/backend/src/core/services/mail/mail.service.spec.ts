import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      // Return mock values for SMTP settings
      const configs = {
        'SMTP_HOST': 'smtp.example.com',
        'SMTP_PORT': 587,
        'SMTP_USER': 'test@example.com',
        'SMTP_PASSWORD': 'password123',
        'SMTP_SECURE': 'false',
        'APP_URL': 'http://localhost:3000'
      };
      return configs[key] || defaultValue;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transporter with proper config', () => {
    expect(configService.get).toHaveBeenCalledWith('SMTP_HOST');
    expect(configService.get).toHaveBeenCalledWith('SMTP_PORT');
    expect(configService.get).toHaveBeenCalledWith('SMTP_SECURE');
    expect(configService.get).toHaveBeenCalledWith('SMTP_USER');
    expect(configService.get).toHaveBeenCalledWith('SMTP_PASSWORD');
  });
});
