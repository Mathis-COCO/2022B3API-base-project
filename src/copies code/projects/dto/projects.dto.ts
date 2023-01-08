import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsUUID()
  referringEmployeeId!: string;
}
