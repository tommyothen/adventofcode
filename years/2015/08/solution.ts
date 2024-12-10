import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 8
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
    let total = 0;

    for (const line of input.split("\n")) {
      // Replace all of the escaped characters
      const replaced = line.replace(/\\(?:["\\]|x[0-9a-f]{2})/g, "#");

      const codeLength = line.length;
      const memoryLength = replaced.length - 2;

      total += codeLength - memoryLength;
    }

    return total;
  }

  public static async part2(input: string): Promise<number> {
    let total = 0;

    for (const line of input.split("\n")) {
      // Replace all of the escaped characters
      const replaced = line.replace(/\\|"/g, "##");

      const codeLength = line.length;
      const memoryLength = replaced.length + 2;

      total += memoryLength - codeLength;
    }

    return total;
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
