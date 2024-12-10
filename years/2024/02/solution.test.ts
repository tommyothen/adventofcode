import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/02 |> Part 1", async () => {
  const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

  expect(await Solution.part1(input)).toBe(2);
});

test("2024/02 |> Part 2", async () => {
  const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

  expect(await Solution.part2(input)).toBe(4);
});
