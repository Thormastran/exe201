import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeLineDto } from './recipe-line.dto';

export class UpsertRecipeDto {
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeLineDto)
  lines: RecipeLineDto[];
}
