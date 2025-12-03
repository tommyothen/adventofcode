import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 3
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
    const banks = input.split("\n").map((line) =>
      line.split("").map((num) => parseInt(num, 10))
    );

    let answer = 0;
    for (let bank of banks) {
      let tens = bank[0];
      let ones = -1;

      for (let i = 1; i < bank.length; i++) {
        const num = bank[i];

        // If it's the new num is the same as the tens place,
        // replace the ones place with this new num
        if (num === tens) {
          ones = num;

          // If both are 9s, we can stop searching
          if (tens === 9) break;
        }
        // If it's larger than the tens place,
        // replace the tens and reset the ones place
        else if (num > tens) {
          // If we're on the last digit, it cannot be the tens place so it
          // must be the ones place
          if (i === bank.length - 1) {
            ones = num;
            break;
          }

          ones = -1;
          tens = num;
        }
        // If it's between larger than the ones place but smaller than the tens place,
        // replace the ones place with this new num
        else if (num > ones) {
          ones = num;
        }
      }

      const largestJoltage = tens * 10 + ones;
      answer += largestJoltage;
    }

    return answer;
  }

  public static async part2(input: string): Promise<number> {
    const banks = input.split("\n").map((line) =>
      line.split("").map((num) => parseInt(num, 10))
    );

    let answer = 0;

    for (let bank of banks) {
      let toRemove = bank.length - 12;
      const stack: number[] = [];

      for (const digit of bank) {
        // While we still have digits to remove, and the last digit is smaller,
        // pop it so we can bring this bigger digit forward
        while (
          toRemove > 0 &&
          stack.length > 0 &&
          stack[stack.length - 1] < digit
        ) {
          stack.pop();
          toRemove--;
        }
        stack.push(digit);
      }

      // If we still need to remove digits, drop them from the end
      while (toRemove > 0) {
        stack.pop();
        toRemove--;
      }

      const chosenDigits = stack.slice(0, 12);
      const joltage = parseInt(chosenDigits.join(""), 10);
      answer += joltage;
    }

    return answer;
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
