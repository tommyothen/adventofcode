import chalk from "chalk";
import fs from "fs/promises";
import { getCurrentAoCDate, parseDate } from "../helpers";

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

    const replacedTestTemplate = testTemplate
      .replace(/YYYY/g, date.year.toString())
      .replace(/DD/g, date.day);

    // Define all files to be created
    const files = {
      "solution.ts": replacedSolutionTemplate,
      "solution.test.ts": replacedTestTemplate,
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

// Export the handler function
export default async function (args?: string[]): Promise<void> {
  if (args?.[0]) {
    const [year, day] = parseDate(args[0]);
    await create(year, day);
  } else {
    await create();
  }
}
