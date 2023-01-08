import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/entity/project.entity";
import { ProjectService } from "../projects/services/project.service";
import { User } from "../users/entity/user.entity";
import { UserService } from "../users/services/user.service";
import { ProjectUsersController } from "./controllers/project-users.controller";
import { ProjectUser } from "./project-user.entity";
import { ProjectUsersService } from "./services/project-user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser, Project, User]),
  ],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService, ProjectService, UserService],
  exports: [ProjectUsersService, ProjectService, UserService],
})
export class ProjectUsersModule {}
