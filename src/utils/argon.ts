import argon2 from "argon2";

const argonConfig = {
  type: argon2.argon2id,
  memoryCost: Number(process.env.ARGON_MEMORY_COST),
  timeCost: Number(process.env.ARGON_TIME_COST),
  parallelism: Number(process.env.ARGON_PARALLELISM),
};

export function hashPassword(password: string) {
  return argon2.hash(password, argonConfig);
}

export function verifyPassword(hashedPassword: string, password: string) {
  return argon2.verify(hashedPassword, password);
}
