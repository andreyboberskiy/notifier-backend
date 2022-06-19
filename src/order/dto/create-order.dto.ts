import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { CheckIntervalUnitsEnum } from 'order/types/checkIntervalUnitsEnum';
import { IntervalByUnits } from 'order/validation/interval-by-units';

export class CreateOrderDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsInt()
  templateId: number;

  @ApiProperty()
  @IsInt()
  @Validate(IntervalByUnits)
  checkInterval: number;

  @ApiProperty({ enum: CheckIntervalUnitsEnum })
  @IsEnum(CheckIntervalUnitsEnum)
  checkIntervalUnit: CheckIntervalUnitsEnum;

  @ApiProperty({ minimum: 4, maximum: 100 })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @ApiProperty({ minimum: 4, maximum: 200, required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  notifyPhrase: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  withoutActivating: boolean;
}
