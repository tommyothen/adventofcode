import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 2
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
    let result = 0;

    for (const line of input.split("\n")) {
      const nums = line.split(" ").map(Number);

      const direction: "up" | "down" = nums[1] > nums[0] ? "up" : "down";

      let safe = 0;
      for (let i = 0; i < nums.length - 1; i++) {
        const diff = Math.abs(nums[i + 1] - nums[i]);

        if (direction === "up" && nums[i + 1] > nums[i]) {
          if (diff > 0 && diff <= 3) {
            safe++;
          }
        } else if (direction === "down" && nums[i + 1] < nums[i]) {
          if (diff > 0 && diff <= 3) {
            safe++;
          }
        }
      }

      if (safe === nums.length - 1) {
        result++;
      }
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    let result = 0;

    for (const line of input.split("\n")) {
      const nums = line.split(" ").map(Number);

      const direction: "up" | "down" = nums[1] > nums[0] ? "up" : "down";

      let safe = 0;
      for (let i = 0; i < nums.length - 1; i++) {
        const diff = Math.abs(nums[i + 1] - nums[i]);

        if (direction === "up" && nums[i + 1] > nums[i]) {
          if (diff > 0 && diff <= 3) {
            safe++;
          }
        } else if (direction === "down" && nums[i + 1] < nums[i]) {
          if (diff > 0 && diff <= 3) {
            safe++;
          }
        }
      }

      if (safe === nums.length - 1 || safe === nums.length - 2) {
        result++;
      }
    }

    return result;
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
