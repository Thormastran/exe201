import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { Topping, ToppingDocument } from './schemas/topping.schema';

const DEFAULT_TOPPINGS: CreateToppingDto[] = [
  { name: 'Trân châu đen', price: 5000, sortOrder: 1 },
  { name: 'Trân châu trắng', price: 5000, sortOrder: 2 },
  { name: 'Thạch dừa', price: 5000, sortOrder: 3 },
  { name: 'Pudding trứng', price: 7000, sortOrder: 4 },
  { name: 'Kem cheese', price: 10000, sortOrder: 5 },
  { name: 'Đậu đỏ', price: 5000, sortOrder: 6 },
];

@Injectable()
export class ToppingsService implements OnModuleInit {
  constructor(
    @InjectModel(Topping.name)
    private readonly toppingModel: Model<ToppingDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.toppingModel.countDocuments().exec();
    if (count === 0) {
      await this.toppingModel.insertMany(DEFAULT_TOPPINGS);
    }
  }

  async findAll(activeOnly = false): Promise<ToppingDocument[]> {
    const filter = activeOnly ? { isActive: true } : {};
    return this.toppingModel.find(filter).sort({ sortOrder: 1, name: 1 }).exec();
  }

  async findByIds(ids: string[]): Promise<ToppingDocument[]> {
    if (!ids.length) return [];
    return this.toppingModel.find({ _id: { $in: ids }, isActive: true }).exec();
  }

  async create(dto: CreateToppingDto): Promise<ToppingDocument> {
    const doc = new this.toppingModel(dto);
    return doc.save();
  }

  async update(id: string, dto: UpdateToppingDto): Promise<ToppingDocument> {
    const doc = await this.toppingModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Không tìm thấy topping');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.toppingModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy topping');
  }
}
