import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `ugknbfddgicrmopn
  aaa
  haegwjzuvuyypxyu
  dvszwmarrgswjxmb`;

  expect(await Solution.part1(input)).toBe(2);
});

test("Part 2", async () => {
  const input = `qjhvhtzxzqqjkmpb
  xxyxx
  uurcxstgmygtbstg
  ieodomkazucvgmuy`;

  expect(await Solution.part2(input)).toBe(2);
});
