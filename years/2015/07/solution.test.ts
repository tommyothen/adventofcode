import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/07 |> Part 1", async () => {
  const input = `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`;

  expect(await Solution.part1(input)).toBe(0);
});

test("2015/07 |> Part 2", async () => {
  const input = ``;

  expect(await Solution.part2(input)).toBe(0);
});
