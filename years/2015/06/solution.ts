import { create2DArray, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 06
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input], 1),
      part2: await timeit(Solution.part2, [input], 1),
    }
  }

  public static async part1(input: string): Promise<number> {
    const lines = input.split("\n");

    const grid = create2DArray(1000, 1000, false);

    // Loop through each line
    for (const line of lines) {
      // Parse the line
      const [, action, x1, y1, x2, y2] = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/) || [];

      // Loop through each coordinate
      for (let x = +x1; x <= +x2; x++) {
        for (let y = +y1; y <= +y2; y++) {
          // Perform the action
          switch (action) {
            case "turn on":
              grid[x][y] = true;
              break;
            case "turn off":
              grid[x][y] = false;
              break;
            case "toggle":
              grid[x][y] = !grid[x][y];
              break;
          }
        }
      }
    }

    // Count the lights that are on
    let result = 0;
    for (const row of grid) {
      for (const light of row) {
        if (light) result++;
      }
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    const lines = input.split("\n");

    const grid = create2DArray(1000, 1000, 0);

    // Loop through each line
    for (const line of lines) {
      // Parse the line
      const [, action, x1, y1, x2, y2] = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/) || [];

      // Loop through each coordinate
      for (let x = +x1; x <= +x2; x++) {
        for (let y = +y1; y <= +y2; y++) {
          // Perform the action
          switch (action) {
            case "turn on":
              grid[x][y]++;
              break;
            case "turn off":
              grid[x][y] = Math.max(0, grid[x][y] - 1);
              break;
            case "toggle":
              grid[x][y] += 2;
              break;
          }
        }
      }
    }

    // Count the total brightness
    let result = 0;
    for (const row of grid) {
      for (const light of row) {
        result += light;
      }
    }

    return result;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
