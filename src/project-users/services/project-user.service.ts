import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, MoreThanOrEqual, LessThan, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectUser } from '../project-user.entity';
import { ConflictException } from '@nestjs/common';
import { User } from '../../users/entity/user.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUsersRepository: Repository<ProjectUser>,
  ) {}

  findAll(): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find();
  }

  findById(id: string): Promise<ProjectUser> {
    return this.projectUsersRepository.findOneBy({ id });
  }

  findByUserId(user: User): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where: { user } });
  }

  async checkAvailability(userId: string, startDate: Date, endDate: Date) {
    // const count = await this.projectUsersRepository.count({
    //   where: {
    //     userId,
    //     startDate: MoreThanOrEqual(startDate),
    //     endDate: LessThan(endDate),
    //   },
    // });
    // if (count === 0){return true} else {return false};
    const existingAssignment = await this.projectUsersRepository.findOne({
      where: [
        { userId: userId },
        {
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate)
        }
      ]
    });
    
    if (existingAssignment) {
      return true
    } else {  
      return false
    }
  }

  create(startDate: Date, endDate: Date, userId: string, projectId: string): Promise<ProjectUser> {
    const projectUser = new ProjectUser();
    projectUser.startDate = startDate;
    projectUser.endDate = endDate;
    projectUser.userId = userId;
    projectUser.projectId = projectId;
    return this.projectUsersRepository.save(projectUser);
  }
}
