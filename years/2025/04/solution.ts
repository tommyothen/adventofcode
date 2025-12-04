import { prettyPrintResults, timeit, create2DArrayFromInput } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 4
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
    const grid = create2DArrayFromInput<"." | "@">(input);
    let count = 0;

    // Loop over the grid
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        // If we find an @, check its 8 neighbors
        if (grid[y][x] === "@") {
          let numAdjacent = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue; // Skip self
              const nx = x + dx;
              const ny = y + dy;

              if (
                ny >= 0 &&
                ny < grid.length &&
                nx >= 0 &&
                nx < grid[y].length &&
                grid[ny][nx] === "@"
              ) {
                numAdjacent++;
              }
            }
          }

          if (numAdjacent < 4) {
            count++;
          }
        }
      }
    }

    return count;
  }

  public static async part2(input: string): Promise<number> {
    let grid = create2DArrayFromInput<"." | "@">(input);
    let count = 0;
    let flag = true;

    while (flag) {
      flag = false;
      const newGrid = grid.map((row) => [...row]);

      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          if (grid[y][x] === "@") {
            let numAdjacent = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Skip self
                const nx = x + dx;
                const ny = y + dy;

                if (
                  ny >= 0 &&
                  ny < grid.length &&
                  nx >= 0 &&
                  nx < grid[y].length &&
                  grid[ny][nx] === "@"
                ) {
                  numAdjacent++;
                }

              }
            }
            if (numAdjacent < 4) {
              newGrid[y][x] = ".";
              flag = true;
              count++;
            }
          }
        }
      }
      grid = newGrid;
    }

    return count;
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
