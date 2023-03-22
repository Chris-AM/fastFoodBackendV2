//!Nest Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
//!Node Modules
import { join } from 'path';
//!Own Modules
import { IngredientsModule } from './ingredients/ingredients.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    //* global env config
    ConfigModule.forRoot(),
    //* BD Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: Boolean(process.env.DB_SYNCHRO),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    IngredientsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    UserModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
