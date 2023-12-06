import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  expect(await Solution.part1(input)).toBe(288);
});

test("Part 2", async () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  expect(await Solution.part2(input)).toBe(71503);
});
