import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2025 - Day 7
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
    const map = create2DArrayFromInput(input) as ("." | "^" | "S")[][];

    // Find starting position 'S'
    const startRow = map.findIndex(row => row.includes("S"));
    if (startRow === -1) throw new Error("No starting position 'S' found");

    const startCol = map[startRow].indexOf("S");

    // Set of active tachyon columns on the current row
    let tachyons = new Set<number>();
    tachyons.add(startCol);

    let splits = 0;

    // Process rows *below* S
    for (let r = startRow + 1; r < map.length; r++) {
      // Snapshot the current tachyons so changes this row
      // don't affect other tachyons in the same row.
      const currentTachyons = Array.from(tachyons);

      for (const t of currentTachyons) {
        const c = map[r][t];

        switch (c) {
          case "^":
            // We hit a splitter: count a split
            splits++;

            // Current beam stops
            tachyons.delete(t);

            // New beams to the left/right (if inside bounds)
            if (t - 1 >= 0) tachyons.add(t - 1);
            if (t + 1 < map[0].length) tachyons.add(t + 1);
            break;

          case ".":
          case "S":
            // Beam continues straight down, nothing to do
            break;
        }
      }
    }

    return splits;
  }

  public static async part2(input: string): Promise<number> {
    const map = create2DArrayFromInput(input) as ("." | "^" | "S")[][];

    // Find starting position 'S'
    const startRow = map.findIndex(row => row.includes("S"));
    if (startRow === -1) throw new Error("No starting position 'S' found");

    const startCol = map[startRow].indexOf("S");
    const width = map[0].length;

    // timelines[c] = how many timelines currently have a beam in column c
    let timelines = new Array<number>(width).fill(0);
    timelines[startCol] = 1; // one particle initially

    // Process rows below S
    for (let r = startRow + 1; r < map.length; r++) {
      const next = new Array<number>(width).fill(0);

      for (let c = 0; c < width; c++) {
        const k = timelines[c];
        if (k === 0) continue;

        const cell = map[r][c];

        switch (cell) {
          case "^":
            // Split each of the k timelines into left and right
            if (c - 1 >= 0) next[c - 1] += k;
            if (c + 1 < width) next[c + 1] += k;
            break;

          case ".":
          case "S":
            // Just keep going straight down
            next[c] += k;
            break;
        }
      }

      timelines = next;
    }

    // Sum of all active timelines after exiting the manifold
    return timelines.reduce((sum, x) => sum + x, 0);
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
