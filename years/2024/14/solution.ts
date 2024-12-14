import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 14
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
    const regex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g;

    const time = 100;
    const width = 101;
    const height = 103;

    const middleRow = Math.floor(height / 2);
    const middleCol = Math.floor(width / 2);

    const quadrants = { NE: 0, SE: 0, SW: 0, NW: 0 };

    for (const match of input.matchAll(regex)) {
      let [, px, py, vx, vy] = match.map(Number);

      // If the velocity is negative, make it positive
      if (vx < 0) vx = width + vx;
      if (vy < 0) vy = height + vy;

      const finalX = (px + vx * time) % width;
      const finalY = (py + vy * time) % height;

      // Ignore if the points are in the middle
      if (finalX === middleCol || finalY === middleRow) continue;

      // Determine the quadrant
      if (finalX > middleCol && finalY < middleRow) {
        quadrants.NE++;
      } else if (finalX > middleCol && finalY > middleRow) {
        quadrants.SE++;
      } else if (finalX < middleCol && finalY > middleRow) {
        quadrants.SW++;
      } else if (finalX < middleCol && finalY < middleRow) {
        quadrants.NW++;
      }
    }

    return quadrants.NE * quadrants.SE * quadrants.SW * quadrants.NW;
  }

  public static async part2(input: string): Promise<number> {
    const regex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g;

    const width = 101;
    const height = 103;

    const robots: Array<
      [
        number, // px
        number, // py
        number, // vx
        number // vy
      ]
    > = [];

    for (const match of input.matchAll(regex)) {
      let [, px, py, vx, vy] = match.map(Number);

      // If the velocity is negative, make it positive
      if (vx < 0) vx = width + vx;
      if (vy < 0) vy = height + vy;

      // Add the robot to the list
      robots.push([px, py, vx, vy]);
    }

    // Since all the horizontal and vertical movements repeat,
    // we only have to check the first width * height iterations
    const MAX_ITERATIONS = width * height;

    const posToIndex = (x: number, y: number) => x * width + y;
    const indexToPos = (index: number) => [
      Math.floor(index / width),
      index % width,
    ];

    function checkSquare(positions: Set<number>) {
      positionLoop: for (const pos of positions) {
        const [x, y] = indexToPos(pos);

        for (let i = -3; i <= 3; i++) {
          for (let j = -3; j <= 3; j++) {
            if (!positions.has(posToIndex(x + i, y + j))) {
              continue positionLoop;
            }
          }

          return true;
        }

        return false;
      }
    }

    // Try and find a pattern where there is a 7x7 square of robots
    // and that's probably the final answer
    for (let i = 0; i <= MAX_ITERATIONS; i++) {
      const finalPositions = new Set<number>();

      for (const [px, py, vx, vy] of robots) {
        const finalX = (px + vx * i) % width;
        const finalY = (py + vy * i) % height;

        finalPositions.add(posToIndex(finalX, finalY));
      }

      if (checkSquare(finalPositions)) {
        return i;
      }
    }

    return -1;
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
