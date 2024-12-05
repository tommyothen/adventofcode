import { expect, test } from "bun:test";
import Solution from "./solution";

test("2023/08 |> Part 1", async () => {
  const inputs = [
    `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
    `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
  ]

  expect(await Solution.part1(inputs[0])).toBe(2);
  expect(await Solution.part1(inputs[1])).toBe(6);
});

test("2023/08 |> Part 2", async () => {
  const input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

  expect(await Solution.part2(input)).toBe(6);
});
