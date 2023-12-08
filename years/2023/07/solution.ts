import { prettyPrintResults, splitLines, timeit, sum } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 07
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static getCardRanking(card: string, jokerRule = false) {
    const ranks = jokerRule ? "J23456789TQKA" : "23456789TJQKA";
    return ranks.indexOf(card[0]);
  }

  private static getHandType(cards: number[], jokerRule = false): HandType {
    const counts = cards.reduce((acc, card) => {
      acc[card] = (acc[card] || 0) + 1;
      return acc;
    }, Array(13).fill(0) as number[]);

    if (jokerRule) {
      const jokers = counts.shift()!;
      counts[counts.indexOf(Math.max(...counts))] += jokers;
    }

    if (counts.includes(5)) return HandType["Five of a Kind"];
    if (counts.includes(4)) return HandType["Four of a Kind"];
    if (counts.includes(3) && counts.includes(2)) return HandType["Full House"];
    if (counts.includes(3)) return HandType["Three of a Kind"];
    if (counts.filter((count) => count === 2).length === 2) return HandType["Two Pair"];
    if (counts.includes(2)) return HandType["One Pair"];
    return HandType["High Card"];
  }

  /**
   * Compare two hands, returning a number representing the comparison.
   * - `< 0` if `a > b`
   * - `> 0` if `a < b`
   * - `0` if `a == b`
   */
  private static compareHands(a: Ranking, b: Ranking): number {
    const [aType, aCards] = a;
    const [bType, bCards] = b;

    // If the hand types are different, return the difference
    if (aType !== bType) return aType - bType;

    // If the hand types are the same, compare the individual cards
    for (let i = 0; i < aCards.length; i++) {
      if (aCards[i] !== bCards[i]) return aCards[i] - bCards[i];
    }

    // If the cards are the same, return 0
    return 0;
  }

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    }
  }

  public static async part1(input: string): Promise<number> {
    const lines = splitLines(input);

    const rankings: Array<Ranking> = [];

    // Process each line into a ranking
    for (const line of lines) {
      const [cards, bid] = line.split(" ");

      // Transform the cards in to a list of card strengths
      const cardStrengths = cards.split("").map((card) => Solution.getCardRanking(card));

      // Get the hand type and add it to the rankings
      const handType = Solution.getHandType(cardStrengths);
      rankings.push([handType, cardStrengths, Number(bid)]);
    }

    // Sort the rankings by hand type, then individual card strengths
    const sortedRankings = rankings.sort(Solution.compareHands);

    // Sum the bid * rank for each hand
    return sum(sortedRankings.map((r, i) => (i + 1) * r[2]));
  }

  public static async part2(input: string): Promise<number> {
    const lines = splitLines(input);

    const rankings: Array<Ranking> = [];

    // Process each line into a ranking
    for (const line of lines) {
      const [cards, bid] = line.split(" ");

      // Transform the cards in to a list of card strengths
      const cardStrengths = cards.split("").map((card) => Solution.getCardRanking(card, true));

      // Get the hand type and add it to the rankings
      const handType = Solution.getHandType(cardStrengths, true);
      rankings.push([handType, cardStrengths, Number(bid)]);
    }

    // Sort the rankings by hand type, then individual card strengths
    const sortedRankings = rankings.sort(Solution.compareHands);

    // Sum the bid * rank for each hand
    return sum(sortedRankings.map((r, i) => (i + 1) * r[2]));
  }
}

// Store a type for [handType, cardStrengths, bid]
type Ranking = [number, number[], number];

enum HandType {
  "High Card" = 1,
  "One Pair" = 2,
  "Two Pair" = 3,
  "Three of a Kind" = 4,
  "Full House" = 5,
  "Four of a Kind" = 6,
  "Five of a Kind" = 7,
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(resolve(import.meta.dir, "./output.txt"), `${part1.result}\n${part2.result}`);

  return [part1.result, part2.result];
}
