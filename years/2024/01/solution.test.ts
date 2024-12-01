import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

  expect(await Solution.part1(input)).toBe(11);
});

test("Part 2", async () => {
  const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

  expect(await Solution.part2(input)).toBe(31);
});
