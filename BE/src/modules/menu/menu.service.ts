import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ToppingsService } from '../toppings/toppings.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import {
  DEFAULT_MENU_IMAGE,
  LEGACY_UNSPLASH_HOST,
  MENU_IMAGE_BY_NAME,
  imageUrlForMenuName,
} from './menu-images';

const DEFAULT_MENU: Omit<CreateMenuItemDto, 'toppingIds'>[] = [
  { name: 'Trà sữa trân châu đường đen', category: 'Trà sữa', price: 35000, description: 'Trà sữa đậm vị', imageUrl: MENU_IMAGE_BY_NAME['Trà sữa trân châu đường đen'] },
  { name: 'Trà sữa matcha', category: 'Trà sữa', price: 40000, imageUrl: MENU_IMAGE_BY_NAME['Trà sữa matcha'] },
  { name: 'Trà sữa oolong', category: 'Trà sữa', price: 32000, imageUrl: MENU_IMAGE_BY_NAME['Trà sữa oolong'] },
  { name: 'Trà sữa khoai môn', category: 'Trà sữa', price: 38000, imageUrl: MENU_IMAGE_BY_NAME['Trà sữa khoai môn'] },
  { name: 'Trà đào cam sả', category: 'Trà trái cây', price: 45000, imageUrl: MENU_IMAGE_BY_NAME['Trà đào cam sả'] },
  { name: 'Trà vải', category: 'Trà trái cây', price: 42000, imageUrl: MENU_IMAGE_BY_NAME['Trà vải'] },
  { name: 'Trà chanh leo', category: 'Trà trái cây', price: 40000, imageUrl: MENU_IMAGE_BY_NAME['Trà chanh leo'] },
  { name: 'Hồng trà kem cheese', category: 'Kem cheese', price: 48000, imageUrl: MENU_IMAGE_BY_NAME['Hồng trà kem cheese'] },
  { name: 'Trà xanh kem cheese', category: 'Kem cheese', price: 48000, imageUrl: MENU_IMAGE_BY_NAME['Trà xanh kem cheese'] },
  { name: 'Cacao sữa', category: 'Cacao', price: 36000, imageUrl: MENU_IMAGE_BY_NAME['Cacao sữa'] },
  { name: 'Cacao đá xay', category: 'Cacao', price: 42000, imageUrl: MENU_IMAGE_BY_NAME['Cacao đá xay'] },
  { name: 'Cà phê sữa đá', category: 'Cà phê', price: 30000, imageUrl: MENU_IMAGE_BY_NAME['Cà phê sữa đá'] },
];

const NO_TOPPING_CATEGORIES = ['Cà phê'];

export interface MenuItemResponse {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  toppingIds: string[];
  toppings: { name: string; price: number }[];
}

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(
    @InjectModel(MenuItem.name)
    private readonly menuModel: Model<MenuItemDocument>,
    private readonly toppingsService: ToppingsService,
  ) {}

  async onModuleInit() {
    const count = await this.menuModel.countDocuments().exec();
    if (count === 0) {
      const allToppings = await this.toppingsService.findAll();
      const toppingIds = allToppings.map((t) => t._id);

      await this.menuModel.insertMany(
        DEFAULT_MENU.map((item) => ({
          ...item,
          isAvailable: true,
          toppingIds: NO_TOPPING_CATEGORIES.includes(item.category) ? [] : toppingIds,
          toppings: [],
        })),
      );
    }
    await this.syncMenuImages();
  }

  /** Đồng bộ ảnh món mẫu — ghi đè URL cũ (Unsplash 404) */
  async syncMenuImages() {
    for (const [name, imageUrl] of Object.entries(MENU_IMAGE_BY_NAME)) {
      await this.menuModel
        .updateMany({ name }, { $set: { imageUrl } })
        .exec();
    }
    await this.menuModel
      .updateMany(
        { imageUrl: { $regex: LEGACY_UNSPLASH_HOST } },
        { $set: { imageUrl: DEFAULT_MENU_IMAGE } },
      )
      .exec();

    const docs = await this.menuModel.find().exec();
    for (const doc of docs) {
      const url = imageUrlForMenuName(doc.name);
      if (url && doc.imageUrl !== url) {
        doc.imageUrl = url;
        await doc.save();
      }
    }
  }

  private async resolveToppings(
    doc: MenuItemDocument,
  ): Promise<{ name: string; price: number }[]> {
    if (doc.toppingIds?.length) {
      const tops = await this.toppingsService.findByIds(
        doc.toppingIds.map((id) => id.toString()),
      );
      return tops.map((t) => ({ name: t.name, price: t.price }));
    }
    return doc.toppings ?? [];
  }

  private async toResponse(doc: MenuItemDocument): Promise<MenuItemResponse> {
    const toppings = await this.resolveToppings(doc);
    const json = doc.toJSON() as MenuItemResponse;
    return { ...json, toppings };
  }

  async findAll(forStaff = false): Promise<MenuItemResponse[]> {
    const filter = forStaff ? { isAvailable: true } : {};
    const docs = await this.menuModel
      .find(filter)
      .sort({ category: 1, name: 1 })
      .exec();
    return Promise.all(docs.map((d) => this.toResponse(d)));
  }

  async findById(id: string): Promise<MenuItemResponse> {
    const doc = await this.menuModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Không tìm thấy món');
    return this.toResponse(doc);
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItemResponse> {
    const doc = new this.menuModel({
      ...dto,
      toppingIds: (dto.toppingIds ?? []).map((id) => new Types.ObjectId(id)),
      toppings: [],
    });
    const saved = await doc.save();
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItemResponse> {
    const update: Record<string, unknown> = { ...dto };
    if (dto.toppingIds) {
      update.toppingIds = dto.toppingIds.map((tid) => new Types.ObjectId(tid));
    }

    const doc = await this.menuModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Không tìm thấy món');
    return this.toResponse(doc);
  }

  async remove(id: string): Promise<void> {
    const result = await this.menuModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy món');
  }
}
