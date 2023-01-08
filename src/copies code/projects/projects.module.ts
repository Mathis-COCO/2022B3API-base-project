
import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ProjectsController } from './controllers/projects.controller';
import { UserService } from '../users/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Project } from './entity/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User])
  ],
  controllers: [ProjectsController],
  providers: [ProjectService, UserService],
})
export class ProjectsModule {}
