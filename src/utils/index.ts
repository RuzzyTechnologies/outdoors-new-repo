import crypto from "crypto";

export function dateParser(date: string) {
  // date = "08/03/2025"
  const [day, month, year] = date.split("/");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export function stringParser(args: any[]) {
  let string = "";
  for (let i = 0; i < args.length; ++i) {
    string += `${args[i]} `;
  }

  return string.trim();
}
