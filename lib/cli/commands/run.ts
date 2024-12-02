import chalk from "chalk";
import path from "path";
import { getCurrentAoCDate, parseDate } from "../helpers";

/**
 * Run the solution for a specific day or the current day
 */
async function run(year?: number, day?: string) {
  const date = getCurrentAoCDate(year, day);
  const solutionPath = path.resolve(
    import.meta.dir,
    `../../../years/${date.year}/${date.day}/solution.ts`
  )

  try {
    const file = Bun.file(solutionPath);

    if (!(await file.exists())) {
      throw new Error(`Solution file not found at ${chalk.cyan(solutionPath)}`);
    }

    const solution = await import(solutionPath);
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

// Export the handler function
export default async function (args?: string[]): Promise<void> {
  if (args?.[0]) {
    const [year, day] = parseDate(args[0]);
    await run(year, day);
  } else {
    await run();
  }
}
