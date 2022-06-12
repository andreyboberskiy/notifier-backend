import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class GetMyOrdersDto {
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
}
