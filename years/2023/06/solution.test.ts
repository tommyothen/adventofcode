import { expect, test } from "bun:test";
import Solution from "./solution";

test("2023/06 |> Part 1", async () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  expect(await Solution.part1(input)).toBe(288);
});

test("2023/06 |> Part 2", async () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  expect(await Solution.part2(input)).toBe(71503);
});
