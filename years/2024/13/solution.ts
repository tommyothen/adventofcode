import { determinant, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 13
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

  /**
   * Solves the simultaneous equations using Cramer's rule:
   * a_x * i + b_x * j = p_x
   * a_y * i + b_y * j = p_y
   */
  private static solveEquations(
    buttonA: [number, number],
    buttonB: [number, number],
    prize: [number, number]
  ): [number, number] | null {
    // Calculate main determinant
    const det = determinant([buttonA, buttonB]);

    // If determinant is 0, system has no unique solution
    if (det === 0) return null;

    // Calculate determinants for i and j using Cramer's rule
    const detI = determinant([prize, buttonB]);
    const detJ = determinant([buttonA, prize]);

    // Calculate number of presses needed
    const i = detI / det;
    const j = detJ / det;

    // Check if solutions are integers and non-negative
    if (
      Math.abs(Math.round(i) - i) > 0 ||
      Math.abs(Math.round(j) - j) > 0 ||
      i < 0 ||
      j < 0
    ) {
      return null;
    }

    return [Math.round(i), Math.round(j)];
  }

  // Verify if the solution is correct
  private static verifySolution(
    buttonA: [number, number],
    buttonB: [number, number],
    prize: [number, number],
    solution: [number, number]
  ): boolean {
    const [i, j] = solution;
    const reachedX = buttonA[0] * i + buttonB[0] * j;
    const reachedY = buttonA[1] * i + buttonB[1] * j;
    return reachedX === prize[0] && reachedY === prize[1];
  }

  private static solution(input: string, offset = 0): number {
    const regex =
      /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g;

    let totalTokens = 0;

    for (const match of input.matchAll(regex)) {
      const [_, aX, aY, bX, bY, targetX, targetY] = match.map(Number);

      const buttonA: [number, number] = [aX, aY];
      const buttonB: [number, number] = [bX, bY];
      const prize: [number, number] = [targetX + offset, targetY + offset];

      const solution = Solution.solveEquations(buttonA, buttonB, prize);

      if (
        solution &&
        Solution.verifySolution(buttonA, buttonB, prize, solution)
      ) {
        const [pressesA, pressesB] = solution;
        totalTokens += pressesA * 3 + pressesB;
      }
    }

    return totalTokens;
  }

  public static async part1(input: string): Promise<number> {
    return Solution.solution(input);
  }

  public static async part2(input: string): Promise<number> {
    return Solution.solution(input, 10000000000000);
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
