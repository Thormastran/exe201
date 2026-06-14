import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { ToppingsService } from './toppings.service';

@Controller('toppings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.toppingsService.findAll(activeOnly === 'true');
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateToppingDto) {
    return this.toppingsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateToppingDto) {
    return this.toppingsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.toppingsService.remove(id);
  }
}
