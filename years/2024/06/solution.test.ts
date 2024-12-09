import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/06 |> Part 1", async () => {
  const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

  expect(await Solution.part1(input)).toBe(41);
});

test("2024/06 |> Part 2", async () => {
  const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

  expect(await Solution.part2(input)).toBe(6);
});