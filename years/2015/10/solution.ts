import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 10
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

  private static lookAndSay(groups: string[]): string {
    return groups.map((group) => `${group.length}${group[0]}`).join("");
  }

  public static async part1(input: string): Promise<number> {
    // Group by consecutive digits
    const capture = /(\d)\1*/g;
    let groups = input.match(capture) as string[];

    // Run 40 times
    for (let i = 0; i < 40; i++) {
      groups = Solution.lookAndSay(groups).match(capture) as string[];
    }

    return groups.join("").length;
  }

  public static async part2(input: string): Promise<number> {
    // Group by consecutive digits
    const capture = /(\d)\1*/g;
    let groups = input.match(capture) as string[];

    // Run 50 times
    for (let i = 0; i < 50; i++) {
      groups = Solution.lookAndSay(groups).match(capture) as string[];
    }

    return groups.join("").length;
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
