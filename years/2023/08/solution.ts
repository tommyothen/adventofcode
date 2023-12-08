import { lcm, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 08
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static * directionGenerator(directions: string) {
    let i = 0;

    while (true) {
      const current = directions[i % directions.length];

      if (current === "L") yield 0;
      else if (current === "R") yield 1;

      i++;
    }
  }

  private static parseMap(linesIn: string): Map<string, [string, string]> {
    const lines = linesIn.split(/\r?\n/g);

    const map = new Map<string, [string, string]>(); // [left, right]

    for (const line of lines) {
      const [key, locations] = line.split(" = ");
      const [left, right] = locations.replaceAll(/[\(\)]/g, "").split(", ");

      map.set(key, [left, right]);
    }

    return map;
  }

  private static getStartNodes(map: Map<string, [string, string]>) {
    return [...map.keys()].filter(key => key.endsWith("A"));
  }

  private static lcm(arr: number[]) {
    return arr.reduce((acc, curr) => lcm(acc, curr));
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const [d, , maps] = input.split(/(\r?\n){2}/g);

    const directions = Solution.directionGenerator(d);
    const map = Solution.parseMap(maps);

    let steps = 0;
    let current = "AAA";

    // While we're not at "ZZZ"
    while (current !== "ZZZ") {
      const [left, right] = map.get(current)!;

      // Go left or right
      current = directions.next().value ? right : left;

      steps++;
    }

    return steps;
  }

  public static async part2(input: string): Promise<number> {
    const [d, , maps] = input.split(/(\r?\n){2}/g);

    const directions = Solution.directionGenerator(d);
    const map = Solution.parseMap(maps);

    const startNodes = Solution.getStartNodes(map);
    const cycleLengths = new Array(startNodes.length).fill(0);

    startNodes.forEach((start, index) => {
      let current = start;
      let steps = 0;
      do {
        const [left, right] = map.get(current)!;
        current = directions.next().value ? right : left;
        steps++;
      } while (!current.endsWith("Z"));
      cycleLengths[index] = steps;
    });

    return Solution.lcm(cycleLengths);
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
