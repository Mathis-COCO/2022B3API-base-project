import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @MinLength(8)
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['Employee','Admin','ProjectManager'])
  role: 'Employee' | 'Admin' | 'ProjectManager'
}

// export class UserInfosDto {
//   @IsString()
//   username: string;
//   @IsEmail()
//   email: string;
//   role: 'Employee' | 'Admin' | 'ProjectManager' // valeur par defaut : 'Employee'
// }

export class LoginDto {
  @MinLength(8)
  @IsEmail()
  email: string;
  @IsString()
  password!: string;
}
