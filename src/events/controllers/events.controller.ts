import { BadRequestException, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserService } from "../../users/services/user.service";
import { ProjectUsersService } from "../../project-users/services/project-user.service";
import { ProjectService } from "../../projects/services/project.service";
import { EventsService } from "../services/events.service";
import { CreateEventDto } from "../dto/event.dto";
import { Body } from "@nestjs/common/decorators";

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly userService: UserService
    ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getEvents(@Req() req) {
    return this.eventService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Req() req) {
    const userId = await this.userService.findUser(req.user.email);
    
    // const existingEvent = await this.eventService.findByDateAndUserId(createEventDto.date, userId.id);
    // if (existingEvent) {
    //   throw new BadRequestException();
    // }

    // const remoteWorkCount = await this.eventService.countRemoteWorkByUserId(userId.id);
    // if (createEventDto.eventType === 'RemoteWork' && remoteWorkCount >= 2) {
    //   throw new BadRequestException();
    // }

    const event = await this.eventService.create(createEventDto, userId.id);
    // if (createEventDto.eventType === 'PaidLeave') {
    //   event.eventStatus = 'Pending';
    //   await this.eventService.update(event);
    // }
    return event;
  }
}
