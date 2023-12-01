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
 * Creates a 2D array with the specified number of rows and columns, and fills it with the specified default value
 */
export const create2DArray = <T extends any>(rows: number, cols: number, defaultValue: T) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => defaultValue));

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

  console.log(chalk.bold.underline('Result 1:'));
  console.log(`Result: ${chalk.blue(part1.result)}`);
  console.log(`Average Time: ${chalk.green(part1.average.toFixed(2))} ms`);
  console.log(`Best Time: ${chalk.greenBright(part1.best.toFixed(2))} ms`);
  console.log(`Worst Time: ${chalk.redBright(part1.worst.toFixed(2))} ms\n`);

  console.log(chalk.bold.underline('Result 2:'));
  console.log(`Result: ${chalk.blue(part2.result)}`);
  console.log(`Average Time: ${chalk.green(part2.average.toFixed(2))} ms`);
  console.log(`Best Time: ${chalk.greenBright(part2.best.toFixed(2))} ms`);
  console.log(`Worst Time: ${chalk.redBright(part2.worst.toFixed(2))} ms`);
}
