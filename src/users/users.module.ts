import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entity/user.entity';
import { UserService } from './services/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, AuthService, JwtService, LocalStrategy, JwtStrategy],
  exports: [UserService, AuthService, JwtService, LocalStrategy, JwtStrategy]
})
export class UsersModule {}
