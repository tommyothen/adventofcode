import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

  expect(await Solution.part1(input)).toBe(161);
});

test("Part 2", async () => {
  const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

  expect(await Solution.part2(input)).toBe(48);
});
