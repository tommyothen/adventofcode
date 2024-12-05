import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/06 |> Part 1", async () => {
  const input = `turn on 0,0 through 999,999
  toggle 0,0 through 999,0
  turn off 499,499 through 500,500`;

  expect(await Solution.part1(input)).toBe(998996);
});

test("2015/06 |> Part 2", async () => {
  const input = `turn on 0,0 through 0,0
  toggle 0,0 through 999,999`;

  expect(await Solution.part2(input)).toBe(2000001);
});
