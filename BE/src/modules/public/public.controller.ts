import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { PublicService } from './public.service';

@Controller('public')
@Public()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('plans')
  getPlans() {
    return this.publicService.getPlans();
  }

  @Post('register')
  register(@Body() dto: RegisterTenantDto) {
    return this.publicService.register(dto);
  }
}
