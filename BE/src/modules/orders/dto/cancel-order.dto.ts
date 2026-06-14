import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Lý do hủy phải có ít nhất 3 ký tự' })
  cancelReason: string;
}
