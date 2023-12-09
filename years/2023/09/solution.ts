import { prettyPrintResults, sum, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 09
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static calcDifferences(history: number[]): number[] {
    return history.slice(1).map((value, index) => value - history[index]);
  }

  private static predictNextValue(history: number[]): number {
    const sequences = [history];

    // Generate sequences of differences until a sequence of all zeroes is found
    while (sequences.at(-1)!.filter(value => value === 0).length !== sequences.at(-1)!.length) {
      sequences.push(Solution.calcDifferences(sequences.at(-1)!));
    }

    // Work backwards to extrapolate the next value
    for (let i = sequences.length - 2; i >= 0; i--) {
      sequences[i].push(sequences[i].at(-1)! + sequences[i + 1].at(-1)!);
    }

    return sequences[0].at(-1)!;
  }

  private static predictPreviousValue(history: number[]): number {
    const sequences = [history];

    // Generate sequences of differences until a sequence of all zeroes is found
    while (sequences.at(-1)!.filter(value => value === 0).length !== sequences.at(-1)!.length) {
      sequences.push(Solution.calcDifferences(sequences.at(-1)!));
    }

    // Work backwards to extrapolate the previous value
    for (let i = sequences.length - 2; i >= 0; i--) {
      sequences[i].unshift(sequences[i][0] - sequences[i + 1][0]);
    }

    return sequences[0][0];
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const histories = input.split(/\r?\n/).map(line => line.split(" ").map(Number));

    return sum(histories.map(Solution.predictNextValue));
  }

  public static async part2(input: string): Promise<number> {
    const histories = input.split(/\r?\n/).map(line => line.split(" ").map(Number));

    return sum(histories.map(Solution.predictPreviousValue));
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
