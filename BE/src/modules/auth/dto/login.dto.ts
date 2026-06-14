import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /** Email (owner) hoặc username (nhân viên) */
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @MinLength(6)
  password: string;

  /** Bắt buộc khi đăng nhập bằng username nhân viên */
  @IsOptional()
  @IsString()
  storeSlug?: string;
}
