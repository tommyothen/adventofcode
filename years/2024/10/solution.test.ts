import { expect, test } from "bun:test";
import Solution from "./solution";

test("2024/10 |> Part 1", async () => {
  const inputs = [
    `0123
1234
8765
9876
`,
    `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
    `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
  ];

  expect(await Solution.part1(inputs[0])).toBe(1);
  expect(await Solution.part1(inputs[1])).toBe(2);
  expect(await Solution.part1(inputs[2])).toBe(36);
});

test("2024/10 |> Part 2", async () => {
  const inputs = [
    `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`,
    `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
    `012345
123456
234567
345678
4.6789
56789.`,
    `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`,
  ];

  expect(await Solution.part2(inputs[0])).toBe(3);
  expect(await Solution.part2(inputs[1])).toBe(13);
  expect(await Solution.part2(inputs[2])).toBe(227);
  expect(await Solution.part2(inputs[3])).toBe(81);
});
