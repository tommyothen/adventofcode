import { readFileSync, writeFileSync } from "fs";

class Solution {
  public static input: string;

  public static part1(): string {
    return "Not implemented";
  }

  public static part2(): string {
    return "Not implemented";
  }
}

async function main() {
  // Read the input
  Solution.input = readFileSync("input.txt", "utf8");

  // Run the solutions
  const [part1, part2] = [Solution.part1(), Solution.part2()];
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);

  // Write the solutions to the output file
  writeFileSync("output.txt", `${part1}\n${part2}`);
}

main();
