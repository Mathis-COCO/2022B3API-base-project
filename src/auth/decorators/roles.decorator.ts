import { SetMetadata } from "@nestjs/common";
import { Role } from "../../users/entity/user.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)
