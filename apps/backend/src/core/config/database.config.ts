import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_NAME', 'eisenhower_matrix_db'),
      entities: [],
      synchronize: this.configService.get('NODE_ENV') !== 'production',
      logging: this.configService.get('NODE_ENV') === 'development',
      migrations: ['dist/database/migrations/*{.ts, .js}'],
      migrationsRun: true,
      ssl: this.configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    }
  }
}
