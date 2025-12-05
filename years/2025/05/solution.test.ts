import { expect, test } from "bun:test";
import Solution from "./solution";

test("2025/05 |> Part 1", async () => {
  const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

  expect(await Solution.part1(input)).toBe(3);
});

test("2025/05 |> Part 2", async () => {
  const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

  expect(await Solution.part2(input)).toBe(14);
});
