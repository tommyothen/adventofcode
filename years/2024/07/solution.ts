import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 7
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

    // Pre-calculate operator patterns to avoid repeated bit operations
    const operatorPatterns = new Map<number, ("+" | "*")[][]>();

    for (const line of input.split("\n")) {
      // const [target, ...numbers] = line.match(/\d+/g)!.map(Number);
      const [t, ...n] = line.split(" ");
      const target = parseInt(t.slice(0, -1));
      const numbers = n.map(Number);

      const numOps = numbers.length - 1;

      // Get or create patterns for this number of operators
      let patterns = operatorPatterns.get(numOps);
      if (!patterns) {
        patterns = [];
        const maxCombinations = 1 << numOps;
        for (let i = 0; i < maxCombinations; i++) {
          const ops: ("+" | "*")[] = new Array(numOps);
          for (let j = 0; j < numOps; j++) {
            ops[j] = (i >> j) & 1 ? "*" : "+";
          }
          patterns.push(ops);
        }
        operatorPatterns.set(numOps, patterns);
      }

      // Try each pattern until we find a match
      patternLoop: for (const ops of patterns) {
        let result = numbers[0];
        for (let j = 1; j < numbers.length; j++) {
          // Early exit if result exceeds target for multiplication
          if (ops[j - 1] === "*") {
            result *= numbers[j];
            if (result > target) continue patternLoop;
          } else {
            result += numbers[j];
          }
        }

        if (result === target) {
          total += target;
          break;
        }
      }
    };

    return total;
  }

  public static async part2(input: string): Promise<number> {
    let total = 0;

    for (const line of input.split("\n")) {
      // const [target, ...numbers] = line.match(/\d+/g)!.map(Number);
      const [t, ...n] = line.split(" ");
      const target = parseInt(t.slice(0, -1));
      const numbers = n.map(Number);

      const len = numbers.length;

      // Helper function to evaluate a specific combination
      const tryOps = (index: number, value: number): boolean => {
        if (value === target) return true;
        if (value > target || index >= len) return false;

        const num = numbers[index];

        // I assume since it's a part 2 question, concatenation would
        // most likely be the most common operation
        const concat = parseInt(`${value}${num}`);
        if (
          concat <= target &&
          (concat === target || tryOps(index + 1, concat))
        ) {
          return true;
        }

        // Multiplication is a good second option
        const mult = value * num;
        if (mult <= target && tryOps(index + 1, mult)) {
          return true;
        }

        // Addition is the last option
        const add = value + num;
        if (add <= target && tryOps(index + 1, add)) {
          return true;
        }

        return false;
      };

      // Start with first number
      if (tryOps(1, numbers[0])) {
        total += target;
      }
    };

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
