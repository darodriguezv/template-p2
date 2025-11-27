import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { TokenGuard } from '../guards/token.guard';

@Controller('character')
@UseGuards(TokenGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(createCharacterDto);
  }

  @Patch(':id/favorites/:locationId')
  addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return this.characterService.addFavorite(id, locationId);
  }

  @Get(':id/taxes')
  calculateTaxes(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.calculateTaxes(id);
  }
}
