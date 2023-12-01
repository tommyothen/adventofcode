import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const results = {
    ">": 2,
    "^>v<": 4,
    "^v^v^v^v^v": 2,
  }

  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part1(input)).toBe(expected);
  }
});

test("Part 2", async () => {
  const results = {
    "^v": 3,
    "^>v<": 3,
    "^v^v^v^v^v": 11,
  }

  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part2(input)).toBe(expected);
  }
});
