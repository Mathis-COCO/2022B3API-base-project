import { BadRequestException, Body, ClassSerializerInterceptor, ConflictException, Controller, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Project } from "../../projects/entity/project.entity";
import { UserService } from "../../users/services/user.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../users/entity/user.enum";
import { CreateProjectDto } from "../../projects/dto/projects.dto";
import { User } from "../../users/entity/user.entity";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ProjectUsersService } from "../../project-users/services/project-user.service";
import { ProjectUser } from "../project-user.entity";
import { ProjectService } from "../../projects/services/project.service";


@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectsService: ProjectService, private readonly usersService : UserService, private readonly projectUserService : ProjectUsersService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllProjectUsers(@Req() req): Promise<ProjectUser[]> {
    const user = req.user;
    if (user.role === 'employee') {
      return this.projectUserService.findByUserId(user.id);
    } else {
      return this.projectUserService.findAll();
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProjectUserById(@Param('id') id: string, @Req() req): Promise<ProjectUser> {
    const user = req.user;
    const projectUser = await this.projectUserService.findById(id);
    if (user.role === 'employee' && user.id !== projectUser.userId) {
      throw new UnauthorizedException();
    }
    return projectUser;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async assignUserToProject(@Body() body, @Req() req): Promise<ProjectUser> {    
    const { startDate, endDate, userId, projectId } = body;
    const user = req.user;
    let project = await this.projectsService.getProjectById(body.projectId);
    let referringEmployee = await this.usersService.findId(body.userId);

    if (user.role === "Employee") {
      throw new UnauthorizedException();
    }
    if (!project) {
      throw new NotFoundException();
    }

    if (!referringEmployee) {
      throw new NotFoundException();
    }
    // Vérifie si l'utilisateur est déjà affecté à un projet pour la période demandée
    if ((await this.projectUserService.checkAvailability(userId, startDate, endDate)) === true) {
      const projectUser = await this.projectUserService.create(startDate, endDate, userId, projectId);
      return projectUser;
    } else {
      throw new ConflictException();
    }
  }
}
