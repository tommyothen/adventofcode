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
    const dependencies = new Map<string, Set<string>>();
    for (const [prerequisite, dependent] of rules) {
      if (!dependencies.has(dependent)) {
        dependencies.set(dependent, new Set());
      }
      dependencies.get(dependent)!.add(prerequisite);
    }

    const isValidUpdate = (update: string[]): boolean => {
      // Create a map of page positions for O(1) lookup
      const positions = new Map(update.map((page, index) => [page, index]));

      // Check each page's dependencies
      for (let i = 0; i < update.length; i++) {
        const currentPage = update[i];
        const prereqs = dependencies.get(currentPage);

        if (prereqs) {
          // Check if all prerequisites appear before the current page
          for (const prereq of prereqs) {
            const prereqPos = positions.get(prereq);
            // If prerequisite exists and appears after current page, update is invalid
            if (prereqPos !== undefined && prereqPos > i) {
              return false;
            }
          }
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
    const dependencies = new Map<string, Set<string>>();
    for (const [prerequisite, dependent] of rules) {
      if (!dependencies.has(dependent)) {
        dependencies.set(dependent, new Set());
      }
      dependencies.get(dependent)!.add(prerequisite);
    }

    const isInvalidUpdate = (update: string[]): boolean => {
      // Create a map of page positions for O(1) lookup
      const positions = new Map(update.map((page, index) => [page, index]));

      // Check each page's dependencies
      for (let i = 0; i < update.length; i++) {
        const currentPage = update[i];
        const prereqs = dependencies.get(currentPage);

        if (prereqs) {
          // Check if all prerequisites appear before the current page
          for (const prereq of prereqs) {
            const prereqPos = positions.get(prereq);
            // If prerequisite exists and appears after current page, update is invalid
            if (prereqPos !== undefined && prereqPos > i) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const topologicalSort = (update: string[]): string[] => {
      const originalNums = new Set<string>(update);
      const visited = new Set<string>();
      const sorted: string[] = [];

      const visit = (page: string) => {
        if (visited.has(page)) return;

        // Visit all dependents first (pages that should come after this one)
        const dependents = dependencies.get(page);
        if (dependents) {
          for (const dependent of dependents) {
            if (originalNums.has(dependent)) {
              // Only visit if it's in our update
              visit(dependent);
            }
          }
        }

        visited.add(page);

        // Add the page to the start of the array (reverse topological order)
        // Only if it was in the original update
        if (originalNums.has(page)) {
          sorted.unshift(page);
        }
      };

      // Try to visit each page
      update.forEach((page) => {
        if (!visited.has(page)) {
          visit(page);
        }
      });

      return sorted;
    };

    return updates
      .filter(isInvalidUpdate)
      .map((update) => {
        const sortedUpdate = topologicalSort(update);

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
