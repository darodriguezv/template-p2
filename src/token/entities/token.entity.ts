import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('api_token')
export class ApiToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'int', default: 10, name: 'req_left' })
  reqLeft: number;
}
