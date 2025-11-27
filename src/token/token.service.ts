import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiToken } from './entities/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(ApiToken)
    private readonly tokenRepository: Repository<ApiToken>,
  ) {}

  async create(createTokenDto: CreateTokenDto): Promise<ApiToken> {
    const existingToken = await this.tokenRepository.findOne({
      where: { token: createTokenDto.token },
    });

    if (existingToken) {
      throw new BadRequestException('El token ya existe');
    }

    const newToken = this.tokenRepository.create({
      token: createTokenDto.token,
      active: true,
      reqLeft: 10,
    });

    return await this.tokenRepository.save(newToken);
  }

  async findOne(id: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({ where: { id } });

    if (!token) {
      throw new NotFoundException(`Token con id ${id} no encontrado`);
    }

    return token.active && token.reqLeft > 0;
  }

  async reduce(id: string): Promise<ApiToken> {
    const token = await this.tokenRepository.findOne({ where: { id } });

    if (!token) {
      throw new NotFoundException(`Token con id ${id} no encontrado`);
    }

    if (token.reqLeft > 0) {
      token.reqLeft -= 1;
    }

    if (token.reqLeft === 0) {
      token.active = false;
    }

    return await this.tokenRepository.save(token);
  }

  async validateToken(id: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({ where: { id } });

    if (!token) {
      return false;
    }

    return token.active && token.reqLeft > 0;
  }
}
