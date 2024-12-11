import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/11 |> Part 1", async () => {
  const input = `125 17`;

  expect(await Solution.part1(input)).toBe(55312);
});

test("2024/11 |> Part 2", async () => {
  const input = `125 17`;

  expect(await Solution.part2(input)).toBe(65601038650482);
});
