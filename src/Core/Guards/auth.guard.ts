import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IUserRepository } from '../RepositoriesInterface/IUserRepository.interface';
import { ApiResponse } from '../../Helpers/CustomObjects/ApiResponse.interface';
import { ConstantsMessages } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const unauthorizedResponse = new ApiResponse();
    unauthorizedResponse.success = false;
    unauthorizedResponse.message = ConstantsMessages.ErrorUserNotLogged;
    unauthorizedResponse.number = 401;

    if (!token) {
      throw new UnauthorizedException(unauthorizedResponse);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('app.jwt.secret'),
      });

      const userId = payload.sub;
      const userResult = await this.userRepository.findByIdAsync(userId);

      if (userResult.isFailed || !userResult.value) {
        throw new UnauthorizedException(unauthorizedResponse);
      }

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(unauthorizedResponse);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
