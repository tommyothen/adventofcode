import { create2DArrayFromInput, prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

enum Char {
  WALL = "#",
  EMPTY = ".",
  BOX = "O",

  WIDEBOX_LEFT = "[",
  WIDEBOX_RIGHT = "]",
}

/**
 * ### Advent of Code 2024 - Day 15
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
    const [map, path] = input.split("\n\n");

    const grid = create2DArrayFromInput(map);
    const width = grid[0].length;

    const indexToPos = (i: number) => [i % width, Math.floor(i / width)];
    const isInBounds = (x: number, y: number) =>
      x >= 0 && x < width && y >= 0 && y < grid.length;

    const [startX, startY] = indexToPos(grid.flat().indexOf("@"));
    let [x, y] = [startX, startY];

    // Set the starting position to an empty space (.)
    grid[y][x] = Char.EMPTY;

    const recursivePush = (
      x: number,
      y: number,
      dx: number,
      dy: number
    ): boolean => {
      const [newX, newY] = [x + dx, y + dy];

      // Check if it's out of bounds
      if (!isInBounds(newX, newY)) return false;

      // Check what character is in the new position
      const nextChar = grid[newY][newX];

      switch (nextChar) {
        case Char.EMPTY:
          // If it's an empty space, place a box there
          grid[newY][newX] = Char.BOX;
          return true;
        case Char.BOX:
          // If it's a box, we need to recursively go down
          // the stack until we find an empty space or a wall
          return recursivePush(newX, newY, dx, dy);
        case Char.WALL:
          // If it's a wall, we can't push the box
          return false;
      }

      // If we reach this point, it means we hit an edge case
      throw new Error(`Invalid character: ${nextChar}`);
    };

    const move = (dx: number, dy: number) => {
      const [newX, newY] = [x + dx, y + dy];

      // Check if it's out of bounds
      if (!isInBounds(newX, newY)) throw new Error("Out of bounds");

      // Check what character is in the new position
      const nextChar = grid[newY][newX];

      switch (nextChar) {
        case Char.EMPTY:
          // If it's an empty space, move there
          x = newX;
          y = newY;
          break;
        case Char.BOX:
          // If it's a box, we need to push it and
          // any boxes that are in front of it
          const canMove = recursivePush(newX, newY, dx, dy);

          if (canMove) {
            // If we were able to move the box, move the player and set the position as an empty space
            x = newX;
            y = newY;

            grid[y][x] = Char.EMPTY;
          }
      }
    };

    for (const char of path) {
      switch (char) {
        case "^":
          move(0, -1);
          break;
        case "v":
          move(0, 1);
          break;
        case "<":
          move(-1, 0);
          break;
        case ">":
          move(1, 0);
          break;
      }
    }

    // Go over the grid
    let total = 0;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === Char.BOX) {
          total += 100 * row + col;
        }
      }
    }

    return total;
  }

  public static async part2(input: string): Promise<number> {
    const [mapRaw, path] = input.split("\n\n");

    // Double the characters in the map
    const map = mapRaw.replace(/[#O.@]/g, (match) => {
      switch (match) {
        case Char.WALL:
          return "##";
        case Char.BOX:
          return "[]";
        case Char.EMPTY:
          return "..";
        case "@":
          return "@.";
      }
      throw new Error(`Invalid character: ${match}`);
    });

    const grid = map.split("\n").map((line) => line.split(""));
    const height = grid.length;
    const width = grid[0].length;

    const posToIndex = (x: number, y: number) => y * width + x;
    const indexToPos = (i: number) => [i % width, Math.floor(i / width)];
    const isInBounds = (x: number, y: number) =>
      x >= 0 && x < width && y >= 0 && y < height;

    // Find the start position
    let [x, y] = indexToPos(grid.flat().indexOf("@"));
    grid[y][x] = Char.EMPTY;

    // Find all connected boxes from a starting position
    const findConnectedBoxes = (
      startX: number,
      startY: number,
      dx: number,
      dy: number
    ): Set<number> => {
      const queue: Array<[number, number]> = [[startX, startY]];
      const seen = new Set<number>();

      while (queue.length > 0) {
        const [currX, currY] = queue.shift()!;
        const key = posToIndex(currX, currY);

        if (seen.has(key)) continue;
        seen.add(key);

        const nextX = currX + dx;
        const nextY = currY + dy;

        if (!isInBounds(nextX, nextY) || grid[nextY][nextX] === Char.WALL) {
          // Can't push any of the boxes if we hit a wall
          seen.clear();
          break;
        }

        if (grid[currY][currX] === Char.WIDEBOX_LEFT) {
          // Add right part of box
          queue.push([currX + 1, currY]);
          // Add any connected box in push direction
          if (
            grid[nextY][nextX] === Char.WIDEBOX_LEFT ||
            grid[nextY][nextX] === Char.WIDEBOX_RIGHT
          ) {
            queue.push([nextX, nextY]);
          }
        } else if (grid[currY][currX] === Char.WIDEBOX_RIGHT) {
          // Add left part of box
          queue.push([currX - 1, currY]);
          // Add any connected box in push direction
          if (
            grid[nextY][nextX] === Char.WIDEBOX_LEFT ||
            grid[nextY][nextX] === Char.WIDEBOX_RIGHT
          ) {
            queue.push([nextX, nextY]);
          }
        }
      }

      return seen;
    };

    // Move boxes in order (far to near)
    const moveBoxes = (boxes: Set<number>, dx: number, dy: number) => {
      const boxArray = Array.from(boxes).map((pos) => {
        const [x, y] = indexToPos(pos);
        return { x, y };
      });

      // Sort boxes from farthest to nearest in the direction of movement
      boxArray.sort((a, b) => {
        if (dx > 0) return b.x - a.x;
        if (dx < 0) return a.x - b.x;
        if (dy > 0) return b.y - a.y;
        return a.y - b.y;
      });

      // Move each box
      for (const box of boxArray) {
        const char = grid[box.y][box.x];
        grid[box.y][box.x] = Char.EMPTY;
        grid[box.y + dy][box.x + dx] = char;
      }
    };

    const move = (dx: number, dy: number) => {
      const newX = x + dx;
      const newY = y + dy;

      if (!isInBounds(newX, newY) || grid[newY][newX] === Char.WALL) {
        return;
      }

      if (grid[newY][newX] === Char.EMPTY) {
        x = newX;
        y = newY;
        return;
      }

      // Found a box, check if we can push it
      const connectedBoxes = findConnectedBoxes(newX, newY, dx, dy);

      if (connectedBoxes.size > 0) {
        // Move was valid, execute it
        moveBoxes(connectedBoxes, dx, dy);
        x = newX;
        y = newY;
      }
    };

    // Process all moves
    for (const char of path) {
      switch (char) {
        case "^":
          move(0, -1);
          break;
        case "v":
          move(0, 1);
          break;
        case "<":
          move(-1, 0);
          break;
        case ">":
          move(1, 0);
          break;
      }
    }

    // Calculate score
    let total = 0;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (grid[row][col] === Char.WIDEBOX_LEFT) {
          total += 100 * row + col;
        }
      }
    }

    return total;
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
