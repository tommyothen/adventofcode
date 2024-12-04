import { prettyPrintResults, timeit, create2DArrayFromInput } from "@/utils";
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

  public static async part1(input: string): Promise<number> {
    // Create a 2D array to represent the grid
    const grid = create2DArrayFromInput(input);
    const height = grid.length;
    const width = grid[0].length;

    let xmasCount = 0;

    // Loop over the grid until we find an "X"
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (grid[i][j] === "X") {
          // We now need to search the surrounding cells
          for (let k = -1; k <= 1; k++) {
            for (let l = -1; l <= 1; l++) {
              // Skip the current cell
              if (k === 0 && l === 0) continue;

              // For the next 3 cells, check them
              const MAS = ["M", "A", "S"];
              for (let m = 1; m <= 3; m++) {
                const row = i + k * m;
                const col = j + l * m;

                // Check if the cell is out of bounds
                if (row < 0 || row >= height || col < 0 || col >= width) {
                  break;
                }

                // Check if the cell is a "M", "A", or "S"
                // respective to the current iteration
                if (grid[row][col] !== MAS[m - 1]) {
                  break;
                }

                // If we have reached the end of the loop
                // and all the cells are "MAS", then increment
                // the xmasCount
                if (m === 3) {
                  xmasCount++;
                }
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
    const grid = create2DArrayFromInput(input);

    function crossSearch(row: number, col: number): Boolean {
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

      return (
        ((NW === "M" && SE === "S") || (NW === "S" && SE === "M")) &&
        ((NE === "M" && SW === "S") || (NE === "S" && SW === "M"))
      );
    }

    let xmasCount = 0;

    // Loop over the grid until we find an "A"
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (grid[i][j] === "A") {
          if (crossSearch(i, j)) {
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
