import { expect, test } from "bun:test";
import Solution from "./solution";

test("2015/04 |> Part 1", async () => {
  const results = {
    "abcdef": 609043,
    "pqrstuv": 1048970,
  }

  for (const [input, expected] of Object.entries(results)) {
    expect(await Solution.part1(input)).toBe(expected);
  }
});

test("2015/04 |> Part 2", async () => {
  // No tests provided for part 2
});
