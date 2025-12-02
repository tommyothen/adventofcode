import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 2
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
    let answer = 0;

    for (const range of input.split(",")) {
      const [start, end] = range.split("-").map(Number);
      for (let id = start; id <= end; id++) {
        const idStr = id.toString();

        // Only continue if the length is even
        if (idStr.length % 2 !== 0) continue;

        const firstHalf = idStr.slice(0, Math.floor(idStr.length / 2));
        const secondHalf = idStr.slice(Math.ceil(idStr.length / 2));

        if (firstHalf === secondHalf) {
          answer += id;
        }
      }
    }

    return answer;
  }

  public static async part2(input: string): Promise<number> {
    let answer = 0;

    const isRepeatedPattern = (s: string): boolean => {
      const len = s.length;

      // Needs to be at least 2 digits to form a pattern
      if (len < 2) return false;

      // Try every possible pattern length
      for (let patternLen = 1; patternLen * 2 <= len; patternLen++) {
        if (len % patternLen !== 0) continue;

        const pattern = s.slice(0, patternLen);
        let isPattern = true;

        // Check all segments
        for (let i = patternLen; i < len; i += patternLen) {
          if (s.slice(i, i + patternLen) !== pattern) {
            isPattern = false;
            break;
          }
        }

        if (isPattern) return true;
      }

      return false;
    };

    for (const range of input.split(",")) {
      const [start, end] = range.split("-").map(Number);

      for (let id = start; id <= end; id++) {
        const idStr = id.toString();

        if (isRepeatedPattern(idStr)) {
          answer += id;
        }
      }
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
