import { prettyPrintResults, product, sum, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 02
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static parseLine(line: string) {
    // Get the game ID
    const gameRegex = /Game (\d+):/;
    const gameID = Number(line.match(gameRegex)?.[1]);
    if (isNaN(gameID)) throw new Error(`Could not parse game ID from line: ${line}`);

    // Split the game outcome in to subsets
    const subsets = line.replace(gameRegex, "").split(";").map(subset => subset.trim());

    // Parse each subset in to an array of rounds, each being a record of the number of each color
    const rounds = subsets.map(subset => {
      const round: Record<Color, number> = { red: 0, green: 0, blue: 0 };

      const roundRegex = /(\d+) (\w+)/g;
      let match;
      while (match = roundRegex.exec(subset)) {
        const [_, count, color] = match;
        round[color as Color] = Number(count);
      }

      return round;
    });

    return { gameID, rounds };
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const games = input.split("\n");
    const colors = ["red", "green", "blue"] as const;

    const maxPossibleCubes = {
      red: 12,
      green: 13,
      blue: 14,
    }

    const possibleGames: Array<number> = [];

    // For each game, parse the input and check if it's a "possible" game
    for (const game of games) {
      const { gameID, rounds } = Solution.parseLine(game);

      // Check if the game is possible
      let possible = true;
      for (const round of rounds) {
        // If any color has more cubes than the max possible, the game is not possible
        for (const color of colors) {
          if (round[color] > maxPossibleCubes[color]) {
            possible = false;
            break;
          }
        }
      }

      // If the game is possible, add it to the list of possible games
      if (possible) possibleGames.push(gameID);
    }

    return sum(possibleGames);
  }

  public static async part2(input: string): Promise<number> {
    const games = input.split("\n");
    const colors = ["red", "green", "blue"] as const;

    let totalPower = 0;

    // For each game, check what the minimum number of cubes are needed
    for (const game of games) {
      const { rounds } = Solution.parseLine(game);

      const summary = rounds.reduce((acc, curr) => {
        // For each color, set the maximum number between the two
        for (const color of colors) {
          acc[color] = Math.max(acc[color], curr[color]);
        }

        return acc;
      }, {
        red: 0,
        green: 0,
        blue: 0,
      });

      // Multiply all the values together to get it's "power"
      const power = product(Object.values(summary));

      // Add the power to the total
      totalPower += power;
    }

    return totalPower;
  }
}

type Color = "red" | "green" | "blue";

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
