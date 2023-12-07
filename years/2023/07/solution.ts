import { prettyPrintResults, zip, splitLines, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2023 - Day 07
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(resolve(import.meta.dir, "./input.txt")).text();

  private static getCardRanking(card: string): number {
    const ranks = "23456789TJQKA";
    return ranks.indexOf(card[0]);
  }

  private static getHandType(hand: string): HandType {
    const counts = new Map<string, number>();
    for (const card of hand) {
      counts.set(card, (counts.get(card) ?? 0) + 1);
    }

    const countValues = Array.from(counts.values());
    switch (counts.size) {
      case 5: return HandType["High Card"];
      case 4: return HandType["One Pair"];
      case 3: return countValues.includes(3) ? HandType["Three of a Kind"] : HandType["Two Pair"];
      case 2: return countValues.includes(4) ? HandType["Four of a Kind"] : HandType["Full House"];
      case 1: return HandType["Five of a Kind"];
      default: throw new Error(`Invalid hand: ${hand}`);
    }
  }

  public static compareHands(hand1: string, hand2: string): number {
    const handType1 = Solution.getHandType(hand1);
    const handType2 = Solution.getHandType(hand2);
    if (handType1 !== handType2) return handType1 - handType2;

    const hand1Cards = hand1.split("");
    const hand2Cards = hand2.split("");
    for (let i = 0; i < hand1Cards.length; i++) {
      const card1Rank = Solution.getCardRanking(hand1Cards[i]);
      const card2Rank = Solution.getCardRanking(hand2Cards[i]);
      if (card1Rank !== card2Rank) return card1Rank - card2Rank;
    }

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
    const hands = splitLines(input);

    // Sort the hands
    hands.sort((a, b) => Solution.compareHands(a.split(" ")[0], b.split(" ")[0]));

    // Work out the total winnings
    let total = 0;

    for (let i = 0; i < hands.length; i++) {
      const [, bid] = hands[i].split(" ");

      total += Number(bid) * (i + 1);
    }

    return total;
  }

  public static async part2(input: string): Promise<number> {
    return 0;
  }
}

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
