import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/09 |> Part 1", async () => {
  const input = `2333133121414131402`;

  expect(await Solution.part1(input)).toBe(1928);
});

test("2024/09 |> Part 2", async () => {
  const input = `2333133121414131402`;

  expect(await Solution.part2(input)).toBe(2858);
});
