import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ToppingOption {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const ToppingOptionSchema = SchemaFactory.createForClass(ToppingOption);

export const DEFAULT_TOPPINGS: ToppingOption[] = [
  { name: 'Trân châu đen', price: 5000 },
  { name: 'Trân châu trắng', price: 5000 },
  { name: 'Thạch dừa', price: 5000 },
  { name: 'Pudding trứng', price: 7000 },
  { name: 'Kem cheese', price: 10000 },
  { name: 'Đậu đỏ', price: 5000 },
];
