import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isKitchenSource?: boolean;

  @IsOptional()
  @IsBoolean()
  isCentralWarehouse?: boolean;
}
