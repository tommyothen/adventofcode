import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

type Area = number;
type Perimeter = number;
type Corners = number;

type Shape = [Area, Perimeter, Corners];

/**
 * ### Advent of Code 2024 - Day 12
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

  private static explore(input: string): Map<number, Shape> {
    const grid = create2DArrayFromInput(input);
    const width = grid[0].length;

    const visited = new Set<number>();
    const posToIndex = (x: number, y: number) => y * width + x;

    const constructShape = (x: number, y: number, cell: string): Shape => {
      const index = posToIndex(x, y);
      if (visited.has(index)) return [0, 0, 0];
      visited.add(index);

      const neighbours = {
        N: grid[y - 1]?.[x],
        NE: grid[y - 1]?.[x + 1],
        E: grid[y]?.[x + 1],
        SE: grid[y + 1]?.[x + 1],
        S: grid[y + 1]?.[x],
        SW: grid[y + 1]?.[x - 1],
        W: grid[y]?.[x - 1],
        NW: grid[y - 1]?.[x - 1],
      };

      let area = 1;
      let perimeter = 0;
      let corners = 0;
      let neighbourCount = 0;

      // Count corners - keeping the fast direct checks
      if (
        (neighbours.N !== cell && neighbours.E !== cell) ||
        (neighbours.N === cell &&
          neighbours.E === cell &&
          neighbours.NE !== cell)
      )
        corners++;
      if (
        (neighbours.S !== cell && neighbours.E !== cell) ||
        (neighbours.S === cell &&
          neighbours.E === cell &&
          neighbours.SE !== cell)
      )
        corners++;
      if (
        (neighbours.S !== cell && neighbours.W !== cell) ||
        (neighbours.S === cell &&
          neighbours.W === cell &&
          neighbours.SW !== cell)
      )
        corners++;
      if (
        (neighbours.N !== cell && neighbours.W !== cell) ||
        (neighbours.N === cell &&
          neighbours.W === cell &&
          neighbours.NW !== cell)
      )
        corners++;

      // Explore connected cells - using direct condition checks for speed
      if (neighbours.N === cell) {
        const [a, p, c] = constructShape(x, y - 1, cell);
        area += a;
        perimeter += p;
        corners += c;
        neighbourCount++;
      }
      if (neighbours.E === cell) {
        const [a, p, c] = constructShape(x + 1, y, cell);
        area += a;
        perimeter += p;
        corners += c;
        neighbourCount++;
      }
      if (neighbours.S === cell) {
        const [a, p, c] = constructShape(x, y + 1, cell);
        area += a;
        perimeter += p;
        corners += c;
        neighbourCount++;
      }
      if (neighbours.W === cell) {
        const [a, p, c] = constructShape(x - 1, y, cell);
        area += a;
        perimeter += p;
        corners += c;
        neighbourCount++;
      }

      perimeter += 4 - neighbourCount;
      return [area, perimeter, corners];
    };

    const shapes: Map<number, Shape> = new Map();

    // Single pass through to construct the different shape groups
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const index = posToIndex(x, y);
        if (!visited.has(index)) {
          shapes.set(index, constructShape(x, y, grid[y][x]));
        }
      }
    }

    return shapes;
  }

  public static async part1(input: string): Promise<number> {
    const shapes = Solution.explore(input);

    let totalPrice = 0;
    for (const [, [area, perimeter, _]] of shapes) {
      totalPrice += area * perimeter;
    }

    return totalPrice;
  }

  public static async part2(input: string): Promise<number> {
    const shapes = Solution.explore(input);

    let totalPrice = 0;
    for (const [, [area, _, corners]] of shapes) {
      // The number of sides is equal to the number of corners
      totalPrice += area * corners;
    }

    return totalPrice;
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
