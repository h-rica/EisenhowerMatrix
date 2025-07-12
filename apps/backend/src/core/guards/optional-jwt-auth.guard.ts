import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt'){
  handleRequest(err: any, user: any, info: any, context: any) {
    // Allow request to continue event if not token is provided
    return user;
  }
}
