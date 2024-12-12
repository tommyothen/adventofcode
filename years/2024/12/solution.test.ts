import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/12 |> Part 1", async () => {
  const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

  expect(await Solution.part1(input)).toBe(1930);
});

test("2024/12 |> Part 2", async () => {
  const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

  expect(await Solution.part2(input)).toBe(1206);
});
