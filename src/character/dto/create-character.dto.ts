import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @IsBoolean()
  @IsNotEmpty()
  employee: boolean;
}
