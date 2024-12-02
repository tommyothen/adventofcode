import chalk from "chalk";
import {
  fetchInput,
  getCurrentAoCDate,
  getSessionCookie,
  parseDate,
} from "../helpers";

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

// Export the handler function
export default async function (args?: string[]): Promise<void> {
  if (args?.[0]) {
    const [year, day] = parseDate(args[0]);
    await input(year, day);
  } else {
    await input();
  }
}
