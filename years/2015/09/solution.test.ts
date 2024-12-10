import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/09 |> Part 1", async () => {
  const input = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

  expect(await Solution.part1(input)).toBe(605);
});

test("2015/09 |> Part 2", async () => {
  const input = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

  expect(await Solution.part2(input)).toBe(982);
});
