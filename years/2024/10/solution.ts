import {
  create2DArrayFromInputAndApply,
  prettyPrintResults,
  timeit,
} from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 10
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
    const grid = create2DArrayFromInputAndApply(input, Number);
    const width = grid[0].length;

    // Find all 0's
    const zeroPositions: [number, number][] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 0) zeroPositions.push([x, y]);
      }
    }

    const visited = new Set<number>();

    const posToKey = (x: number, y: number): number => y * width + x;
    const followPath = (currentNum: number, x: number, y: number): number => {
      // Base case
      if (currentNum === 9) return 1;

      // Grab the cardinal directions
      const N = grid[y - 1]?.[x];
      const S = grid[y + 1]?.[x];
      const E = grid[y]?.[x + 1];
      const W = grid[y]?.[x - 1];

      const nextNum = currentNum + 1;

      let correctPaths = 0;
      if (N === nextNum) {
        const key = posToKey(x, y - 1);
        if (!visited.has(key)) {
          visited.add(key);
          correctPaths += followPath(nextNum, x, y - 1);
        }
      }
      if (S === nextNum) {
        const key = posToKey(x, y + 1);
        if (!visited.has(key)) {
          visited.add(key);
          correctPaths += followPath(nextNum, x, y + 1);
        }
      }
      if (E === nextNum) {
        const key = posToKey(x + 1, y);
        if (!visited.has(key)) {
          visited.add(key);
          correctPaths += followPath(nextNum, x + 1, y);
        }
      }
      if (W === nextNum) {
        const key = posToKey(x - 1, y);
        if (!visited.has(key)) {
          visited.add(key);
          correctPaths += followPath(nextNum, x - 1, y);
        }
      }

      return correctPaths;
    };

    let trails = 0;
    for (const [x, y] of zeroPositions) {
      trails += followPath(0, x, y);
      visited.clear();
    }

    return trails;
  }

  public static async part2(input: string): Promise<number> {
    const grid = create2DArrayFromInputAndApply(input, Number);

    // Find all 0's
    const zeroPositions: [number, number][] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 0) zeroPositions.push([x, y]);
      }
    }

    const followPath = (currentNum: number, x: number, y: number): number => {
      // Base case
      if (currentNum === 9) return 1;

      // Grab the cardinal directions
      const N = grid[y - 1]?.[x];
      const S = grid[y + 1]?.[x];
      const E = grid[y]?.[x + 1];
      const W = grid[y]?.[x - 1];

      const nextNum = currentNum + 1;

      let correctPaths = 0;

      if (N === nextNum) correctPaths += followPath(nextNum, x, y - 1);
      if (S === nextNum) correctPaths += followPath(nextNum, x, y + 1);
      if (E === nextNum) correctPaths += followPath(nextNum, x + 1, y);
      if (W === nextNum) correctPaths += followPath(nextNum, x - 1, y);

      return correctPaths;
    };

    let trails = 0;
    for (const [x, y] of zeroPositions) {
      trails += followPath(0, x, y);
    }

    return trails;
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
