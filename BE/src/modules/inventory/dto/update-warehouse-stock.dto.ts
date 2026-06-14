import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWarehouseStockDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;
}
