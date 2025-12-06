import { expect, test } from "bun:test";
import Solution from "./solution";

test("2025/06 |> Part 1", async () => {
  const input = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;

  expect(await Solution.part1(input)).toBe(4277556);
});

test("2025/06 |> Part 2", async () => {
  const input = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;

  expect(await Solution.part2(input)).toBe(3263827);
});
