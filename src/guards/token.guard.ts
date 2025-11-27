import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenId = request.headers['x-token-id'];

    if (!tokenId) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const isValid = await this.tokenService.validateToken(tokenId);

    if (!isValid) {
      throw new UnauthorizedException('Token inválido o sin peticiones restantes');
    }

    // Reducir las peticiones restantes del token
    await this.tokenService.reduce(tokenId);

    return true;
  }
}
