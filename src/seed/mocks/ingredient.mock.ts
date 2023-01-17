import * as bcrypt from 'bcrypt';

//TODO!!!!: BREAK THE SEED!!!
interface SeedIngredient {
  name: string;
  type: ValidTypes[];
  description: string;
  inStock: boolean;
  images: string[];
  slug: string;
}

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
}

type ValidTypes =
  | 'Verduras/Frutas'
  | 'Base'
  | 'Condimentos'
  | 'Salsas'
  | 'Acompañamientos'
  | 'Carnes'
  | 'Lacteos/Quesos'
  | 'Panes';

interface SeedData {
  users: SeedUser[];
  ingredients: SeedIngredient[];
}

export const seededData: SeedData = {
  users: [
    {
      email: 'test@user.com',
      password: bcrypt.hashSync('userTest1', 10),
      fullName: 'Test User',
      roles: ['user'],
    },
    {
      email: 'test@dev.com',
      password: bcrypt.hashSync('devTest1', 10),
      fullName: 'Test Dev',
      roles: ['dev'],
    },
    {
      email: 'test@admin.com',
      password: bcrypt.hashSync('adminTest1', 10),
      fullName: 'Admin Test',
      roles: ['admin'],
    },
    {
      email: 'test@roundman.com',
      password: bcrypt.hashSync('roundmanTest1', 10),
      fullName: 'roundman Test',
      roles: ['rounds-man'],
    },
    {
      email: 'test@manager.com',
      password: bcrypt.hashSync('managerTest1', 10),
      fullName: 'manager Test',
      roles: ['manager'],
    },
  ],
  ingredients: [
    {
      name: 'Pepinillos',
      type: ['Verduras/Frutas', 'Base'],
      description: 'Base para varios',
      inStock: true,
      images: ['pepinillos_1.jpeg', 'pepinillos_2.jpeg'],
      slug: 'pepinillos',
    },
    {
      name: 'Lechuga',
      type: ['Verduras/Frutas', 'Base', 'Acompañamientos'],
      description: 'Base para varios',
      inStock: true,
      images: ['lechuga_1.jpeg', 'lechuga_2.jpeg'],
      slug: 'lechuga',
    },
    {
      name: 'Pan de Hamburguesa',
      type: ['Panes', 'Base'],
      description: 'Base para hamburguesas',
      inStock: true,
      images: ['pan_1.png', 'pan_2.jpeg'],
      slug: 'pan_de_hamburguesa',
    },
    {
      name: 'Queso',
      type: ['Lacteos/Quesos', 'Base'],
      description: 'Base para varios',
      inStock: true,
      images: ['queso_1.jpeg', 'queso_2.jpeg'],
      slug: 'queso',
    },
    {
      name: 'Papas Crudas',
      type: ['Verduras/Frutas', 'Base'],
      description: 'Para las papas fritas',
      inStock: true,
      images: ['papas_1.jpeg', 'papas_2.jpeg'],
      slug: 'papas_crudas',
    },
    {
      name: 'Hamburguesa',
      type: ['Carnes', 'Base'],
      description: 'Para las papas fritas',
      inStock: true,
      images: ['hamburguesa_1.jpeg', 'hamburguesa_2.jpeg'],
      slug: 'hamburguesa',
    },
    {
      name: 'Mayo',
      type: ['Condimentos', 'Salsas'],
      description: 'Para varios',
      inStock: true,
      images: ['mayo_1.jpeg', 'mayo_2.jpeg'],
      slug: 'mayo',
    },
  ],
};
