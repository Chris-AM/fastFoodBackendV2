//TODO!!!!: BREAK THE SEED!!!
interface SeedIngredient {
  name: string;
  type: ValidTypes[];
  description: string;
  inStock: boolean;
  images: string[];
  slug: string;
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
  ingredients: SeedIngredient[];
}

export const seededData: SeedData = {
  ingredients: [
    {
      name: 'Pepinillos',
      type: ['Verduras/Frutas', 'Base'],
      description: 'Base para varios',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'pepinillos',
    },
    {
      name: 'Lechuga',
      type: ['Verduras/Frutas', 'Base', 'Acompañamientos'],
      description: 'Base para varios',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'lechuga',
    },
    {
      name: 'Pan de Hamburguesa',
      type: ['Panes', 'Base'],
      description: 'Base para hamburguesas',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'pan_de_hamburguesa',
    },
    {
      name: 'Queso',
      type: ['Lacteos/Quesos', 'Base'],
      description: 'Base para varios',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'queso',
    },
    {
      name: 'Papas Crudas',
      type: ['Verduras/Frutas', 'Base'],
      description: 'Para las papas fritas',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'papas_crudas',
    },
    {
      name: 'Hamburguesa',
      type: ['Carnes', 'Base'],
      description: 'Para las papas fritas',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'hamburguesa',
    },
    {
      name: 'Mayo',
      type: ['Condimentos', 'Salsas'],
      description: 'Para varios',
      inStock: true,
      images: ['http://image1.jpg', 'http://image2.jpg'],
      slug: 'mayo',
    },
  ],
};
