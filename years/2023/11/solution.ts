import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 11
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static findEmptyRowsAndColumns(lines: string[]) {
    const emptyRowsIndexes: number[] = [];
    const emptyColumnsIndexes: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^\.*$/)) emptyRowsIndexes.push(i);
    }
    for (let i = 0; i < lines[0].length; i++) {
      if (lines.every((line) => line[i] === '.')) emptyColumnsIndexes.push(i);
    }
    return { emptyRowsIndexes, emptyColumnsIndexes };
  }

  private static manhattanDistance(pos1: [number, number], pos2: [number, number]) {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
  }

  private static calculateTotalDistance(galaxyPositions: Array<[number, number]>, emptyRows: number[], emptyColumns: number[], expandFactor: number) {
    let totalDistance = 0;
    for (let i = 0; i < galaxyPositions.length; i++) {
      for (let j = i + 1; j < galaxyPositions.length; j++) {
        const dist = Solution.manhattanDistance(galaxyPositions[i], galaxyPositions[j]);
        let expand = 0;
        // Check and add the expansion for rows
        for (const row of emptyRows) {
          if (row >= galaxyPositions[i][0] && row < galaxyPositions[j][0] ||
            row >= galaxyPositions[j][0] && row < galaxyPositions[i][0]) {
            expand += expandFactor - 1;
          }
        }
        // Check and add the expansion for columns
        for (const col of emptyColumns) {
          if (col >= galaxyPositions[i][1] && col < galaxyPositions[j][1] ||
            col >= galaxyPositions[j][1] && col < galaxyPositions[i][1]) {
            expand += expandFactor - 1;
          }
        }
        totalDistance += dist + expand;
      }
    }
    return totalDistance;
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  private static solveSolution(input: string, expandFactor: number) {
    const lines = input.split(/\r?\n/);
    const { emptyRowsIndexes, emptyColumnsIndexes } = Solution.findEmptyRowsAndColumns(lines);

    // Find the positions of all the galaxies
    const galaxyPositions: Array<[number, number]> = [];
    for (let row = 0; row < lines.length; row++) {
      for (let col = 0; col < lines[row].length; col++) {
        if (lines[row][col] === '#') galaxyPositions.push([row, col]);
      }
    }

    return Solution.calculateTotalDistance(galaxyPositions, emptyRowsIndexes, emptyColumnsIndexes, expandFactor);
  }

  public static async part1(input: string): Promise<number> {
    return Solution.solveSolution(input, 2);
  }

  public static async part2(input: string): Promise<number> {
    return Solution.solveSolution(input, 1000000);
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
