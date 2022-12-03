// Import the required modules
const fs = require("fs");

// Define the Solution class
class Solution {
  // Define the static input property
  static input = "";

  // Define the static part1 method
  static part1() {
    return "Not implemented";
  }

  // Define the static part2 method
  static part2() {
    return "Not implemented";
  }
}

// Define the main function
async function main() {
  // Read the input
  Solution.input = fs.readFileSync("input.txt", "utf8");

  // Run the solutions
  const [part1, part2] = [Solution.part1(), Solution.part2()];
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);

  // Write the solutions to the output file
  fs.writeFileSync("output.txt", `${part1}\n${part2}`);
}

// Call the main function
main();
