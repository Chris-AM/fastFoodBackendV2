import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { seededIngredients, seededUsers } from './mocks/';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { UserService } from 'src/user/user.service';
@Injectable()
export class SeedService {

  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public async runSeed() {
    await this.deleteTables();
    //? injecting dev user
    const userToInsert = await this.insertUsers();
    await this.seedIngredients(userToInsert);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.ingredientsService.deleteAllIngredients();
    await this.userService.deleteAllUsers();
    const queryBuilder = this.userRepo.createQueryBuilder();
    await queryBuilder
      .delete()
      //!Be careful!
      .where({})
      .execute();
  }

  private async insertUsers() {
    const users: User[] = [];
    const seedUsers = seededUsers;
    seedUsers.forEach((user) => {
      users.push(this.userRepo.create(user));
    });
    const dbUsers = await this.userRepo.save(seedUsers);
    return dbUsers[1];
  }

  private async seedIngredients(user: User) {
    await this.ingredientsService.deleteAllIngredients();
    const ingredientsToSeed = seededIngredients;
    const insertPromises = [];
    ingredientsToSeed.forEach((ingredient) => {
      insertPromises.push(this.ingredientsService.create(ingredient, user));
    });
    await Promise.all(insertPromises);
    return true;
  }
}
