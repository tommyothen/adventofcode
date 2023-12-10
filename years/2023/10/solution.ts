import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 10
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  // Method provides no value to the solution, but it's a nicer way to visualize puzzle input for me.
  public static prettyInput(input: string): string {
    return input
      .replace(/-/g, "─")
      .replace(/\|/g, "│")
      .replace(/F/g, "┌")
      .replace(/7/g, "┐")
      .replace(/L/g, "└")
      .replace(/J/g, "┘")
      .replace(/\./g, " ");
  }

  public static async solve() {
    const input = Solution.prettyInput(await Solution.input);

    return {
      part1: await timeit(Solution.part1, [input], 0),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    // Find the starting point and translate it to a 2D array index.
    const start = input.indexOf("S");

    const lineLength =
      input.search("\r\n") === -1
        ? input.search("\n") + 1
        : input.search("\r\n") + 2;

    const [startX, startY] = [start % lineLength, Math.floor(start / lineLength)];

    // Recursively follow each path until we reach a full loop.
    const distances = new Map<`${number},${number}`, number>([[`${startX},${startY}`, 0]]);

    const followPath = (x: number, y: number, distance: number): void => {
      const key = `${x},${y}` as const;

      // Check if we've already been here with a shorter or equal path.
      if (distance !== 0 && (distances.has(key) && distances.get(key)! <= distance)) {
        return; // No need to update or continue from here.
      }

      // Update the distance for this cell.
      distances.set(key, distance);

      // Check the four directions for a path and follow it.
      const up = input[(y - 1) * lineLength + x];
      const down = input[(y + 1) * lineLength + x];
      const left = input[y * lineLength + x - 1];
      const right = input[y * lineLength + x + 1];

      // Check the current cell for a path.
      const currentChar = input[y * lineLength + x];
      switch (currentChar) {
        case "┌":
          // Only go down or right.
          if (["└", "┘", "│"].includes(down)) followPath(x, y + 1, distance + 1);
          if (["┐", "┘", "─"].includes(right)) followPath(x + 1, y, distance + 1);
          break;
        case "┐":
          // Only go down or left.
          if (["└", "┘", "│"].includes(down)) followPath(x, y + 1, distance + 1);
          if (["┌", "└", "─"].includes(left)) followPath(x - 1, y, distance + 1);
          break;
        case "└":
          // Only go up or right.
          if (["┌", "┐", "│"].includes(up)) followPath(x, y - 1, distance + 1);
          if (["┐", "┘", "─"].includes(right)) followPath(x + 1, y, distance + 1);
          break;
        case "┘":
          // Only go up or left.
          if (["┌", "┐", "│"].includes(up)) followPath(x, y - 1, distance + 1);
          if (["┌", "└", "─"].includes(left)) followPath(x - 1, y, distance + 1);
          break;
        case "│":
          // Only go up or down.
          if (["┌", "┐", "│"].includes(up)) followPath(x, y - 1, distance + 1);
          if (["└", "┘", "│"].includes(down)) followPath(x, y + 1, distance + 1);
          break;
        case "─":
          // Only go left or right.
          if (["┌", "└", "─"].includes(left)) followPath(x - 1, y, distance + 1);
          if (["┐", "┘", "─"].includes(right)) followPath(x + 1, y, distance + 1);
          break;

        // Special case "S" - can go in any direction on the first move.
        case "S":
          if (distance !== 0) return;

          if (["┌", "┐", "│"].includes(up)) followPath(x, y - 1, distance + 1);
          if (["└", "┘", "│"].includes(down)) followPath(x, y + 1, distance + 1);
          if (["┌", "└", "─"].includes(left)) followPath(x - 1, y, distance + 1);
          if (["┐", "┘", "─"].includes(right)) followPath(x + 1, y, distance + 1);
          break;
        default:
          break;
      }
    }

    // Start the recursive function.
    followPath(startX, startY, 0);

    // Find the longest distance.
    return Math.max(...distances.values());
  }

  public static async part2(input: string): Promise<number> {
    return 0;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
