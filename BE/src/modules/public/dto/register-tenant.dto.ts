import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BusinessModel } from '../../../common/enums/business-model.enum';

export class RegisterTenantDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsEnum(BusinessModel)
  businessModel: BusinessModel;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
