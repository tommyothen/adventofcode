import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 9
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

  private static permute(arr: string[]): string[][] {
    if (arr.length === 1) {
      return [arr];
    }

    const result: string[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const remainingPerms = Solution.permute(remaining);
      for (const perm of remainingPerms) {
        result.push([current, ...perm]);
      }
    }

    return result;
  }

  public static async part1(input: string): Promise<number> {
    const distances = new Map<string, Map<string, number>>();
    const cities = new Set<string>();

    for (const line of input.split("\n")) {
      // London to Dublin = 464
      const matches = /(\w+) to (\w+) = (\d+)/.exec(line);
      if (!matches) continue;
      const [_, from, to, distance] = matches;

      // Add cities to set
      cities.add(from);
      cities.add(to);

      // Initialize maps
      if (!distances.has(from)) {
        distances.set(from, new Map());
      }
      if (!distances.has(to)) {
        distances.set(to, new Map());
      }

      // Store distances for both directions
      distances.get(from)?.set(to, Number(distance));
      distances.get(to)?.set(from, Number(distance));
    }

    const citiesArr = Array.from(cities);

    // Go through each permutation of cities
    let minDistance = Infinity;
    for (const perm of Solution.permute(citiesArr)) {
      let distance = 0;
      for (let i = 0; i < perm.length - 1; i++) {
        distance += distances.get(perm[i])?.get(perm[i + 1]) as number;
      }
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  public static async part2(input: string): Promise<number> {
    const distances = new Map<string, Map<string, number>>();
    const cities = new Set<string>();

    for (const line of input.split("\n")) {
      // London to Dublin = 464
      const matches = /(\w+) to (\w+) = (\d+)/.exec(line);
      if (!matches) continue;
      const [_, from, to, distance] = matches;

      // Add cities to set
      cities.add(from);
      cities.add(to);

      // Initialize maps
      if (!distances.has(from)) {
        distances.set(from, new Map());
      }
      if (!distances.has(to)) {
        distances.set(to, new Map());
      }

      // Store distances for both directions
      distances.get(from)?.set(to, Number(distance));
      distances.get(to)?.set(from, Number(distance));
    }

    const citiesArr = Array.from(cities);

    // Go through each permutation of cities
    let maxDistance = -Infinity;
    for (const perm of Solution.permute(citiesArr)) {
      let distance = 0;
      for (let i = 0; i < perm.length - 1; i++) {
        distance += distances.get(perm[i])?.get(perm[i + 1]) as number;
      }
      maxDistance = Math.max(maxDistance, distance);
    }

    return maxDistance;
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
