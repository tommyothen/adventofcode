import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const input = `1abc2
  pqr3stu8vwx
  a1b2c3d4e5f
  treb7uchet`;

  expect(await Solution.part1(input)).toBe(142);
});

test("Part 2", async () => {
  const input = `two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen`;

  expect(await Solution.part2(input)).toBe(281);
});
