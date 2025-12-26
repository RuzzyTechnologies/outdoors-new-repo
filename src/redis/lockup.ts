import { redis } from "./client";

const MAX_ATTEMPTS = 7;
const WINDOWS_SECONDS = 15 * 60;
const LOCK_SECONDS = 10 * 60;

export async function isAccountLocked(identifier: string) {
  const lockKey = `login:lock:${identifier}`;
  return (await redis.exists(lockKey)) === 1;
}

export async function recordFailure(identifier: string) {
  const failKey = `login:fail:${identifier}`;
  const lockKey = `login:lock:${identifier}`;

  const attempts = await redis.incr(failKey);

  if (attempts === 1) {
    await redis.expire(failKey, WINDOWS_SECONDS);
  }

  if (attempts >= MAX_ATTEMPTS) {
    await redis.set(lockKey, "1", {
      EX: LOCK_SECONDS,
    });
  }
}

export async function recordSuccess(identifier: string) {
  await redis.del([`login:fail:${identifier}`, `login:lock:${identifier}`]);
}
