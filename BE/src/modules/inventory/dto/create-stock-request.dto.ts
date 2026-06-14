import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockRequestType } from '../../../common/enums/stock-request-type.enum';

export class StockRequestLineDto {
  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber()
  @Min(0.001)
  quantity: number;
}

export class CreateStockRequestDto {
  @IsEnum(StockRequestType)
  type: StockRequestType;

  @IsString()
  @IsNotEmpty()
  targetWarehouseId: string;

  @IsString()
  @IsNotEmpty()
  permitDocumentNumber: string;

  @IsDateString()
  permitDocumentDate: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockRequestLineDto)
  lines: StockRequestLineDto[];

  /** Bắt buộc khi type = RETURN_TO_CENTRAL — phiếu cấp phát trong ngày */
  @IsOptional()
  @IsString()
  parentRequestId?: string;

  /** Ngày nghiệp vụ (mặc định = ngày chứng từ) */
  @IsOptional()
  @IsDateString()
  businessDate?: string;
}
