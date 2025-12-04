import { expect, test } from "bun:test";
import Solution from "./solution";

test("2025/04 |> Part 1", async () => {
  const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

  expect(await Solution.part1(input)).toBe(13);
});

test("2025/04 |> Part 2", async () => {
  const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

  expect(await Solution.part2(input)).toBe(43);
});
