import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 03
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static readonly symbolRegex = /[^\w\d\s\.]/;
  private static readonly gearRegex = /[\*]/;
  private static readonly numberRegex = /[\d]+/g;

  private static getSubGrid(grid: string[][], startPos: [Row, Col], numLength: number, debug = false): string[][] {
    const [row, col] = startPos;

    const subGrid: string[][] = [];

    // Loop through the rows and columns around the number
    for (let r = row - 1; r <= row + 1; r++) {
      const subRow: string[] = [];

      for (let c = col - 1; c <= col + numLength; c++) {
        const char = grid[r]?.[c];
        // If debug is enabled, push a █ instead of ignoring the character
        if (char === undefined) subRow.push(debug ? "█" : ".");
        else subRow.push(char);
      }

      subGrid.push(subRow);
    }

    return subGrid;
  }

  private static hasAdjacentSymbol(grid: string[][], numLength: number, startPos: [Row, Col], regex: RegExp): boolean {
    const [row, col] = startPos;

    // Create a subgrid around the number
    const subGrid = Solution.getSubGrid(grid, [row, col], numLength);

    // Check if any of the characters in the subgrid are symbols
    for (const line of subGrid) {
      for (const char of line) {
        if (regex.test(char)) return true;
      }
    }

    return false;
  }

  private static hasAdjacentGears(grid: string[][], numLength: number, startPos: [Row, Col]): {
    hasGears: boolean,
    positions: Array<[Row, Col]> | null,
  } {
    if (!Solution.hasAdjacentSymbol(grid, numLength, startPos, Solution.gearRegex)) {
      return {
        hasGears: false,
        positions: null,
      }
    }

    // Find the position of all gears in the subgrid
    const [row, col] = startPos;
    const subGrid = Solution.getSubGrid(grid, [row, col], numLength);

    // Store the positions of all gears in the subgrid
    const positions: Array<[Row, Col]> = [];
    for (let r = 0; r < subGrid.length; r++) {
      for (let c = 0; c < subGrid[r].length; c++) {
        const absoluteRow = row - 1 + r;
        const absoluteCol = col - 1 + c;

        if (subGrid[r][c] === "*") positions.push([absoluteRow, absoluteCol]);
      }
    }

    return {
      hasGears: true,
      positions,
    }
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const lines = input.split("\n");

    const inputGrid: string[][] = lines.map(line => line.split(""));

    let result = 0;

    // Find all numbers on each line and store them and their (start) positions
    const numbers: Map<`${Row},${Col}`, number> = new Map();

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];

      let match: RegExpExecArray | null;
      while ((match = Solution.numberRegex.exec(line)) !== null) {
        const num = match[0];
        numbers.set(`${row},${match.index}`, Number(num));
      }
    }

    // If the number has an adjacent symbol, add it to the sum
    numbers.forEach((value, key) => {
      const [row, col] = key.split(",").map(Number);
      const numLength = value.toString().length;

      if (Solution.hasAdjacentSymbol(inputGrid, numLength, [row, col], Solution.symbolRegex)) {
        result += value;
      }
    })

    return result;
  }

  public static async part2(input: string): Promise<number> {
    const lines = input.split("\n");

    const inputGrid: string[][] = lines.map(line => line.split(""));

    let result = 0;

    // Find all numbers on each line and store them and their (start) positions
    const numbers: Map<`${Row},${Col}`, number> = new Map();

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];

      let match: RegExpExecArray | null;
      while ((match = Solution.numberRegex.exec(line)) !== null) {
        const num = match[0];
        numbers.set(`${row},${match.index}`, Number(num));
      }
    }

    const gears: Record<`${Row},${Col}`, Array<number>> = {};

    // If the number has an adjacent gear, append it to the array
    // of the gear position in the gears object
    numbers.forEach((value, key) => {
      const [row, col] = key.split(",").map(Number);
      const numLength = value.toString().length;

      const { hasGears, positions } = Solution.hasAdjacentGears(inputGrid, numLength, [row, col]);

      if (hasGears && positions !== null) {
        positions.forEach(([r, c]) => {
          const gearKey = `${r},${c}` as `${Row},${Col}`;

          if (gears[gearKey] === undefined) gears[gearKey] = [];

          gears[gearKey].push(value);
        })
      }
    })

    // Loop over each gear
    for (const gearKey in gears) {
      const gear = gears[gearKey as `${Row},${Col}`];

      // Ignore the gear if it doesn't have exactly 2 numbers
      if (gear.length !== 2) continue;

      // Add the product of the 2 numbers to the result
      result += gear[0] * gear[1];
    }

    return result;
  }
}

// Define some types for the 2D grid, just for readability
type Row = number
type Col = number;

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
