import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 03
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
    // Keep track which houses have recieved presents
    const recievedPresents = new Set<string>(
      // Add starting position to set
      ["0,0"]
    );

    // Define starting positions
    let x = 0;
    let y = 0;

    // Loop through each direction
    for (const direction of input) {
      // Move in the direction
      switch (direction) {
        case "^": y++; break;
        case "v": y--; break;
        case ">": x++; break;
        case "<": x--; break;
      }

      // Add the position to the set
      recievedPresents.add(`${x},${y}`);
    }

    // Return the number of houses that recieved presents
    return recievedPresents.size;
  }

  public static async part2(input: string): Promise<number> {
    // Keep track which houses have recieved presents
    const recievedPresents = new Set<string>(
      // Add starting positions to set
      ["0,0"]
    );

    // Define starting positions
    const santaPos = [0, 0];
    const roboPos = [0, 0];

    // Keep track which turn it is
    let turn = 0; // 0 = Santa, 1 = Robo-Santa

    // Loop through each direction
    for (const direction of input) {
      // Move in the direction
      switch (direction) {
        case "^": turn ? roboPos[1]++ : santaPos[1]++; break;
        case "v": turn ? roboPos[1]-- : santaPos[1]--; break;
        case ">": turn ? roboPos[0]++ : santaPos[0]++; break;
        case "<": turn ? roboPos[0]-- : santaPos[0]--; break;
      }

      // Add the position to the set
      recievedPresents.add(`${turn ? roboPos[0] : santaPos[0]},${turn ? roboPos[1] : santaPos[1]}`);

      // Switch turns
      turn = turn ? 0 : 1;
    }

    // Return the number of houses that recieved presents
    return recievedPresents.size;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
