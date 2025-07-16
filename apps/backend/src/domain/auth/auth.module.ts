import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from '../../core/guards/roles.guard';

@Module({
  imports: [UsersModule, JwtModule.registerAsync({
    global: false,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('jwtSecret'),
      signOptions: { expiresIn: configService.getOrThrow<string>('jwtExpiresIn')}
    })
  })],
  controllers: [],
  providers: [RolesGuard],
  exports: []
})
export class AuthModule {}
