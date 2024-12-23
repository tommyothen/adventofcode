import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/02 |> Part 1", async () => {
  const input = `2x3x4
  1x1x10`;

  expect(await Solution.part1(input)).toBe(58+43);
});

test("2015/02 |> Part 2", async () => {
  const input = `2x3x4
  1x1x10`;

  expect(await Solution.part2(input)).toBe(34+14);
});
