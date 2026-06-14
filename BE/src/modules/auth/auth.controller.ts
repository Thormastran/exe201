import { Body, Controller, Get, Post } from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SkipSubscription } from '../../common/decorators/skip-subscription.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('session')
  @SkipSubscription()
  session(@CurrentUser() user: UserDocument) {
    return this.authService.getSessionContext(user);
  }
}


