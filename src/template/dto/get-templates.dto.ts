import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GetTemplatesDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  offset: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(30)
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  name: string;
}
