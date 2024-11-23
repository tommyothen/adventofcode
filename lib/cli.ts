import { pad } from "@/utils";
import fs from "fs/promises";
import chalk from "chalk";

// Define the structure for our commands
interface Command {
  aliases: string[];
  description: string;
  handler: (args?: string[]) => Promise<void>;
}

// All available commands with their aliases and descriptions
const commands: Record<string, Command> = {
  run: {
    aliases: ["run", "r"],
    description: "Run the solution for the specified day (or current day)",
    handler: async (args?) => {
      if (args?.[0]) {
        const [year, day] = parseDate(args[0]);
        await run(year, day);
      } else {
        await run();
      }
    },
  },
  create: {
    aliases: ["create", "c"],
    description: "Create a new solution for the specified day (or current day)",
    handler: async (args?) => {
      if (args?.[0]) {
        const [year, day] = parseDate(args[0]);
        await create(year, day);
      } else {
        await create();
      }
    },
  },
  help: {
    aliases: ["help", "--help", "-h"],
    description: "Show this help message",
    handler: async () => help(),
  },
  input: {
    aliases: ["input", "i"],
    description:
      "Fetches an input file for the specified (or current) day (requires session cookie)",
    handler: async (args?) => {
      if (args?.[0]) {
        const [year, day] = parseDate(args[0]);
        await input(year, day);
      } else {
        await input();
      }
    },
  },
  populate: {
    aliases: ["populate", "p"],
    description:
      "Populates all the input files for all the days with solutions (requires session cookie)",
    handler: async () => populate(),
  },
};

// Regex for validating Advent of Code dates (2015/01 - 2059/25)
const DATE_REGEX = /^20(?:1[5-9]|[2-5]\d)\/(?:0[1-9]|1\d|2[0-5])$/;

/**
 * Parse and validate a date string in the format YYYY/DD
 * @throws {Error} If the date format is invalid
 */
function parseDate(dateStr: string): [number, string] {
  if (!DATE_REGEX.test(dateStr)) {
    throw new Error(
      `Invalid date format: ${chalk.red(
        dateStr
      )}. Expected format: ${chalk.green("YYYY/DD")} (2015/01 - 2059/25)`
    );
  }
  return [parseInt(dateStr.slice(0, 4)), dateStr.slice(5)];
}

/**
 * Display help information about available commands
 */
function help() {
  console.log(chalk.bold.blue("\n🎄 Advent of Code CLI Tool\n"));
  console.log(
    `${chalk.bold("Usage:")} bun cli ${chalk.gray("[command] [options]")}\n`
  );
  console.log(chalk.bold("Commands:"));

  Object.entries(commands).forEach(([name, cmd]) => {
    console.log(
      `    ${chalk.green(cmd.aliases.join(", "))}`.padEnd(20) +
        " " +
        chalk.gray(cmd.description)
    );
  });

  console.log(`\n${chalk.bold("Examples:")}`);
  console.log(
    `    ${chalk.cyan("bun cli run")}          ${chalk.gray(
      "# Run solution for current day"
    )}`
  );
  console.log(
    `    ${chalk.cyan("bun cli run 2023/01")}  ${chalk.gray(
      "# Run solution for specific day"
    )}`
  );
  console.log(
    `    ${chalk.cyan("bun cli create")}       ${chalk.gray(
      "# Create solution for current day"
    )}`
  );
  console.log(
    `    ${chalk.cyan("bun cli create 2023/01")}  ${chalk.gray(
      "# Create solution for specific day"
    )}`
  );

  console.log(
    `\n${chalk.gray("To run tests, use:")} ${chalk.cyan("bun test")}\n`
  );
}

/**
 * Validate that a solution exports the required interface
 * @throws {Error} If the solution doesn't match the expected interface
 */
async function validateSolution(solution: unknown, path: string) {
  if (typeof solution !== "object" || solution === null) {
    throw new Error(`Solution at ${chalk.cyan(path)} must export an object`);
  }

  if (typeof (solution as { main: unknown }).main !== "function") {
    throw new Error(
      `Solution at ${chalk.cyan(path)} must export a main function`
    );
  }

  return solution as { main: () => Promise<void> };
}

/**
 * Run the solution for a specific day or the current day
 */
