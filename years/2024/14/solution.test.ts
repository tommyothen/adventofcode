import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/14 |> Part 1", async () => {
  const input = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

  expect(await Solution.part1(input)).toBe(21);
});

test("2024/14 |> Part 2", async () => {
  // No test for part 2
});
