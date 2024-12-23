import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/01 |> Part 1", async () => {
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
  };

  // Test each case
  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part1(input)).toBe(expected);
  }
});

test("2015/01 |> Part 2", async () => {
  const results = {
    ")": 1,
    "()())": 5,
  };

  // Test each case
  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part2(input)).toBe(expected);
  }
});
