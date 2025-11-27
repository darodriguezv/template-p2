import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { TokenGuard } from '../guards/token.guard';

@Controller('location')
@UseGuards(TokenGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationService.findAllWithFavorites();
  }
}
