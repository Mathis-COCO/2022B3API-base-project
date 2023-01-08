import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request, HttpException, HttpStatus, BadRequestException, NotFoundException  } from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth-guard';
import { CreateUserDto, LoginDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UserService,
    private authService: AuthService
    ) {}

  @Post('auth/sign-up')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('auth/login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string; }> {
    return this.authService.login(loginDto.email,loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return [req.user, req.email];
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    if (!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))) {
      throw new HttpException({status: HttpStatus.BAD_REQUEST,},HttpStatus.BAD_REQUEST,
      );
    }
    if (!(await this.userService.findId(id))) {
      throw new HttpException({status: HttpStatus.NOT_FOUND,}, HttpStatus.NOT_FOUND,);
    }
    return this.userService.findId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }
}
