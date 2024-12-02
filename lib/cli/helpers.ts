import chalk from "chalk";
import { pad } from "@/utils";

// Regex for validating Advent of Code dates (2015/01 - 2059/25)
export const DATE_REGEX = /^20(?:1[5-9]|[2-5]\d)\/(?:0[1-9]|1\d|2[0-5])$/;

/**
 * Parse and validate a date string in the format YYYY/DD
 * @throws {Error} If the date format is invalid
 */
export function parseDate(dateStr: string): [number, string] {
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
 * Get the current Advent of Code date, handling December-specific logic
 * @throws {Error} If date validation fails
 */
export function getCurrentAoCDate(year?: number, day?: string) {
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
 * Get session cookie from environment
 */
export function getSessionCookie(): string {
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
 * Checks if a string represents a valid day directory (01-25)
 */
export function isDayDirectory(name: string): boolean {
  return /^(0[1-9]|1\d|2[0-5])$/.test(name);
}

/**
 * Fetch input from Advent of Code website
 * @throws {Error} If input fetching fails
 */
export async function fetchInput(
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
