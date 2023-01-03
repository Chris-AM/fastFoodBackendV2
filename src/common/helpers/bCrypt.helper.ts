import * as bcrypt from 'bcrypt';

const salt = 10;

async function plainToHash(plainPassword: string): Promise<string> {
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}

async function comparePassToHash(
  plain: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}

export { plainToHash, comparePassToHash };
