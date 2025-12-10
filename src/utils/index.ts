import crypto from "crypto";

export function dateParser(date: string) {
  const [month, day, year] = date.split("/");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export function stringParser(args: any[]) {
  return `${args[0]}, ${args[1]}`;
}
