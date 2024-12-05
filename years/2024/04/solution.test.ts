import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/04 |> Part 1", async () => {
  const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

  expect(await Solution.part1(input)).toBe(18);
});

test("2024/04 |> Part 2", async () => {
  const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

  expect(await Solution.part2(input)).toBe(9);
});
