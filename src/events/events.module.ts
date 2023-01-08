import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectUser } from "../project-users/project-user.entity";
import { ProjectUsersService } from "../project-users/services/project-user.service";
import { Project } from "../projects/entity/project.entity";
import { ProjectService } from "../projects/services/project.service";
import { User } from "../users/entity/user.entity";
import { UserService } from "../users/services/user.service";
import { UsersModule } from "../users/users.module";
import { EventsController } from "./controllers/events.controller"; 
import { EventsService } from "./services/events.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Project, User, ProjectUser]),
  ],
  controllers: [EventsController],
  providers: [EventsService, ProjectUsersService, ProjectService, UserService],
  exports: [EventsService, ProjectUsersService, ProjectService, UserService],
})
export class EventsModule {}
