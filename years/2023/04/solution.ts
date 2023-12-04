import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 04
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const cards = input.split("\n");

    let result = 0;

    // Loop through each line
    for (const card of cards) {
      // Parse out all the lotto numbers
      const [, lottoNumbers] = card.split(": ");
      const [winningNumbers, ourNumbers] = lottoNumbers.split(" | ");

      // Create two sets of numbers
      const numbersRegex = /(\d+)/g;
      const winningNumbersSet = new Set(winningNumbers.match(numbersRegex));
      const ourNumbersSet = new Set(ourNumbers.match(numbersRegex));

      // Get the intersection of the two sets
      const intersection = new Set([...winningNumbersSet].filter(x => ourNumbersSet.has(x)));

      // If there is no intersection, continue
      if (intersection.size === 0) continue;

      // Calc the "worth" of the card
      const worth = 2 ** (intersection.size - 1);

      // Add to the result
      result += worth;
    }

    return result;
  }

  public static async part2(input: string): Promise<number> {
    const cards = input.split("\n");

    // Initialize an array to count the number of times each card should be processed
    let cardCounts = new Array(cards.length).fill(1);

    // Loop through each card
    for (let i = 0; i < cards.length; i++) {
      const [, lottoNumbers] = cards[i].split(": ");
      const [winningNumbers, ourNumbers] = lottoNumbers.split(" | ");

      // Create sets for the numbers
      const winningNumbersSet = new Set(winningNumbers.match(/\d+/g));
      const ourNumbersSet = new Set(ourNumbers.match(/\d+/g));

      // Get the intersection of the two sets
      const intersection = new Set([...winningNumbersSet].filter(x => ourNumbersSet.has(x)));

      // For each matching number, increase the count of subsequent cards
      let matches = intersection.size;
      for (let j = i + 1; j <= i + matches && j < cards.length; j++) {
        cardCounts[j] += cardCounts[i];
      }
    }

    // Sum up all the counts
    const totalScratchcards = cardCounts.reduce((sum, count) => sum + count, 0);

    return totalScratchcards;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
