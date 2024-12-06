import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

enum CharCode {
  WALL = 35,
  GUARD = 94,
  EMPTY = 46,
  NEW_LINE = 10,
}

/**
 * ### Advent of Code 2024 - Day 6
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(
    resolve(import.meta.dir, "./input.txt")
  ).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input], 1),
    };
  }

  private static readonly DIRECTION_DELTAS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ] as const;

  private static readonly NEXT_DIRECTION = {
    [Direction.NORTH]: Direction.EAST,
    [Direction.EAST]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.WEST,
    [Direction.WEST]: Direction.NORTH,
  };

  public static async part1(input: string): Promise<number> {
    const grid = new Int8Array(input.length);
    let idx = 0;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      if (c !== CharCode.NEW_LINE) {
        grid[idx++] = c;
      }
    }

    const length = idx;
    const width = input.indexOf("\n");
    const height = length / width;

    const startPos = grid.indexOf(CharCode.GUARD);
    if (startPos === -1) throw new Error("Guard not found");

    const startX = Math.floor(startPos / width);
    const startY = startPos % width;
    let [x, y] = [startX, startY];

    const posToFlat = (i: number, j: number) => i * width + j;
    const isInBounds = (i: number, j: number) =>
      i >= 0 && i < height && j >= 0 && j < width;

    let visited = new Set<number>();
    let facing = Direction.NORTH;

    // Add initial position
    visited.add(posToFlat(x, y));

    while (true) {
      // Check if the next position would be in bounds
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      // Check if there is a wall in front of the guard (#)
      if (grid[posToFlat(x + dx, y + dy)] === CharCode.WALL) {
        // If there is a wall, turn right
        facing = Solution.NEXT_DIRECTION[facing];
        continue;
      }

      // Move the guard one step forward
      x += dx;
      y += dy;

      // Add new position to visited
      visited.add(posToFlat(x, y));
    }

    return visited.size;
  }

  private static isLooping(
    grid: Int8Array,
    width: number,
    height: number,
    startX: number,
    startY: number
  ): boolean {
    const posToFlat = (i: number, j: number) => i * width + j;
    // Since our flat position will never exceed 16900 (130*130),
    // we can safely use the top 2 bits for direction by shifting left 16
    const encodePosition = (flatPos: number, direction: Direction): number =>
      (direction << 16) | flatPos;

    const isInBounds = (i: number, j: number) =>
      i >= 0 && i < height && j >= 0 && j < width;

    let seen = new Set<number>();
    let [x, y] = [startX, startY];
    let facing = Direction.NORTH;

    while (true) {
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      if (
        grid[posToFlat(x + dx, y + dy)] === CharCode.WALL
      ) {
        const key = encodePosition(posToFlat(x, y), facing);
        if (seen.has(key)) {
          return true;
        }
        facing = Solution.NEXT_DIRECTION[facing];
        seen.add(key);
        continue;
      }
      x += dx;
      y += dy;
    }

    return false;
  }

  public static async part2(input: string): Promise<number> {
    const grid = new Int8Array(input.length);
    let idx = 0;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      if (c !== CharCode.NEW_LINE) {
        grid[idx++] = c;
      }
    }

    const length = idx;
    const width = input.indexOf("\n");
    const height = length / width;

    const startPos = grid.indexOf(CharCode.GUARD);
    if (startPos === -1) throw new Error("Guard not found");
    const startX = Math.floor(startPos / width);
    const startY = startPos % width;
    let [x, y] = [startX, startY];

    const posToKey = (i: number, j: number): number => i * width + j;
    const isInBounds = (i: number, j: number) =>
      i >= 0 && i < grid.length && j >= 0 && j < width;

    let facing = Direction.NORTH;
    let cache = new Set<number>();

    // While we're tracing the original path.
    while (true) {
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      // Check if there is a wall in front of the guard (#)
      const dKey = posToKey(x + dx, y + dy);
      const char = grid[dKey];
      if (char === CharCode.WALL) {
        // If there is a wall, turn right
        facing = Solution.NEXT_DIRECTION[facing];
        continue;
      }

      // If we've tried this wall, we can skip it
      if (cache.has(dKey)) {
        // Move forward
        x += dx;
        y += dy;
        continue;
      }

      // Since there's no wall, place a pseudo-wall in front
      grid[dKey] = CharCode.WALL;

      // Simulate this path
      if (Solution.isLooping(grid, width, height, startX, startY)) {
        cache.add(dKey);
      }

      grid[dKey] = CharCode.EMPTY;

      // Move forward
      x += dx;
      y += dy;
    }

    return cache.size;
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
