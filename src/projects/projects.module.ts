
import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ProjectsController } from './controllers/projects.controller';
import { UserService } from '../users/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Project } from './entity/project.entity';
import { ProjectUser } from '../project-users/project-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, ProjectUser]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService, UserService],
  exports: [ProjectService, UserService],
})
export class ProjectsModule {}
