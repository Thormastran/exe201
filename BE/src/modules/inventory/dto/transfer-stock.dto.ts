import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TransferStockLineDto {
  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber()
  @Min(0.001)
  quantity: number;
}

export class TransferStockDto {
  @IsString()
  @IsNotEmpty()
  fromWarehouseId: string;

  @IsString()
  @IsNotEmpty()
  toWarehouseId: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferStockLineDto)
  lines: TransferStockLineDto[];
}
