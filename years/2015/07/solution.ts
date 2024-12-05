import { prettyPrintResults, timeit } from "@/utils";
import { get } from "https";
import { resolve } from "path";

/**
 * ### Advent of Code 2015 - Day 7
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
    const wires = new Map<string, string>();
    const cache = new Map<string, number>();

    // Build a map of wires to operations
    for (const instruction of input.split("\n")) {
      const [operation, target] = instruction.split(" -> ");
      wires.set(target, operation);
    }

    // Recursive function to resolve wire values
    const resolveWire = (wire: string): number => {
      // If we've already calculated this wire, return cached value
      if (cache.has(wire)) {
        return cache.get(wire)!;
      }

      // If it's a number, return it
      if (!isNaN(Number(wire))) {
        return Number(wire);
      }

      const operation = wires.get(wire)!;
      let value: number;

      if (operation.includes("AND")) {
        const [a, b] = operation.split(" AND ");
        value = resolveWire(a) & resolveWire(b);
      } else if (operation.includes("OR")) {
        const [a, b] = operation.split(" OR ");
        value = resolveWire(a) | resolveWire(b);
      } else if (operation.includes("LSHIFT")) {
        const [a, b] = operation.split(" LSHIFT ");
        value = resolveWire(a) << resolveWire(b);
      } else if (operation.includes("RSHIFT")) {
        const [a, b] = operation.split(" RSHIFT ");
        value = resolveWire(a) >> resolveWire(b);
      } else if (operation.includes("NOT")) {
        const [_, a] = operation.split("NOT ");
        value = ~resolveWire(a);
      } else {
        value = resolveWire(operation);
      }

      // Cache the result
      cache.set(wire, value);
      return value;
    };

    return resolveWire("a");
  }

  public static async part2(input: string): Promise<number> {
    // Get the initial value from wire 'a'
    const initialValue = await Solution.part1(input);

    // Replace wire b's instruction with the value from wire 'a'
    const newInput = input
      .split("\n")
      .map((line) => (line.endsWith(" -> b") ? `${initialValue} -> b` : line))
      .join("\n");

    // Run the simulation again with the modified input
    return await Solution.part1(newInput);
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
