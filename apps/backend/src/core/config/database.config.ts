import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Task } from '../../domain/tasks/entities/task.entity';
import { Category } from '../../domain/categories/entities/category.entity';
import { User } from '../../domain/users/entities/user.entity';

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
      entities: [User, Task, Category, Notification],
      autoLoadEntities: true,
      synchronize: this.configService.get('NODE_ENV') !== 'production',
      logging: this.configService.get('NODE_ENV') === 'development',
      migrations: ['dist/database/migrations/*{.ts, .js}'],
      migrationsRun: true,
      ssl: this.configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    }
  }
}
