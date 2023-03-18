//! Nest Modules
import { Module } from '@nestjs/common';
//! Own Modules
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { AuthModule } from '../auth/auth.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    IngredientsModule,
    UserModule
  ],
})
export class SeedModule {}
