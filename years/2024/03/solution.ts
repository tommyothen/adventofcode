import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 3
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
    let result = 0;
    const mulRegex = /mul\(\d+,\d+\)/g;

    // For each match, split the numbers and multiply them
    const matches = input.match(mulRegex);
    if (!matches) return result;

    for (const match of matches) {
      const [a, b] = match
        .slice(4, -1) // Remove the `mul(` and `)`
        .split(",") // Split the numbers
        .map(Number); // Convert them to numbers

      result += a * b;
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    let result = 0;
    const regex = /mul\(\d+,\d+\)|do(?:n't)?\(\)/g;

    // Default to not disabled
    let disabled = false;

    // For each match, check if it's a `mul()`, `do()`, or `don't()`
    // Then do the appropriate operation
    const matches = input.match(regex);
    if (!matches) return result;

    for (const match of matches) {
      if (match === "do()") {
        disabled = false;
      } else if (match === "don't()") {
        disabled = true;
      } else if (!disabled) {
        const [a, b] = match
          .slice(4, -1) // Remove the `mul(` and `)`
          .split(",") // Split the numbers
          .map(Number); // Convert them to numbers

        result += a * b;
      }
    }

    return result;
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
