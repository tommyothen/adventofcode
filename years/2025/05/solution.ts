import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 5
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
    const [rangesSection, idSection] = input.split("\n\n").map((section) => section.split("\n"));

    const ranges: [number, number][] = rangesSection.map(
      (line) => line.split("-").map(Number) as [number, number]
    );

    ranges.sort((a, b) => a[0] - b[0]);

    const mergedRanges: [number, number][] = [];
    for (const range of ranges) {
      if (mergedRanges.length === 0) {
        mergedRanges.push(range);
        continue;
      }

      const last = mergedRanges[mergedRanges.length - 1];

      if (range[0] > last[1] + 1) {
        mergedRanges.push(range);
      } else {
        if (range[1] > last[1]) {
          last[1] = range[1];
        }
      }
    }

    let count = 0;
    for (const line of idSection) {
      const id = Number(line);

      let low = 0;
      let high = mergedRanges.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const [start, end] = mergedRanges[mid];

        if (id < start) {
          high = mid - 1;
        } else if (id > end) {
          low = mid + 1;
        } else {
          count++;
          break;
        }
      }
    }

    return count;
  }

  public static async part2(input: string): Promise<number> {
    const [rangesSection, _] = input.split("\n\n").map((section) => section.split("\n"));

    const ranges: [number, number][] = rangesSection.map(
      (line) => line.split("-").map(Number) as [number, number]
    );

    ranges.sort((a, b) => a[0] - b[0]);

    const mergedRanges: [number, number][] = [];
    for (const range of ranges) {
      if (mergedRanges.length === 0) {
        mergedRanges.push(range);
        continue;
      }

      const last = mergedRanges[mergedRanges.length - 1];

      if (range[0] > last[1] + 1) {
        mergedRanges.push(range);
      } else {
        if (range[1] > last[1]) {
          last[1] = range[1];
        }
      }
    }

    let count = 0;
    for (const range of mergedRanges) {
      count += range[1] - range[0] + 1;
    }

    return count;
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
