import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 05
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static parseInput(input: string) {
    const [seedsInput, ...mapsInput] = input.split(/\r?\n\r?\n/);

    const extractRanges = (input: string) =>
      input
        // Remove the first line
        .split(/\r?\n/)
        .slice(1)
        // Split each line into an array of numbers
        .map((line) => line.split(" ").map(Number) as [number, number, number])

    const output = {
      seeds: seedsInput.split(": ")[1].split(" ").map(Number),
      maps: {
        seed2soil: extractRanges(mapsInput[0]),
        soil2fertilizer: extractRanges(mapsInput[1]),
        fertilizer2water: extractRanges(mapsInput[2]),
        water2light: extractRanges(mapsInput[3]),
        light2temperature: extractRanges(mapsInput[4]),
        temperature2humidity: extractRanges(mapsInput[5]),
        humidity2location: extractRanges(mapsInput[6]),
      }
    }

    return output;
  }

  private static isInSourceRange(toTest: number, range: [number, number, number]) {
    const [, sourceStart, rangeLength] = range;
    const sourceEnd = sourceStart + rangeLength;

    return (
      toTest >= sourceStart &&
      toTest < sourceEnd
    )
  }

  private static followMap(seed: number, maps: ReturnType<typeof Solution.parseInput>["maps"]) {
    let location = seed;

    // Loop over each map
    for (const mapKey of Object.keys(maps)) {
      const currentMap = maps[mapKey as keyof typeof maps];

      // If it's not in any of the ranges, skip it
      if (!currentMap.some((range) => Solution.isInSourceRange(location, range))) {
        continue;
      }

      // Otherwise, find the range it's in
      const range = currentMap.find((range) => Solution.isInSourceRange(location, range))!;

      // And calculate the new location
      // We can do so by finding the difference between the destination and the source
      const [destinationStart, sourceStart] = range;
      const locationDifference = location - sourceStart;

      // And finally, add the difference to the destination
      location = destinationStart + locationDifference;
    }

    return location;
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input], 0),
    }
  }

  public static async part1(input: string): Promise<number> {
    const { seeds, maps } = Solution.parseInput(input);

    // Follow the map for each seed
    const locations = seeds.map((seed) => Solution.followMap(seed, maps));

    return Math.min(...locations);
  }

  public static async part2(input: string): Promise<number> {
    const { seeds: seedRanges, maps } = Solution.parseInput(input);

    let min = Infinity;

    let computed = 0;

    // Loop over every set of [seedStart, rangeLength, ...rest]
    for (let i = 0; i < seedRanges.length; i+=2) {
      const [seedStart, rangeLength] = seedRanges.slice(i, i + 2);

      // Loop over every seed in the range
      for (let seed = seedStart; seed < seedStart + rangeLength; seed++) {
        // Follow the map for each seed
        const location = Solution.followMap(seed, maps);

        // And update the minimum
        if (location < min) {
          min = location;
        }

        // Every 1,000,000 seeds, log the progress
        // And the percentage (total seeds = 1,844,955,419)
        if (computed % 1000000 === 0) {
          console.log(`Computed ${computed} seeds (${computed / 1844955419 * 100}%)`);
        }

        computed++;
      }
    }

    return min;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}