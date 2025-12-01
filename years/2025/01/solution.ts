import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 1
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
    let pointing = 50;
    let answer = 0;

    for (const line of input.split("\n")) {
      const dist = Number(line.slice(1));
      pointing += line[0] === "L" ? -dist : dist;
      pointing = (pointing + 100) % 100; // prevent negative modulo

      if (pointing === 0) answer += 1;
    }

    return answer;
  }

  public static async part2(input: string): Promise<number> {
    let pointing = 50;
    let answer = 0;

    for (const line of input.split("\n")) {
      const dir = line[0] as "L" | "R";
      const dist = Number(line.slice(1));
      const d = dist % 100; // The effective distance in modulo 100

      // Count how many times we land on 0 during the rotation
      const countHits = (start: number, distance: number, positiveDir: boolean): number => {
        // k is the first step where we reach 0
        let firstHit = positiveDir
          ? (100 - start) % 100 // R
          : start % 100; // L

        if (firstHit === 0) firstHit = 100;

        if (distance < firstHit) return 0;

        return 1 + Math.floor((distance - firstHit) / 100);
      }

      const positiveDir = dir === "R";
      answer += countHits(pointing, dist, positiveDir);

      // Apply the movement
      pointing = positiveDir
        ? (pointing + d) % 100
        : (pointing - d + 100) % 100;
    }

    return answer;
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
