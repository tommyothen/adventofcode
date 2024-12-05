import { expect, test } from "bun:test";
import Solution from "./solution";

test("2023/11 |> Part 1", async () => {
  const input =
`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

  expect(await Solution.part1(input)).toBe(374);
});

test("2023/11 |> Part 2", async () => {
  const input =
`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

  expect(await Solution.part2(input)).toBe(82000210);
});
