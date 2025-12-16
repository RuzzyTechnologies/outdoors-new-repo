import { dateParser, randomString, stringParser } from "../src/utils";

describe("dateParser", () => {
  test("change date type from string to Date", () => {
    const dateString = "08/03/2025";
    const parsedDate = dateParser(dateString);

    expect(parsedDate).toBeInstanceOf(Date);
    expect(parsedDate.getMonth()).toEqual(2); // 2 = March
    expect(parsedDate.getDay()).toEqual(6); // 6 = Saturday
    expect(parsedDate.getFullYear()).toEqual(2025);
  });
});

describe("randomString", () => {
  test("returned strings should have specified lengths", () => {
    expect(randomString(16)).toHaveLength(16);
    expect(randomString(10)).toHaveLength(10);
    expect(randomString(8)).toHaveLength(8);
  });
});

describe("stringParser", () => {
  test("return a concatenated string of all elements in the provided array", () => {
    const arr = [1, 3, "how", "thanks"];

    expect(stringParser(arr)).toEqual("1 3 how thanks");
    expect(stringParser(arr)).toHaveLength(14);
  });
});
