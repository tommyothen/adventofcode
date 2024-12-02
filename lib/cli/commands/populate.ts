import chalk from "chalk";
import fs from "fs/promises";
import { fetchInput, getSessionCookie, isDayDirectory } from "../helpers";

// Export the handler function
export default async function (): Promise<void> {
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
