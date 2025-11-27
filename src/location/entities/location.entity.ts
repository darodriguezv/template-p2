import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Character } from '../../character/entities/character.entity';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  cost: number;

  @OneToOne(() => Character, (character) => character.property, {
    nullable: true,
  })
  @JoinColumn({ name: 'owner_id' })
  owner: Character;

  @ManyToMany(() => Character, (character) => character.favPlaces)
  favCharacters: Character[];
}
