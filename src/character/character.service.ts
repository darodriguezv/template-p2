import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepository.create(createCharacterDto);
    return await this.characterRepository.save(character);
  }

  async addFavorite(
    characterId: number,
    locationId: number,
  ): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId },
      relations: ['favPlaces'],
    });

    if (!character) {
      throw new NotFoundException(
        `El personaje con id ${characterId} no existe`,
      );
    }

    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(
        `La locación con id ${locationId} no existe`,
      );
    }

    // Verificar si ya existe en favoritos
    const alreadyFavorite = character.favPlaces.some(
      (loc) => loc.id === locationId,
    );

    if (alreadyFavorite) {
      throw new BadRequestException('La locación ya está en favoritos');
    }

    character.favPlaces.push(location);
    return await this.characterRepository.save(character);
  }

  async calculateTaxes(characterId: number): Promise<{ taxDebt: number }> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId },
      relations: ['property'],
    });

    if (!character) {
      throw new NotFoundException(
        `El personaje con id ${characterId} no existe`,
      );
    }

    // Si no tiene propiedad, retornar 0
    if (!character.property) {
      return { taxDebt: 0 };
    }

    // Calcular impuestos según la fórmula
    const coef = character.employee ? 0.08 : 0.03;
    const taxDebt = Number(character.property.cost) * (1 + coef);

    return { taxDebt: Math.round(taxDebt * 100) / 100 };
  }
}
