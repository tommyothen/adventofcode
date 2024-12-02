import chalk from "chalk";

import artworkCommand from "./commands/artwork";
import createCommand from "./commands/create";
import inputCommand from "./commands/input";
import populateCommand from "./commands/populate";
import runCommand from "./commands/run";

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
    handler: runCommand,
  },
  create: {
    aliases: ["create", "c"],
    description: "Create a new solution for the specified day (or current day)",
    handler: createCommand,
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
    handler: inputCommand,
  },
  populate: {
    aliases: ["populate", "p"],
    description:
      "Populates all the input files for all the days with solutions (requires session cookie)",
    handler: populateCommand,
  },
  artwork: {
    aliases: ["artwork", "art", "a"],
    description: "Fetches the current year's Advent of Code artwork and saves it as an SVG file",
    handler: artworkCommand,
  }
};

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
