/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entity/project.entity';
import { ProjectUsersModule } from './project-users/project-user.module';
import { ProjectUser } from './project-users/project-user.entity';
import { EventsModule } from './events/events.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectsModule,
    ProjectUsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
