import { expect, test } from "bun:test";
import Solution from "./solution";

test("Part 1", async () => {
  const inputs = [
`.....
.S-7.
.|.|.
.L-J.
.....`,

`-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,

`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,

`7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
  ].map(Solution.prettyInput);

  expect(await Solution.part1(inputs[0])).toBe(4);
  expect(await Solution.part1(inputs[1])).toBe(4);
  expect(await Solution.part1(inputs[2])).toBe(8);
  expect(await Solution.part1(inputs[3])).toBe(8);
});

test("Part 2", async () => {
  const inputs = [
`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,

`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,

`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
  ].map(Solution.prettyInput);

  expect(await Solution.part2(inputs[0])).toBe(4);
  expect(await Solution.part2(inputs[2])).toBe(8);
  expect(await Solution.part2(inputs[3])).toBe(10);
});
