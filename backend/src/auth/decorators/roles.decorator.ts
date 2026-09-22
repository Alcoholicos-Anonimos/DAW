
import { SetMetadata } from '@nestjs/common';
import { RolesUsuarios } from '../../common/enums/roles-usuarios.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesUsuarios[]) => SetMetadata(ROLES_KEY, roles);