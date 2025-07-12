import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({
    example: 'dark',
    description: 'User theme preference',
    enum: ['light', 'dark'],
  })
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark' = 'light';

  @ApiPropertyOptional({
    example: true,
    description: 'Enable in-app notifications'
  })
  @IsOptional()
  @IsBoolean()
  notifications?: boolean = true;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable email notifications',
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    example: 'America/New_York',
    description: 'User timezone',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    example: 'en',
    description: 'Preferred language (ISO 639-1)',
  })
  @IsOptional()
  @IsString()
  @ValidateIf(o => o.language && o.language.length === 2)
  language?: string;

}
