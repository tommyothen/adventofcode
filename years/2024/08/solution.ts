import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

type Coordinates = [number, number];

/**
 * ### Advent of Code 2024 - Day 8
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

  private static fetchNodeLocations(
    grid: string[][]
  ): Map<string, Coordinates[]> {
    // const nodeRegex = /(\w)/g;
    const nodeLocations = new Map<string, Array<Coordinates>>();

    // Find all the nodes in the grid and mark their locations
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];

      for (let x = 0; x < row.length; x++) {
        const node = row[x];

        // if (node.match(nodeRegex)) {
        if (node !== ".") {
          if (!nodeLocations.has(node)) {
            nodeLocations.set(node, [[x, y]]);
          } else {
            nodeLocations.get(node)?.push([x, y]);
          }
        }
      }
    }

    return nodeLocations;
  }

  public static async part1(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    const width = grid[0].length;
    const height = grid.length;

    const withinBounds = (x: number, y: number) =>
      x >= 0 && x < width && y >= 0 && y < height;
    const posToKey = (x: number, y: number): number => y * width + x;

    const nodeLocations = Solution.fetchNodeLocations(grid);

    let antinodes = new Set<number>();
    for (const [_, locations] of nodeLocations.entries()) {
      if (locations.length < 2) continue;

      // Compare each pair of node locations
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          const [x1, y1] = locations[i];
          const [x2, y2] = locations[j];

          // Get the distance between each of the nodes
          const [dx, dy] = [x2 - x1, y2 - y1];

          // Calc the antinodes
          const fstAnti = [x1 - dx, y1 - dy] as const;
          const sndAnti = [x2 + dx, y2 + dy] as const;

          // Add the antinode position if it's within bounds
          if (withinBounds(...fstAnti)) antinodes.add(posToKey(...fstAnti));
          if (withinBounds(...sndAnti)) antinodes.add(posToKey(...sndAnti));
        }
      }
    }

    return antinodes.size;
  }

  public static async part2(input: string): Promise<number> {
    const grid = create2DArrayFromInput(input);
    const width = grid[0].length;
    const height = grid.length;

    const withinBounds = (x: number, y: number) =>
      x >= 0 && x < width && y >= 0 && y < height;
    const posToKey = (x: number, y: number): number => y * width + x;

    const nodeLocations = Solution.fetchNodeLocations(grid);

    let antinodes = new Set<number>();
    for (const [_, locations] of nodeLocations.entries()) {
      if (locations.length < 2) continue;

      // Compare each pair of node locations
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          const [x1, y1] = locations[i];
          const [x2, y2] = locations[j];

          // The nodes can be antinodes
          antinodes.add(posToKey(x1, y1));
          antinodes.add(posToKey(x2, y2));

          // Get the distance between each of the nodes
          const [dx, dy] = [x2 - x1, y2 - y1];

          // Calc one direction of antinodes
          let [x, y] = [x1 - dx, y1 - dy];

          while (withinBounds(x, y)) {
            antinodes.add(posToKey(x, y));
            x -= dx;
            y -= dy;
          }

          // Calc the other direction of antinodes
          [x, y] = [x2 + dx, y2 + dy];

          while (withinBounds(x, y)) {
            antinodes.add(posToKey(x, y));
            x += dx;
            y += dy;
          }
        }
      }
    }

    return antinodes.size;
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
