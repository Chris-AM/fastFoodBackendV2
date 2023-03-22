import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsInProductsService } from './ingredients-in-products.service';

describe('IngredientsInProductsService', () => {
  let service: IngredientsInProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientsInProductsService],
    }).compile();

    service = module.get<IngredientsInProductsService>(IngredientsInProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
