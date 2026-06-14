import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { TenantsModule } from '../tenants/tenants.module';

import { User, UserSchema } from './schemas/user.schema';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';



@Module({

  imports: [

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    SubscriptionsModule,

    TenantsModule,

  ],

  controllers: [UsersController],

  providers: [UsersService],

  exports: [UsersService],

})

export class UsersModule {}


