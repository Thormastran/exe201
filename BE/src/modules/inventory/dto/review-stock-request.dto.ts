import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ReviewStockRequestDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  accountingNote?: string;

  @IsOptional()
  @IsString()
  rejectReason?: string;
}