async function run(year?: number, day?: string) {
  const date = getCurrentAoCDate(year, day);
  const solutionPath = `./years/${date.year}/${date.day}/solution.ts`;

  try {
    const file = Bun.file(solutionPath);

    if (!(await file.exists())) {
      throw new Error(`Solution file not found at ${chalk.cyan(solutionPath)}`);
    }

    const solution = await import("." + solutionPath);
    const validatedSolution = await validateSolution(solution, solutionPath);

    console.log(
      chalk.bold.blue(
        `\n🚀 Running solution for ${chalk.green(`${date.year}/${date.day}`)}\n`
      )
    );
    console.time(chalk.gray("Completed in"));
    await validatedSolution.main();
    console.timeEnd(chalk.gray("Completed in"));
    console.log(); // Add newline for cleaner output
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
    }

    process.exit(1);
  }
}

/**
 * Create a new solution directory and files for a specific day
 */
async function create(year?: number, day?: string) {
  const date = getCurrentAoCDate(year, day);
  const solutionDir = `./years/${date.year}/${date.day}/`;
  const solutionPath = solutionDir + "solution.ts";

  try {
    const file = Bun.file(solutionPath);

    if (await file.exists()) {
      throw new Error(`Solution already exists at ${chalk.cyan(solutionDir)}`);
    }

    // Create the solution directory
    await fs.mkdir(solutionDir, { recursive: true });

    // Read all templates
    const solutionTemplate = await Bun.file(
      "./lib/template/solution.ts"
    ).text();
    const testTemplate = await Bun.file(
      "./lib/template/solution_tests.ts"
    ).text();
    const readmeTemplate = await Bun.file("./lib/template/README.md").text();

    // Replace template placeholders
    const replacedSolutionTemplate = solutionTemplate
      .replace("YYYY", date.year.toString())
      .replace("DD", parseInt(date.day).toString());

    const replacedReadmeTemplate = readmeTemplate
      .replace(/YYYY/g, date.year.toString())
      .replace(/DD/g, parseInt(date.day).toString());

    // Define all files to be created
    const files = {
      "solution.ts": replacedSolutionTemplate,
      "solution.test.ts": testTemplate,
      "input.txt": "",
      "README.md": replacedReadmeTemplate,
    };

    // Create each file
    for (const [filename, content] of Object.entries(files)) {
      await Bun.write(solutionDir + filename, content);
    }

    console.log(
      chalk.bold.green(
        `\n✨ Created solution for ${chalk.blue(`${date.year}/${date.day}`)}`
      )
    );
    console.log(chalk.gray(`📁 ${solutionDir}`));
    console.log(
      chalk.gray(
        `\n🔗 Problem: ${chalk.cyan(
          `https://adventofcode.com/${date.year}/day/${parseInt(date.day)}`
        )}\n`
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
    }
    process.exit(1);
  }
}

/**
 * Get the current Advent of Code date, handling December-specific logic
 * @throws {Error} If date validation fails
 */
function getCurrentAoCDate(year?: number, day?: string) {
  const today = new Date();

  if (year === undefined) {
    year = today.getFullYear();
  }

  if (day === undefined) {
    if (today.getMonth() === 11) {
      // December
      day = pad(today.getDate(), 2, "0");
      if (parseInt(day) > 25) {
        throw new Error(
          "Today is after December 25th!\n" +
            `Please specify a day: ${chalk.cyan("bun cli run YYYY/DD")}`
        );
      }
    } else {
      throw new Error(
        "No date specified!\n\n" +
          `Since it's not December, you need to specify which puzzle to run:\n` +
          `${chalk.cyan("bun cli run YYYY/DD")}  ${chalk.gray(
            "(e.g., bun cli run 2023/01)"
          )}\n\n` +
          `Or create a new solution:\n` +
          `${chalk.cyan("bun cli create YYYY/DD")}  ${chalk.gray(
            "(e.g., bun cli create 2023/01)"
          )}\n\n` +
          `Run ${chalk.cyan("bun cli --help")} for more information.`
      );
    }
  }

  return { year, day };
}

/**
 * Fetch input from Advent of Code website
 * @throws {Error} If input fetching fails
 */
