import { prettyPrintResults, rotateMatrix, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 6
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
    const problems = input.split("\n").map((line) => line.trim().split(/\s+/));
    let total = 0;

    // Run down the columns
    for (let col = 0; col < problems[0].length; col++) {
      let columnValues: number[] = [];
      for (let row = 0; row < problems.length; row++) {
        const val = problems[row][col];
        switch (val) {
          case "*":
            total += columnValues.reduce((a, b) => a * b, 1);
            columnValues = [];
            break;
          case "+":
            total += columnValues.reduce((a, b) => a + b, 0);
            columnValues = [];
            break;
          default:
            columnValues.push(parseInt(val, 10));
            break;
        }
      }
    }

    return total;
  }

  public static async part2(input: string): Promise<number> {
    const inputSplit = input.split("\n");
    const operatorsRow = inputSplit.pop()!;
    const operators = operatorsRow.trim().split(/\s+/);

    // Pad all the lines to the same length
    const width = Math.max(...inputSplit.map((line) => line.length));
    const inputMatrix = inputSplit.map((line) =>
      line.padEnd(width, " ").split("")
    );

    // Rotate the matrix counter-clockwise
    const rotatedMatrix = rotateMatrix(inputMatrix, false);

    const newInput: string = rotatedMatrix
      .map((row) => row.join("").trimEnd())
      .join("\n");

    const batches = newInput.split("\n\n").map(
      (batch) => batch.split("\n").map(
        (line) => line.trim().split(/\s+/)
      )
    );

    // For each batch, process the columns according to the operators row
    let total = 0;

    for (let i = 0; i < batches.length; i++) {
      const operator = operators[operators.length - i - 1];
      const batch = batches[i];

      switch (operator) {
        case "*":
          total += batch.flat().reduce((a, b) => a * parseInt(b, 10), 1);
          break;
        case "+":
          total += batch.flat().reduce((a, b) => a + parseInt(b, 10), 0);
          break;
      }
    }

    return total;
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
