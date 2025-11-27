import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenService.findOne(id);
  }

  @Patch('reduce/:id')
  reduce(@Param('id') id: string) {
    return this.tokenService.reduce(id);
  }
}
