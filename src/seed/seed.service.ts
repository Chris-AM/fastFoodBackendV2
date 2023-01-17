import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { seededData } from './mocks/ingredient.mock';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
@Injectable()
export class SeedService {

  constructor(
    private readonly ingredientsService: IngredientsService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public async runSeed() {
    await this.deleteTables();
    //? injecting dev user
    const userToInsert = await this.insertUsers();
    await this.seedIngredients(userToInsert);
    return 'SEED EXCECUTED';
  }

  private async deleteTables() {
    await this.ingredientsService.deleteAllIngredients();
    const queryBuilder = this.userRepo.createQueryBuilder();
    await queryBuilder
      .delete()
      //!Be careful!
      .where({})
      .execute();
  }

  private async insertUsers() {
    const users: User[] = [];
    const seedUsers = seededData.users;
    seedUsers.forEach((user) => {
      users.push(this.userRepo.create(user));
    });
    const dbUsers = await this.userRepo.save(seedUsers);
    return dbUsers[1];
  }

  private async seedIngredients(user: User) {
    await this.ingredientsService.deleteAllIngredients();
    const ingredientsToSeed = seededData.ingredients;
    const insertPromises = [];
    ingredientsToSeed.forEach((ingredient) => {
      insertPromises.push(this.ingredientsService.create(ingredient, user));
    });
    await Promise.all(insertPromises);
    return true;
  }
}
