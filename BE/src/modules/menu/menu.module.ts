import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToppingsModule } from '../toppings/toppings.module';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }]),
    ToppingsModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
