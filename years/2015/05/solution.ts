import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 05
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const lines = input.split("\n");

    // Create sets for rules
    const vowels = new Set(["a", "e", "i", "o", "u"]);
    const forbidden = new Set(["ab", "cd", "pq", "xy"]);

    let result = 0;

    // Loop over each line
    for (const line of lines) {
      // Count vowels
      let vowelCount = 0;
      for (const char of line) {
        if (vowels.has(char)) {
          // Break early if we already have 3 vowels
          if (vowelCount++ === 3) break;
        }
      }
      // Check if we're already done
      if (vowelCount < 3) continue;

      // Check the forbidden strings
      let hasForbidden = false;
      for (const forbiddenString of forbidden) {
        if (line.includes(forbiddenString)) {
          hasForbidden = true;
          break;
        }
      }
      // Check if we're already done
      if (hasForbidden) continue;

      // Check for double letters
      let hasDouble = false;
      for (let i = 1; i < line.length; i++) {
        if (line[i] === line[i - 1]) {
          hasDouble = true;
          break;
        }
      }
      // Check if we're already done
      if (!hasDouble) continue;

      // If we get here, we have a nice string
      result++;
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    const lines = input.split("\n");

    let result = 0;

    // Loop over each line
    for (const line of lines) {
      // Check for double pairs
      let hasDoublePair = false;
      for (let i = 0; i < line.length - 2; i++) {
        const pair = line.slice(i, i + 2);
        if (line.slice(i + 2).includes(pair)) {
          hasDoublePair = true;
          break;
        }
      }
      // Check if we're already done
      if (!hasDoublePair) continue;

      // Check for repeating letter with one in between
      let hasRepeating = false;
      for (let i = 2; i < line.length; i++) {
        if (line[i] === line[i - 2]) {
          hasRepeating = true;
          break;
        }
      }
      // Check if we're already done
      if (!hasRepeating) continue;

      // If we get here, we have a nice string
      result++;
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
