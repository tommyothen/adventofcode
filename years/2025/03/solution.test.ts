import { expect, test } from "bun:test";
import Solution from "./solution";

test("2025/03 |> Part 1", async () => {
  const input = `987654321111111
811111111111119
234234234234278
818181911112111`;

  expect(await Solution.part1(input)).toBe(357);
});

test("2025/03 |> Part 2", async () => {
  const input = `987654321111111
811111111111119
234234234234278
818181911112111`;

  expect(await Solution.part2(input)).toBe(3121910778619);
});
