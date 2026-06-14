import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RecipeLineDto {
  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}
