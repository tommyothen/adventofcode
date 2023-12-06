import { prettyPrintResults, product, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 06
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static parseInput(input: string): number[][] {
    const numRegex = /\d+/g;
    const lines = input.split(/\r?\n/);

    return lines.map((line) => {
      const numbers = line.match(numRegex);
      return numbers ? numbers.map(Number) : [];
    });
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    // Parse the input into times and records
    const [times, records] = Solution.parseInput(input);

    // Calculate the results for each time and record
    const results = times.map((time, i) => {
      const record = records[i];

      const out: number[] = [];

      // Calculate the distance for each acceleration
      for (let acceleration = 0; acceleration < time; acceleration++) {
        const distance = acceleration * (time - acceleration);

        // Check if the distance is greater than the record
        if (distance > record)
          out.push(distance);
      }

      return out.length;
    });

    // Calculate the product of all results
    return product(results);
  }

  public static async part2(input: string): Promise<number> {
    // Parse the input into times and records
    const [times, records] = Solution.parseInput(input);

    // De-kern the times and records
    const time = Number(times.reduce((acc, curr) => acc + curr, ""));
    const record = Number(records.reduce((acc, curr) => acc + curr, ""));

    // Calculate the discriminant
    const discriminant = time * time - 4 * record;

    // Check if the discriminant is negative
    if (discriminant < 0) {
      return 0;
    }

    // Calculate the number of accelerations that result in a distance greater than the record
    const acceleration1 = (time + Math.sqrt(discriminant)) / 2;
    const acceleration2 = (time - Math.sqrt(discriminant)) / 2;

    // Calculate the number of distances greater than the record
    const numDistances = Math.floor(acceleration1) - Math.ceil(acceleration2) + 1;

    return numDistances;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
