import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { User } from '../../users/entity/user.entity';
import { CreateProjectDto } from '../dto/projects.dto';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, referringEmployeeId } = createProjectDto;

    const referringEmployee = await this.userService.findId(referringEmployeeId);
    if (!referringEmployee) {
      throw new UnauthorizedException('Invalid referring employee');
    }

    const project = new Project();
    project.name = name;
    project.referringEmployee = referringEmployee;

    return this.projectsRepository.save(project);
  }

  createProject(project: Project): Promise<Project> {
    const newProject = this.projectsRepository.create(project);
    return this.projectsRepository.save(newProject);
  }

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find()
  }

  // findUserProjects(referringEmployee: string): Promise<Project[]> {
  //   return this.projectsRepository.find({ where: { referringEmployeeId: referringEmployee } });
  // }

  findId(id: string): Promise<Project> {
    return this.projectsRepository.findOne({ where: { id: id } });
  }

  async getProjectById(id: string, currentUserId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id: id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.referringEmployee.id !== currentUserId) {
      throw new ForbiddenException('You are not allowed to access this project');
    }

    return project;
  }
}
