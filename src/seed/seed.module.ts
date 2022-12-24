import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [IngredientsModule],
})
export class SeedModule {}
