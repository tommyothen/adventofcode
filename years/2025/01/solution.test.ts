import { expect, test } from "bun:test";
import Solution from "./solution";

test("2025/01 |> Part 1", async () => {
  const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

  expect(await Solution.part1(input)).toBe(3);
});

test("2025/01 |> Part 2", async () => {
  const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

  expect(await Solution.part2(input)).toBe(6);
});
