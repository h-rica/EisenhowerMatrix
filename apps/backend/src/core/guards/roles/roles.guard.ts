import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../../enums/user-role.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private roleHierarchy = {
    admin: [UserRole.ADMIN, UserRole.USER],
    user: [UserRole.USER],
    guest: [UserRole.GUEST],
  }
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Capture which role is required
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('role', [
      context.getHandler(),
    ]);

    if(!requiredRoles) {
      throw new ForbiddenException('No roles defined');
    }

    // Check if the current user has those roles
    const request = context.switchToHttp().getRequest();
    return requiredRoles.some(role => this.roleHierarchy[request.user.role].includes(role));
  }
}
