import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const results = {
    "(())": 0,
    "()()": 0,
    "(((": 3,
    "(()(()(": 3,
    "))(((((": 3,
    "())": -1,
    "))(": -1,
    ")))": -3,
    ")())())": -3,
  }

  // Test each case
  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part1(input)).toBe(expected);
  }
});

test("Part 2", async () => {
  const input = ``;

  expect(await Solution.part2(input)).toBe(0);
});
