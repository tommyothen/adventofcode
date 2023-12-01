import { pad } from "@/utils";
import fs from "fs/promises";

// Get the cli arguments, remove the first two
const args = process.argv.slice(2);

// Define all paths
const paths = [
  "", "run", "r", // Run the solution for the current day
  "create", "c", // Create a new solution for the current day,
  "test", "t", // Run the tests for the current day
  "--help", "-h", // Show the help message
]

function help() {
  // Print the help message
  console.log(`Usage: bun cli [command]

Commands:
  run, r      Run the solution for the current day
  create, c   Create a new solution for the current day
  --help, -h  Show the help message

To run tests, use the native bun test command.
`);
}

async function run(year = -1, day = "-1") {
  // Run the solution for the current day
  const today = new Date();

  if (year === -1) year = today.getFullYear();
  if (day === "-1") day = pad(today.getDate(), 2, "0");

  // Formatted path to the solution file, e.g. ./years/2023/01/solution.ts
  const solutionPath = `./years/${year}/${day}/solution.ts`;

  // Run the solution if it exists
  const file = Bun.file(solutionPath)

  if (await file.exists()) {
    // Print the solution
    const solution = await import("." + solutionPath);

    await solution.main();
  } else {
    // Print an error message
    console.log(`Error: Solution file not found at ${solutionPath}`);
  }
}

async function create(year = -1, day = "-1") {
  // Create a new solution for the current day
  const today = new Date();

  if (year === -1) year = today.getFullYear();
  if (day === "-1") day = pad(today.getDate(), 2, "0");

  // Formatted path to the solution directory, e.g. ./years/2023/01/
  const solutionDir = `./years/${year}/${day}/`;

  // Check if the solution directory already exists, easily done by
  // checking for solution.ts
  const file = Bun.file(solutionDir + "solution.ts");

  if (await file.exists()) {
    // Print an error message
    console.log(`Error: Solution already exists at ${solutionDir}`);
  } else {
    // Create the solution directory
    await fs.mkdir(solutionDir, { recursive: true });

    // Create all the files for the solution
    await fs.copyFile("./lib/template/solution.ts", solutionDir + "solution.ts");
    await Bun.write(solutionDir + "input.txt", "")
    await fs.copyFile("./lib/template/solution_tests.ts", solutionDir + "solution.test.ts");

    // Print a success message
    console.log(`Created solution for ${year}/${day}`);
  }
}

// Handle the arguments
if (args.length === 0) {
  // Run the solution for the current day
  run();
} else if (args.length === 1) {
  if (["--help", "-h"].includes(args[0])) {
    // Show the help message
    help();
  } else if (["create", "c"].includes(args[0])) {
    // Create a new solution for the current day
    create();
  } else if (["run", "r"].includes(args[0])) {
    // Run the solution for the current day
    run();
  } else {
    // Show the help message
    help();
  }
} else {
  // 2015/01 - 2029/31
  const validDateRegex = /^20(1[5-9]|2[0-9])\/(0[1-9]|1[0-9]|2[0-9]|3[01])$/;

  if (
    // bun cli create YYYY/DD
    (args[0] === "create" || args[0] === "c") &&
    validDateRegex.test(args[1])
  ) {
    create(
      parseInt(args[1].split("/")[0]),
      args[1].split("/")[1],
    );
  } else if (
    // bun cli run YYYY/DD
    (args[0] === "run" || args[0] === "r") &&
    validDateRegex.test(args[1])
  ) {
    run(
      parseInt(args[1].split("/")[0]),
      args[1].split("/")[1],
    );
  } else {
    // Show the help message
    help();
  }
}
