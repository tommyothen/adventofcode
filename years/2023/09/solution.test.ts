import { expect, test } from "bun:test";
import Solution from "./solution";

test("2023/09 |> Part 1", async () => {
  const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

  expect(await Solution.part1(input)).toBe(114);
});

test("2023/09 |> Part 2", async () => {
  const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

  expect(await Solution.part2(input)).toBe(2);
});
