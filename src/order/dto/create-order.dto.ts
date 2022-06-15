import {
  IsArray,
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
  @IsUrl()
  url: string;

  @IsInt()
  templateId: number;

  @IsInt()
  @Validate(IntervalByUnits)
  checkInterval;

  @IsEnum(CheckIntervalUnitsEnum)
  checkIntervalUnit: CheckIntervalUnitsEnum;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  notifyPhrase: string;

  @IsOptional()
  @IsBoolean()
  withoutActivating: boolean;
}
