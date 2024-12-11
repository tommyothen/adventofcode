import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 11
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

  private static countDigits(n: number): number {
    return n === 0 ? 1 : Math.floor(Math.log10(Math.abs(n))) + 1;
  }

  // Blink on a single stone
  private static blink(stone: number): number[] {
    if (stone === 0) {
      return [1];
    }

    const digits = Solution.countDigits(stone);
    if (digits % 2 === 0) {
      // Split number using power of 10
      const splitAt = Math.pow(10, Math.floor(digits / 2));
      return [Math.floor(stone / splitAt), stone % splitAt];
    }

    return [stone * 2024];
  }

  private static calculateLength(stones: number[], amount: number): number {
    let stoneFreq = new Map<number, number>();
    for (const stone of stones) {
      stoneFreq.set(stone, (stoneFreq.get(stone) || 0) + 1);
    }

    const blinkCache = new Map<number, number[]>();

    for (let i = 0; i < amount; i++) {
      const nextStoneFreq = new Map<number, number>();

      for (const [stone, count] of stoneFreq.entries()) {
        // Use cached blink result if available
        if (!blinkCache.has(stone)) {
          blinkCache.set(stone, Solution.blink(stone));
        }

        const nextStones = blinkCache.get(stone)!;
        for (const nextStone of nextStones) {
          nextStoneFreq.set(
            nextStone,
            (nextStoneFreq.get(nextStone) || 0) + count
          );
        }
      }

      stoneFreq = nextStoneFreq;
    }

    return Array.from(stoneFreq.values()).reduce((acc, val) => acc + val, 0);
  }

  public static async part1(input: string): Promise<number> {
    let stones = input.split(" ").map(Number);
    return Solution.calculateLength(stones, 25);
  }

  public static async part2(input: string): Promise<number> {
    let stones = input.split(" ").map(Number);
    return Solution.calculateLength(stones, 75);
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
