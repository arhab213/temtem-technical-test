import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { SeederModule } from './packages/common/seeder/seeder.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserController } from './user/controller/user.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './products/product.module';
import { ProductController } from './products/controller/product.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),

    UserModule,
    RoleModule,
    AuthModule,
    SeederModule,
    ProductModule,
  ],
  controllers: [UserController, AuthController, ProductController],
})
export class AppModule {}
