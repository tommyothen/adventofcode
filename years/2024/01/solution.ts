import { prettyPrintResults, sum, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 1
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(
    resolve(import.meta.dir, "./input.txt")
  ).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    };
  }

  public static async part1(input: string): Promise<number> {
    const firstList: Array<number> = [];
    const secondList: Array<number> = [];

    for (const line of input.split("\n")) {
      const [a, b] = line.split("   ").map(Number);

      firstList.push(a);
      secondList.push(b);
    }

    firstList.sort();
    secondList.sort();

    return sum(firstList.map((n, i) => Math.abs(n - secondList[i])));
  }

  public static async part2(input: string): Promise<number> {
    const firstList: Array<number> = [];
    const secondList: Array<number> = [];

    for (const line of input.split("\n")) {
      const [a, b] = line.split("   ").map(Number);

      firstList.push(a);
      secondList.push(b);
    }

    const scoreMap = new Map<number, number>();
    for (const number of secondList) {
      if (scoreMap.has(number)) {
        scoreMap.set(number, scoreMap.get(number)! + 1);
      } else {
        scoreMap.set(number, 1);
      }
    }

    return sum(firstList.map((n) => n * (scoreMap.get(n) ?? 0)));
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(
    resolve(import.meta.dir, "./output.txt"),
    `${part1.result}\n${part2.result}`
  );

  return [part1.result, part2.result];
}
