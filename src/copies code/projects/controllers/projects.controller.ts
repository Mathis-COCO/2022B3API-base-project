import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Project } from "../entity/project.entity";
import { ProjectService } from "../services/project.service";
import { UserService } from "../../users/services/user.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../users/entity/user.enum";
import { CreateProjectDto } from "../dto/projects.dto";
import { User } from "../../users/entity/user.entity";
import { RolesGuard } from "../../auth/guards/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectService, private readonly userService : UserService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto, 
    @Req() user: User
    ): Promise<Project> {
      const { name, referringEmployeeId } = createProjectDto;

      // Vérifie si l'utilisateur est administrateur ou chef de projet
      if (!user || (user.role !== 'Admin' && user.role !== 'ProjectManager')) {
        throw new UnauthorizedException();
      }

      // Vérifie si la personne référente est au minimum un chef de projet
      const referringEmployee = await this.userService.findId(referringEmployeeId);
      if (!referringEmployee || referringEmployee.role !== 'ProjectManager') {
        throw new UnauthorizedException();
      }
  
      if (!name || name.length < 3) {
        throw new BadRequestException('Invalid project name');
      }
  
      const project = await this.projectService.create({
        name,
        referringEmployeeId,
      });
  
      return project;
  }

  @Roles(Role.Admin, Role.ProjectManager)
  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.ProjectManager, Role.Employee)
  async getProjectById(@Param('id') id: string, @Req() req): Promise<Project> {
    const currentUserId = req.user.userId;
    return this.projectService.getProjectById(id, currentUserId);
  }
}
  // async findAll(@Req() req) {
    // if (this.userService.findUser(req.user.username)) {
    //   if (req.user.role == 'Admin' || req.user.role == 'Manager') {
    //     return this.projectService.findAll()
    //   }
    //   if (req.user.role == 'Employee') {
    //     return this.projectService.findUserProjects(req.user.username)
    //   }
    // }
  // }
// }
