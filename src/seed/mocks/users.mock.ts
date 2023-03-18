import * as bcrypt from 'bcrypt';
interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  avatar: Avatar;
}

interface Avatar {
  url: string;
}

export const seededUsers: SeedUser[] = [
  {
    email: 'test@user.com',
    password: bcrypt.hashSync('userTest1', 10),
    fullName: 'Test User',
    roles: ['user'],
    avatar: {
      url: 'user.png',
    },
  },
  {
    email: 'test@dev.com',
    password: bcrypt.hashSync('devTest1', 10),
    fullName: 'Test Dev',
    roles: ['dev'],
    avatar: {
      url: 'dev.png',
    },
  },
  {
    email: 'test@admin.com',
    password: bcrypt.hashSync('adminTest1', 10),
    fullName: 'Admin Test',
    roles: ['admin'],
    avatar: {
      url: 'admin.png',
    },
  },
  {
    email: 'test@roundman.com',
    password: bcrypt.hashSync('roundsmanTest1', 10),
    fullName: 'roundsman Test',
    roles: ['rounds-man'],
    avatar: {
      url: 'roundsman.png',
    },
  },
  {
    email: 'test@manager.com',
    password: bcrypt.hashSync('managerTest1', 10),
    fullName: 'manager Test',
    roles: ['manager'],
    avatar: {
      url: 'manager.png',
    },
  },
];
