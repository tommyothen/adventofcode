import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 5
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
    const [rulesStr, updatesStr] = input.split("\n\n");

    // Parse rules and updates
    const rules = rulesStr.split("\n").map((rule) => rule.split("|"));
    const updates = updatesStr.split("\n").map((update) => update.split(","));

    // Build a map of dependencies
    const dependents = new Map<string, Set<string>>();
    for (const [prereq, dependent] of rules) {
      if (!dependents.has(prereq)) {
        dependents.set(prereq, new Set());
      }
      dependents.get(prereq)!.add(dependent);
    }

    const shouldComeBefore = (a: string, b: string): boolean => {
      return dependents.get(a)?.has(b) ?? false;
    };

    const isValidUpdate = (update: string[]): boolean => {
      // If it's already sorted, it's valid
      for (let i = 0; i < update.length - 1; i++) {
        if (!shouldComeBefore(update[i], update[i + 1])) {
          return false;
        }
      }

      return true;
    };

    return updates
      .filter(isValidUpdate)
      .reduce(
        (sum, update) => sum + parseInt(update[Math.floor(update.length / 2)]),
        0
      );
  }

  public static async part2(input: string): Promise<number> {
    const [rulesStr, updatesStr] = input.split("\n\n");

    // Parse rules and updates
    const rules = rulesStr.split("\n").map((rule) => rule.split("|"));
    const updates = updatesStr.split("\n").map((update) => update.split(","));

    // Build a map of dependencies
    const dependents = new Map<string, Set<string>>();
    for (const [prereq, dependent] of rules) {
      if (!dependents.has(prereq)) {
        dependents.set(prereq, new Set());
      }
      dependents.get(prereq)!.add(dependent);
    }

    const shouldComeBefore = (a: string, b: string): boolean => {
      return dependents.get(a)?.has(b) ?? false;
    };

    const isInvalidUpdate = (update: string[]): boolean => {
      // Can check if it's invalid by checking if it's not sorted
      for (let i = 0; i < update.length - 1; i++) {
        if (shouldComeBefore(update[i + 1], update[i])) {
          return true;
        }
      }

      return false;
    };

    return updates
      .filter(isInvalidUpdate)
      .map((update) => {
        // Sort based on dependencies
        const sortedUpdate = update.sort((a, b) => {
          if (shouldComeBefore(b, a)) return 1;
          if (shouldComeBefore(a, b)) return -1;
          return 0;
        });

        return parseInt(sortedUpdate[Math.floor(sortedUpdate.length / 2)]);
      })
      .reduce((sum, middle) => sum + middle, 0);
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
