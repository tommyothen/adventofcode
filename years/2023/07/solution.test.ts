import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  expect(await Solution.part1(input)).toBe(6440);
});

test("Part 2", async () => {
  const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  expect(await Solution.part2(input)).toBe(5905);
});
