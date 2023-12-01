import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 02
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
    const lines = input.split("\n");

    let total = 0;

    // Loop through each line
    for (const line of lines) {
      // Get the dimensions of the box
      const [l, w, h] = line.split("x").map(Number);

      // Calculate the surface area of the box
      const surfaceArea = 2 * l * w + 2 * w * h + 2 * h * l;

      // Calculate the area of the smallest side
      const smallestSide = Math.min(l * w, w * h, h * l);

      // Add the surface area and smallest side to the total
      total += surfaceArea + smallestSide;
    }

    return total;
  }

  public static async part2(input: string): Promise<number> {
    const lines = input.split("\n");

    let total = 0;

    // Loop through each line
    for (const line of lines) {
      // Get the dimensions of the box
      const [l, w, h] = line.split("x").map(Number);

      // Calculate the volume of the box
      const volume = l * w * h;

      // Calculate the perimeter of the smallest side
      const smallestPerimeter = 2 * Math.min(l + w, w + h, h + l);

      // Add the volume and perimeter to the total
      total += volume + smallestPerimeter;
    }

    return total;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
