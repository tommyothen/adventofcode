import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

// Position in the grid and direction
type Vector2D = [number, Direction];

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
      part2: await timeit(Solution.part2, [input]),
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

  private static getGuardStartPosition(grid: string[][]): [number, number] {
    // Find guard x and y position
    let [x, y] = [-1, -1];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === "^") {
          [x, y] = [i, j];
          break;
        }
      }
    }

    if (x === -1 || y === -1) {
      throw new Error("Guard not found");
    }

    return [x, y];
  }

  public static async part1(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    let [x, y] = Solution.getGuardStartPosition(grid);

    const width = grid[0].length;
    const height = grid.length;
    const posToKey = (x: number, y: number) => y * width + x;
    const isInBounds = (i: number, j: number) =>
      i >= 0 && i < height && j >= 0 && j < width;

    let visited = new Set<number>();
    let facing = Direction.NORTH;

    // Add initial position
    visited.add(posToKey(x, y));

    while (true) {
      // Check if the next position would be in bounds
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      // Check if there is a wall in front of the guard (#)
      if (grid[x + dx][y + dy] === "#") {
        // If there is a wall, turn right
        facing = Solution.NEXT_DIRECTION[facing];
        continue;
      }

      // Move the guard one step forward
      x += dx;
      y += dy;

      // Add new position to visited
      visited.add(posToKey(x, y));
    }

    return visited.size;
  }

  private static isLooping(
    grid: string[][],
    startX: number,
    startY: number
  ): boolean {
    const width = grid[0].length;
    const height = grid.length;
    const posToKey = (x: number, y: number, direction: Direction) =>
      `${x},${y},${direction}`;
    const isInBounds = (i: number, j: number) =>
      i >= 0 && i < height && j >= 0 && j < width;

    let seen = new Set<ReturnType<typeof posToKey>>();
    let [x, y] = [startX, startY];
    let looped = false;

    let facing = Direction.NORTH;

    while (true) {
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      // Fetch what character is in front of the guard
      if (grid[x + dx][y + dy] === "#" || grid[x + dx][y + dy] === "O") {
        const key = posToKey(x + dx, y + dy, facing);

        // Check if we've been here before
        if (seen.has(key)) {
          looped = true;
          break;
        }

        facing = Solution.NEXT_DIRECTION[facing];
        seen.add(key);

        continue;
      }

      // Move the guard one step forward
      x += dx;
      y += dy;
    }
    return looped;
  }

  public static async part2(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    const [startX, startY] = Solution.getGuardStartPosition(grid);
    let [x, y] = [startX, startY];

    let posToKey = (i: number, j: number): number => i * grid[0].length + j;
    let isInBounds = (i: number, j: number) =>
      i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;

    let facing = Direction.NORTH;
    let cache = new Set<number>();
    // While we're tracing the original path.
    while (true) {
      const [dx, dy] = Solution.DIRECTION_DELTAS[facing];
      if (!isInBounds(x + dx, y + dy)) {
        break;
      }

      // Check if there is a wall in front of the guard (#)
      if (grid[x + dx][y + dy] === "#") {
        // If there is a wall, turn right
        facing = Solution.NEXT_DIRECTION[facing];
        continue;
      }

      // Since there's no wall, place a pseudo-wall in front
      const gridCopy = grid.map((row) => row.slice());
      gridCopy[x + dx][y + dy] = "O";

      // Simulate this path
      if (Solution.isLooping(gridCopy, startX, startY)) {
        cache.add(posToKey(x + dx, y + dy));
      }

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
