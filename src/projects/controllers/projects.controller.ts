import { BadRequestException, Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Project } from "../entity/project.entity";
import { ProjectService } from "../services/project.service";
import { UserService } from "../../users/services/user.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../users/entity/user.enum";
import { CreateProjectDto } from "../dto/projects.dto";
import { User } from "../../users/entity/user.entity";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ProjectUsersService } from "../../project-users/services/project-user.service";

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectService, private readonly userService : UserService, /*private readonly projectUsersService: ProjectUsersService*/) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto, 
    @Req() user
    ): Promise<Project> {
      let { name, referringEmployeeId } = createProjectDto;
      let currentUser = await this.userService.findUser(user.user.email);
      let referringEmployee = await this.userService.findId(referringEmployeeId);

      // Vérifie si l'user est admin
      if (!currentUser || currentUser.role !== "Admin") {
        throw new UnauthorizedException();
      }
      // Vérifie si le référent est au moins un chef de projet
      if (!referringEmployee || referringEmployee.role === 'Employee') {
        throw new UnauthorizedException();
      }
      //  Crée le projet
      let project = await this.projectService.create({
        name,
        referringEmployeeId,
      });
  
      return project;
  }

  @Get()
  async findAll(@Req() req): Promise<Project[]> {
    let currentUser = await this.userService.findUser(req.user.email);
    // if (currentUser.role === "Employee") {
    //   let projects = [];
    //   for (/*project in projectService.getUserProjects */) {
    //     projects.push(/*le project actuel*/);
    //   }
    //   return projects;
    // } else {
    //   return await this.projectService.findAll()
    // }

    if (currentUser.role === "Employee") {
      // retourner tous les projets de l'utilisateur
    } else {
      return this.projectService.findAll();
    }
  }

  @Get(':id')
  @Roles(Role.Admin, Role.ProjectManager, Role.Employee)
  async getProjectById(
    @Param('id') id: string, 
    @Req() user: User
    ): Promise<Project> {
    const currentUserId = user.id;
    return this.projectService.getProjectById2(id, currentUserId);
    // const project = await this.projectService.getProjectById(id);
    // if (user.role === 'Employee' && !this.projectService.getProjectById(user.id)) {
    //   throw new ForbiddenException();
    // }
    // return project;
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
