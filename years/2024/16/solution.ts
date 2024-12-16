import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

interface Position {
  x: number;
  y: number;
  direction: number;
}

interface QueueItem {
  cost: number;
  pos: Position;
}

/**
 * ### Advent of Code 2024 - Day 16
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

  private static manhattanDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  private static getTurnCost(currentDir: number, newDir: number): number {
    const turns = Math.min(
      (newDir - currentDir + 4) % 4,
      (currentDir - newDir + 4) % 4
    );

    return turns * 1000;
  }

  public static async part1(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    const width = grid[0].length;

    const indexToPos = (index: number) => [
      index % width,
      Math.floor(index / width),
    ];

    const [startX, startY] = indexToPos(grid.flat().indexOf("S"));
    const [endX, endY] = indexToPos(grid.flat().indexOf("E"));

    // Modified A* algorithm
    function findPathCost(
      grid: string[][],
      start: [number, number],
      end: [number, number]
    ): number {
      const directions: Array<[number, number]> = [
        [0, -1], // North
        [1, 0], // East
        [0, 1], // South
        [-1, 0], // West
      ];

      // Start facing East
      const startPos: Position = { x: start[0], y: start[1], direction: 1 };
      const frontier: QueueItem[] = [{ cost: 0, pos: startPos }];

      const costSoFar = new Map<string, number>();
      const posToKey = (pos: Position) =>
        `${pos.x},${pos.y},${pos.direction}` as const;

      costSoFar.set(posToKey(startPos), 0);
      let lowestEndCost = Infinity;

      while (frontier.length > 0) {
        const current = frontier.shift()!.pos;
        const currentCost = costSoFar.get(posToKey(current))!;

        // If we reached the end, update lowest cost if this path is cheaper
        if (current.x === end[0] && current.y === end[1]) {
          lowestEndCost = Math.min(lowestEndCost, currentCost);
          continue;
        }

        directions.forEach(([dx, dy], newDir) => {
          const nextX = current.x + dx;
          const nextY = current.y + dy;

          if (
            nextX >= 0 &&
            nextX < grid[0].length &&
            nextY >= 0 &&
            nextY < grid.length &&
            grid[nextY][nextX] !== "#"
          ) {
            const nextPos: Position = {
              x: nextX,
              y: nextY,
              direction: newDir,
            };

            const movementCost = 1;
            const turnCost = Solution.getTurnCost(current.direction, newDir);
            const newCost = currentCost + movementCost + turnCost;

            const nextPosKey = posToKey(nextPos);
            if (
              !costSoFar.has(nextPosKey) ||
              newCost < costSoFar.get(nextPosKey)!
            ) {
              costSoFar.set(nextPosKey, newCost);
              const priority =
                newCost +
                Solution.manhattanDistance(nextX, nextY, end[0], end[1]);

              const insertIndex = frontier.findIndex(
                (item) => item.cost > priority
              );
              if (insertIndex === -1) {
                frontier.push({ cost: priority, pos: nextPos });
              } else {
                frontier.splice(insertIndex, 0, {
                  cost: priority,
                  pos: nextPos,
                });
              }
            }
          }
        });
      }

      return lowestEndCost;
    }

    return findPathCost(grid, [startX, startY], [endX, endY]);
  }

  public static async part2(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    const width = grid[0].length;

    const indexToPos = (index: number) => [
      index % width,
      Math.floor(index / width),
    ];

    const [startX, startY] = indexToPos(grid.flat().indexOf("S"));
    const [endX, endY] = indexToPos(grid.flat().indexOf("E"));

    function findAllOptimalPaths(
      grid: string[][],
      start: [number, number],
      end: [number, number]
    ): number {
      const directions: Array<[number, number]> = [
        [0, -1], // North
        [1, 0], // East
        [0, 1], // South
        [-1, 0], // West
      ];

      // Start facing East
      const startPos: Position = { x: start[0], y: start[1], direction: 1 };
      const frontier: QueueItem[] = [{ cost: 0, pos: startPos }];

      const costSoFar = new Map<string, number>();
      const parents = new Map<string, Set<string>>();
      const optimalTiles = new Set<string>();

      const posToKey = (pos: Position) =>
        `${pos.x},${pos.y},${pos.direction}` as const;
      const tileKey = (x: number, y: number) => `${x},${y}` as const;

      costSoFar.set(posToKey(startPos), 0);
      let minEndCost = Infinity;

      // Forward pass to find minimum cost
      while (frontier.length > 0) {
        const current = frontier.shift()!.pos;
        const currentKey = posToKey(current);
        const currentCost = costSoFar.get(currentKey)!;

        // If we've exceeded our best path, skip
        if (currentCost > minEndCost) continue;

        // If we reached the end
        if (current.x === end[0] && current.y === end[1]) {
          if (currentCost < minEndCost) {
            minEndCost = currentCost;
          }
          continue;
        }

        directions.forEach(([dx, dy], newDir) => {
          const nextX = current.x + dx;
          const nextY = current.y + dy;

          if (
            nextX >= 0 &&
            nextX < grid[0].length &&
            nextY >= 0 &&
            nextY < grid.length &&
            grid[nextY][nextX] !== "#"
          ) {
            const nextPos: Position = {
              x: nextX,
              y: nextY,
              direction: newDir,
            };

            const movementCost = 1;
            const turnCost = Solution.getTurnCost(current.direction, newDir);
            const newCost = currentCost + movementCost + turnCost;
            const nextKey = posToKey(nextPos);

            // Track equal cost paths
            if (!costSoFar.has(nextKey) || newCost <= costSoFar.get(nextKey)!) {
              if (newCost === costSoFar.get(nextKey)) {
                // Add another parent for this equal cost path
                if (!parents.has(nextKey)) {
                  parents.set(nextKey, new Set());
                }
                parents.get(nextKey)!.add(currentKey);
              } else {
                // New best path to this position
                costSoFar.set(nextKey, newCost);
                parents.set(nextKey, new Set([currentKey]));
                frontier.push({ cost: newCost, pos: nextPos });
              }
            }
          }
        });
      }

      // Backtrack from end to collect all positions on optimal paths
      function collectOptimalPaths(pos: Position) {
        const key = posToKey(pos);
        optimalTiles.add(tileKey(pos.x, pos.y));

        const parentSet = parents.get(key);
        if (!parentSet) return;

        for (const parentKey of parentSet) {
          const [x, y, dir] = parentKey.split(",").map(Number);
          collectOptimalPaths({ x, y, direction: dir });
        }
      }

      // Collect from all end positions with minimum cost
      directions.forEach((_, dir) => {
        const endPos: Position = { x: end[0], y: end[1], direction: dir };
        const endKey = posToKey(endPos);
        if (costSoFar.get(endKey) === minEndCost) {
          collectOptimalPaths(endPos);
        }
      });

      return optimalTiles.size;
    }

    return findAllOptimalPaths(grid, [startX, startY], [endX, endY]);
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
