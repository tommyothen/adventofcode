import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 01
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    let currentFloor = 0;

    // Loop through each character in the input
    for (const char of input) {
      // Increment or decrement the floor
      currentFloor += char === "(" ? 1 : -1;
    }

    return currentFloor;
  }

  public static async part2(input: string): Promise<number> {
    let currentFloor = 0;

    // Loop through each character in the input
    for (let i = 0; i < input.length; i++) {
      // Increment or decrement the floor
      currentFloor += input[i] === "(" ? 1 : -1;

      // If we're on the basement floor, return the current index
      if (currentFloor === -1) return i + 1;
    }

    // Should never happen, but return -1 just in case
    return -1;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
