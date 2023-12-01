import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 04
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input], 1),
      part2: await timeit(Solution.part2, [input], 1),
    }
  }

  public static async part1(input: string): Promise<number> {
    let found = false;
    let result = 0;

    const hasher = new Bun.CryptoHasher("md5");

    while (!found) {
      const hash = hasher.update(input + result, "latin1").digest("hex")

      if (hash.startsWith("00000")) {
        found = true;
      } else {
        result++;
      }
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    let found = false;
    let result = 0;

    const hasher = new Bun.CryptoHasher("md5");

    while (!found) {
      const hash = hasher.update(input + result, "latin1").digest("hex")

      if (hash.startsWith("000000")) {
        found = true;
      } else {
        result++;
      }
    }

    return result;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
