import { prettyPrintResults, timeit, create2DArray } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 4
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

  private static recursiveSearch(
    grid: string[][],
    row: number,
    col: number,
    direction: [number, number],
    lettersLeft: string[]
  ): Boolean {
    // If we have found all the letters, return true
    if (lettersLeft.length === 0) {
      return true;
    }

    // If we are out of bounds, return false
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return false;
    }

    // If the current cell does not match the letter we are looking for, return false
    if (grid[row][col] !== lettersLeft[0]) {
      return false;
    }

    // Recursively search in the direction
    return Solution.recursiveSearch(
      grid,
      row + direction[0],
      col + direction[1],
      direction,
      lettersLeft.slice(1)
    );
  }

  private static crossSearch(
    grid: string[][],
    row: number,
    col: number
  ): Boolean {
    // Check if any of the 4 diagonals are out of bounds
    if (
      row - 1 < 0 ||
      row + 1 >= grid.length ||
      col - 1 < 0 ||
      col + 1 >= grid[0].length
    ) {
      return false;
    }

    // Get the 4 diagonals
    const NW = grid[row - 1][col - 1];
    const NE = grid[row - 1][col + 1];
    const SE = grid[row + 1][col + 1];
    const SW = grid[row + 1][col - 1];

    let masCount = 0;

    if ((NW === "M" && SE === "S") || (NW === "S" && SE === "M")) masCount++;
    if ((NE === "M" && SW === "S") || (NE === "S" && SW === "M")) masCount++;

    return masCount === 2;
  }

  public static async part1(input: string): Promise<number> {
    // Find the height and width of the grid
    const lines = input.trim().split("\n");
    const height = lines.length;
    const width = lines[0].length;

    // Create a 2D array to represent the grid
    const grid = create2DArray(height, width, " ");

    // Populate the grid
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        grid[i][j] = lines[i][j];
      }
    }

    let xmasCount = 0;

    // Loop over the grid until we find an "X"
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (grid[i][j] === "X") {
          // We now need to search the surrounding cells
          for (let k = -1; k <= 1; k++) {
            for (let l = -1; l <= 1; l++) {
              // Skip the current cell
              if (k === 0 && l === 0) {
                continue;
              }

              // Recursively search for "M", "A", "S"
              if (
                Solution.recursiveSearch(
                  grid,
                  i + k,
                  j + l,
                  [k, l],
                  ["M", "A", "S"]
                )
              ) {
                xmasCount++;
              }
            }
          }
        }
      }
    }

    return xmasCount;
  }

  public static async part2(input: string): Promise<number> {
    // Find the height and width of the grid
    const lines = input.trim().split("\n");
    const height = lines.length;
    const width = lines[0].length;

    // Create a 2D array to represent the grid
    const grid = create2DArray(height, width, " ");

    // Populate the grid
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        grid[i][j] = lines[i][j];
      }
    }

    let xmasCount = 0;

    // Loop over the grid until we find an "A"
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (grid[i][j] === "A") {
          if (Solution.crossSearch(grid, i, j)) {
            xmasCount++;
          }
        }
      }
    }

    return xmasCount;
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
