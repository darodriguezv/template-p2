import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { Character } from '../character/entities/character.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { ownerId, ...locationData } = createLocationDto;

    // Verificar que el dueño existe
    const owner = await this.characterRepository.findOne({
      where: { id: ownerId },
      relations: ['property'],
    });

    if (!owner) {
      throw new NotFoundException(`El personaje con id ${ownerId} no existe`);
    }

    // Verificar que el dueño no tenga otra propiedad
    if (owner.property) {
      throw new BadRequestException(
        'El personaje ya posee otra propiedad',
      );
    }

    const location = this.locationRepository.create({
      ...locationData,
      owner,
    });

    return await this.locationRepository.save(location);
  }

  async findAllWithFavorites(): Promise<Location[]> {
    return await this.locationRepository.find({
      relations: ['favCharacters'],
    });
  }
}