async function fetchInput(
  year: number,
  day: number,
  sessionCookie: string
): Promise<string> {
  const response = await fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
      headers: {
        Cookie: `session=${sessionCookie}`,
        "User-Agent": "github.com/your-username/aoc-cli by your@email.com", // Replace with your info
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Input not available yet! Puzzle might not be released.");
    }
    if (response.status === 400) {
      throw new Error("Invalid session cookie! Please check your .env file.");
    }
    throw new Error(`Failed to fetch input: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Get session cookie from environment
 */
function getSessionCookie(): string {
  const cookie = process.env.AOC_SESSION;
  if (!cookie) {
    throw new Error(
      "AOC_SESSION cookie not found!\n\n" +
        "Please add your session cookie to .env file:\n" +
        chalk.cyan("AOC_SESSION=your_session_cookie_here") +
        "\n\n" +
        "You can find your session cookie in your browser's developer tools\n" +
        "after logging in to https://adventofcode.com"
    );
  }
  return cookie;
}

/**
 * Fetches the input file for the specified (or current) day
 */
async function input(year?: number, day?: string) {
  try {
    const date = getCurrentAoCDate(year, day);
    const inputPath = `./years/${date.year}/${date.day}/input.txt`;

    // Check if directory exists, if not suggest creating it
    // We can check if the directory exists by checking if we have a solution file
    const dir = Bun.file(`./years/${date.year}/${date.day}/solution.ts`);
    if (!(await dir.exists())) {
      throw new Error(
        `Directory not found! Try creating it first:\n` +
          chalk.cyan(`bun cli create ${date.year}/${date.day}`)
      );
    }

    console.log(
      chalk.blue(
        `\n📥 Fetching input for ${chalk.green(`${date.year}/${date.day}`)}`
      )
    );

    const sessionCookie = getSessionCookie();
    const input = await fetchInput(
      date.year,
      parseInt(date.day),
      sessionCookie
    );

    // Save input to file
    await Bun.write(inputPath, input.trimEnd()); // trimEnd to handle trailing newlines consistently

    console.log(chalk.green(`\n✨ Saved input to ${chalk.cyan(inputPath)}\n`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
    }
    process.exit(1);
  }
}

/**
 * Checks if a string represents a valid day directory (01-25)
 */
function isDayDirectory(name: string): boolean {
  return /^(0[1-9]|1\d|2[0-5])$/.test(name);
}

/**
 * Populates all the input files for all the days with solutions
 */
async function populate() {
  try {
    const sessionCookie = getSessionCookie();

    // Find all solution directories
    const years = await fs.readdir("./years");

    console.log(chalk.blue("\n🔍 Finding missing input files..."));

    let populated = 0;
    let skipped = 0;

    for (const year of years) {
      // Skip non-year directories
      if (!/^20\d{2}$/.test(year)) continue;

      const days = await fs.readdir(`./years/${year}`);

      for (const day of days) {
        // Skip README.md and any other non-day directories
        if (!isDayDirectory(day)) continue;

        const inputPath = `./years/${year}/${day}/input.txt`;
        const inputFile = Bun.file(inputPath);

        // Skip if input file already has content
        if (await inputFile.exists()) {
          const content = await inputFile.text();
          if (content.trim().length > 0) {
            skipped++;
            continue;
          }
        }

        // Fetch and save input
        console.log(chalk.gray(`📥 Fetching input for ${year}/${day}...`));
        const input = await fetchInput(
          parseInt(year),
          parseInt(day),
          sessionCookie
        );
        await Bun.write(inputPath, input.trimEnd());
        populated++;

        // Sleep to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(chalk.green(`\n✨ Populated ${populated} input files`));
    if (skipped > 0) {
      console.log(chalk.gray(`⏩ Skipped ${skipped} existing input files`));
    }
    console.log(); // Add newline for cleaner output
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
    }
    process.exit(1);
  }
}

// Main CLI logic
async function main() {
  const args = process.argv.slice(2);
  const commandName = args[0] || "run";

  // Find the matching command
  const command = Object.values(commands).find((cmd) =>
    cmd.aliases.includes(commandName)
  );

  if (!command) {
    console.error(
      chalk.red(`\n❌ Unknown command: ${chalk.bold(commandName)}`)
    );
    await commands.help.handler();
    process.exit(1);
  }

  try {
    // Show help by default if no command is provided during non-December months
    if (args.length === 0 && new Date().getMonth() !== 11) {
      console.log(chalk.yellow("\n⚠️  Welcome to Advent of Code CLI!"));
      await commands.help.handler();
      return;
    }

    await command.handler(args.slice(1));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
    }
    process.exit(1);
  }
}

// Start the CLI
main().catch((error) => {
  console.error(chalk.red.bold("\n💥 Fatal error:"), error);
  process.exit(1);
});
