import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Location } from '../../location/entities/location.entity';

@Entity('character')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'boolean' })
  employee: boolean;

  @OneToOne(() => Location, (location) => location.owner, { nullable: true })
  property: Location;

  @ManyToMany(() => Location, (location) => location.favCharacters)
  @JoinTable({
    name: 'favorites',
    joinColumn: { name: 'character_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'location_id', referencedColumnName: 'id' },
  })
  favPlaces: Location[];
}
