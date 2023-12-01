import { reverseString, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 01
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static matchToNum(match: string) {
    switch (match) {
      case "one": case "eno": return 1;
      case "two": case "owt": return 2;
      case "three": case "eerht": return 3;
      case "four": case "ruof": return 4;
      case "five": case "evif": return 5;
      case "six": case "xis": return 6;
      case "seven": case "neves": return 7;
      case "eight": case "thgie": return 8;
      case "nine": case "enin": return 9;
      default: return parseInt(match);
    }
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    let output = 0;

    // Loop over each line of the input
    for (const line of input.split("\n")) {
      let firstNum: number | null = null;
      let lastNum: number | null = null;

      // Loop from beginning and end for efficiency
      for (let i = 0, j = line.length - 1; i < line.length; i++, j--) {
        const char = line[i];
        const char2 = line[j];

        // When first number is found, save it
        if (!firstNum && !isNaN(parseInt(char))) {
          firstNum = parseInt(char);
        }

        // When last number is found, save it
        if (!lastNum && !isNaN(parseInt(char2))) {
          lastNum = parseInt(char2);
        }

        // If both numbers are found, break the loop
        if (firstNum && lastNum) break;
      }

      // If both numbers are found, add them to the output
      if (firstNum && lastNum) {
        output += (firstNum * 10) + lastNum;
      }
    }

    return output;
  }

  public static async part2(input: string): Promise<number> {
    let output = 0;

    const regex = /\d|one|two|three|four|five|six|seven|eight|nine/g
    const regexButBackwards = /\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/g

    // Loop over each line of the input
    for (const line of input.split("\n")) {
      const first = line.match(regex)!.map(Solution.matchToNum);
      const last = reverseString(line).match(regexButBackwards)!.map(Solution.matchToNum);

      // Get the first and last numbers
      const firstNum = first[0];
      const lastNum = last[0];

      // Add the numbers to the output
      output += (firstNum * 10) + lastNum;
    }

    return output;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
