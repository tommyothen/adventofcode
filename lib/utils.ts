import chalk from "chalk";

// Common functions for advent of code solutions
/**
 * Reverse a string, as simple as that
 */
export const reverseString = (str: string) =>
  str.split("").reverse().join("");

/**
 * Pads a string or number with the specified character until it reaches the specified length
 */
export const pad = (str: string | number, length: number, char: string = "0") => {
  while (str.toString().length < length) str = char + str;
  return str.toString();
}

/**
 * Returns the sum of all the numbers in an array or set
 */
export const sum = (arr: Array<number> | Set<number>) =>
  [...arr].reduce((acc, curr) => acc + curr, 0);

/**
 * Returns the product of all the numbers in an array or set
 */
export const product = (arr: Array<number> | Set<number>) =>
  [...arr].reduce((acc, curr) => acc * curr, 1);

/**
 * Creates a 2D array with the specified number of rows and columns, and fills it with the specified default value
 */
export const create2DArray = <T extends any>(rows: number, cols: number, defaultValue: T) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => defaultValue));

/**
 * Returns if the specified string is a number
 */
export const isNum = (str: string | undefined) =>
  str !== undefined && !isNaN(Number(str));

// Utility functions not specific to advent of code solutions
type TimeitResult<Result> = {
  result: Result,
  average: number,
  best: number,
  worst: number,
}
/**
 * Perform a timeit on a function, returning the result and the average, best, and worst times
 * @param fn A function to time
 * @param args Arguments to pass to the function
 * @param times The number of times to run the function, defaults to 1000
 */
export async function timeit<
  Fn extends (...args: Args) => Promise<any>,
  Args extends Array<any>,
  Result extends Awaited<ReturnType<Fn>>,
>(fn: Fn, args: Args, times: number = 1000): Promise<TimeitResult<Result>> {
  let total = 0;
  let best = Infinity;
  let worst = 0;

  for (let i = 0; i < times; i++) {
    const start = performance.now();
    await fn(...args);
    const end = performance.now();

    total += end - start;

    if (end - start < best) best = end - start;
    if (end - start > worst) worst = end - start;
  }

  return {
    result: await fn(...args),
    average: total / times,
    best,
    worst,
  }
}

/**
 * Pretty print the results of a timeit
 */
export async function prettyPrintResults(results: [TimeitResult<any>, TimeitResult<any>]) {
  const [part1, part2] = results;

  /**
   * Displays the time in ms or µs if appropriate
   * @param ms The time in ms
   * @returns The time in ms or µs .ToFixed(2)
   */
  const displayTime = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
    return `${ms.toFixed(2)}ms`;
  }

  console.log(chalk.bold.underline('Results 1:'));
  console.log(`Result: ${chalk.blue(part1.result)}`);
  console.log(`Average Time: ${chalk.green(displayTime(part1.average))}`);
  console.log(`Best Time: ${chalk.greenBright(displayTime(part1.best))}`);
  console.log(`Worst Time: ${chalk.redBright(displayTime(part1.worst))}\n`);

  console.log(chalk.bold.underline('Results 2:'));
  console.log(`Result: ${chalk.blue(part2.result)}`);
  console.log(`Average Time: ${chalk.green(displayTime(part2.average))}`);
  console.log(`Best Time: ${chalk.greenBright(displayTime(part2.best))}`);
  console.log(`Worst Time: ${chalk.redBright(displayTime(part2.worst))}`);
}
