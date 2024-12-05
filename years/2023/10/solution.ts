import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

// Bitmask for each direction
enum Direction {
  NORTH = 0b0001,
  EAST = 0b0010,
  SOUTH = 0b0100,
  WEST = 0b1000,
}

interface Position {
  x: number;
  y: number;
}

/**
 * ### Advent of Code 2023 - Day 10
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

  // Pre-compute position deltas for each direction
  private static readonly DIRECTION_DELTAS: Record<Direction, Position> = {
    [Direction.NORTH]: { x: 0, y: -1 },
    [Direction.SOUTH]: { x: 0, y: 1 },
    [Direction.EAST]: { x: 1, y: 0 },
    [Direction.WEST]: { x: -1, y: 0 },
  };

  // Pre-compute opposite directions
  private static readonly OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.WEST]: Direction.EAST,
  };

  private static readonly CONNECTIONS: Record<string, number> = {
    "|": Direction.NORTH | Direction.SOUTH,
    "-": Direction.EAST | Direction.WEST,
    F: Direction.EAST | Direction.SOUTH,
    "7": Direction.WEST | Direction.SOUTH,
    L: Direction.NORTH | Direction.EAST,
    J: Direction.NORTH | Direction.WEST,
    S: Direction.NORTH | Direction.EAST | Direction.SOUTH | Direction.WEST,
    ".": 0b0000,
  };

  private static findStart(grid: string[][]): Position {
    for (let y = 0; y < grid.length; y++) {
      const x = grid[y].indexOf("S");
      if (x !== -1) return { x, y };
    }
    throw new Error("Start position not found");
  }

  private static getValidDirections(
    grid: string[][],
    start: Position
  ): Direction[] {
    const height = grid.length;
    const width = grid[0].length;
    const validDirs: Direction[] = [];

    for (const dir of [
      Direction.NORTH,
      Direction.EAST,
      Direction.SOUTH,
      Direction.WEST,
    ]) {
      const next = Solution.getNextPosition(start, dir);
      if (next.y >= 0 && next.y < height && next.x >= 0 && next.x < width) {
        const nextPipe = grid[next.y][next.x];
        const oppositeDir = Solution.OPPOSITE_DIRECTIONS[dir];
        if (Solution.CONNECTIONS[nextPipe] & oppositeDir) {
          validDirs.push(dir);
        }
      }
    }
    return validDirs;
  }

  private static getNextPosition(pos: Position, dir: Direction): Position {
    const delta = Solution.DIRECTION_DELTAS[dir];
    return { x: pos.x + delta.x, y: pos.y + delta.y };
  }

  public static async part1(input: string): Promise<number> {
    const grid = input.split("\n").map((line) => line.trim().split(""));
    const start = Solution.findStart(grid);
    const validDirs = Solution.getValidDirections(grid, start);

    // Follow both paths until they meet
    let steps = 1;
    let pos1 = Solution.getNextPosition(start, validDirs[0]);
    let pos2 = Solution.getNextPosition(start, validDirs[1]);
    let dir1 = validDirs[0];
    let dir2 = validDirs[1];

    while (pos1.x !== pos2.x || pos1.y !== pos2.y) {
      steps++;
      const next1 =
        Solution.CONNECTIONS[grid[pos1.y][pos1.x]] &
        ~Solution.OPPOSITE_DIRECTIONS[dir1];
      const next2 =
        Solution.CONNECTIONS[grid[pos2.y][pos2.x]] &
        ~Solution.OPPOSITE_DIRECTIONS[dir2];

      dir1 = next1;
      dir2 = next2;
      pos1 = Solution.getNextPosition(pos1, dir1);
      pos2 = Solution.getNextPosition(pos2, dir2);
    }

    return steps;
  }

  public static async part2(input: string): Promise<number> {
    const grid = input.split("\n").map((line) => line.trim().split(""));
    const height = grid.length;
    const width = grid[0].length;
    const start = Solution.findStart(grid);
    const validDirs = Solution.getValidDirections(grid, start);

    // Pre-calculate the actual pipe type for S
    const startConnections = validDirs.reduce((acc, dir) => acc | dir, 0);
    const actualS =
      Object.entries(Solution.CONNECTIONS).find(
        ([_, conn]) => conn === startConnections
      )?.[0] || "S";
    grid[start.y][start.x] = actualS;

    // Used to use `${start.x},${start.y}` as key, but numbers are faster
    const visited = new Set<number>();
    const posToKey = (x: number, y: number) => y * width + x;

    let pos1 = Solution.getNextPosition(start, validDirs[0]);
    let pos2 = Solution.getNextPosition(start, validDirs[1]);
    let dir1 = validDirs[0];
    let dir2 = validDirs[1];

    visited.add(posToKey(start.x, start.y));
    visited.add(posToKey(pos1.x, pos1.y));
    visited.add(posToKey(pos2.x, pos2.y));

    // Trace the loop
    while (pos1.x !== pos2.x || pos1.y !== pos2.y) {
      const next1 =
        Solution.CONNECTIONS[grid[pos1.y][pos1.x]] &
        ~Solution.OPPOSITE_DIRECTIONS[dir1];
      const next2 =
        Solution.CONNECTIONS[grid[pos2.y][pos2.x]] &
        ~Solution.OPPOSITE_DIRECTIONS[dir2];

      dir1 = next1;
      dir2 = next2;
      pos1 = Solution.getNextPosition(pos1, dir1);
      pos2 = Solution.getNextPosition(pos2, dir2);

      visited.add(posToKey(pos1.x, pos1.y));
      visited.add(posToKey(pos2.x, pos2.y));
    }

    // Count enclosed tiles using optimized ray casting
    let result = 0;

    for (let row = 0; row < height; row++) {
      let inside = false;
      let lastCorner = "";

      for (let col = 0; col < width; col++) {
        if (visited.has(posToKey(col, row))) {
          const currentPipe = grid[row][col];

          if (currentPipe === "|") {
            inside = !inside;
          } else if (currentPipe === "F" || currentPipe === "L") {
            lastCorner = currentPipe;
          } else if (
            (currentPipe === "7" && lastCorner === "L") ||
            (currentPipe === "J" && lastCorner === "F")
          ) {
            inside = !inside;
            lastCorner = "";
          }
        } else if (inside) {
          result++;
        }
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
