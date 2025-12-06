import chalk from "chalk";

// Common functions for advent of code solutions
/**
 * Reverse a string, as simple as that
 */
export const reverseString = (str: string) => str.split("").reverse().join("");

/**
 * Pads a string or number with the specified character until it reaches the specified length
 */
export const pad = (
  str: string | number,
  length: number,
  char: string = "0"
) => {
  while (str.toString().length < length) str = char + str;
  return str.toString();
};

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
export const create2DArray = <T extends any>(
  rows: number,
  cols: number,
  defaultValue: T
) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => defaultValue)
  );

/**
 * Creates a 2D array from an input string
 */
export const create2DArrayFromInput = <T extends string>(str: string) =>
  str.split("\n").map((line) => line.split("")) as Array<Array<T>>;

/**
 * Creates a 2D array from an input string and applies a function to each element
 */
export const create2DArrayFromInputAndApply = <T extends any>(
  str: string,
  fn: (str: string) => T
) => str.split("\n").map((line) => line.split("").map(fn)) as Array<Array<T>>;

/**
 * Rotates a 2D array 90 degrees
 * @param matrix The matrix to rotate
 * @param clockwise Whether to rotate clockwise or counter-clockwise
 */
export const rotateMatrix = <T>(
  matrix: Array<Array<T>>,
  clockwise: boolean = true
): Array<Array<T>> => {
  if (!matrix.length || !matrix[0].length) {
    throw new Error("Matrix must have at least one row and one column");
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated: Array<Array<T>> =
    Array.from({ length: cols }, () =>
      new Array<T>(rows)
    );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (clockwise) {
        rotated[c][rows - 1 - r] = matrix[r][c];
      } else {
        rotated[cols - 1 - c][r] = matrix[r][c];
      }
    }
  }

  return rotated;
};

/**
 * Returns if the specified string is a number
 */
export const isNum = (str: string | undefined) =>
  str !== undefined && !isNaN(Number(str));

/**
 * Returns the greatest common divisor of two numbers
 */
export const gcd = (a: number, b: number): number => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

/**
 * Returns the least common multiple of two numbers
 */
export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};

/**
 * Calculates the determinant of a square matrix of any size
 */
export const determinant = (matrix: number[][]): number => {
  // Special case for 1x1 matrix
  if (matrix.length === 1) return matrix[0][0];

  // Special case for 2x2 matrix (faster than recursion)
  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  // Validate square matrix
  if (!matrix.every((row) => row.length === matrix.length)) {
    throw new Error("Matrix must be square");
  }

  // Calculate determinant using Laplace expansion along first row
  let det = 0;
  for (let i = 0; i < matrix.length; i++) {
    det += matrix[0][i] * cofactor(matrix, 0, i);
  }
  return det;
};

/**
 * Calculates the cofactor of a matrix element
 */
export const cofactor = (
  matrix: number[][],
  row: number,
  col: number
): number => {
  return ((row + col) % 2 ? -1 : 1) * determinant(minor(matrix, row, col));
};

/**
 * Returns a minor matrix by removing specified row and column
 */
export const minor = (
  matrix: number[][],
  row: number,
  col: number
): number[][] => {
  return matrix
    .filter((_, index) => index !== row)
    .map((row) => row.filter((_, index) => index !== col));
};

/**
 * Equivalent to the Python zip function
 */
export const zip = <T extends any>(...arrs: Array<Array<T>>) => {
  const shortest = arrs.reduce((acc, curr) =>
    curr.length < acc.length ? curr : acc
  );
  return shortest.map((_, i) => arrs.map((arr) => arr[i]));
};

// Utility functions not specific to advent of code solutions
type TimeitResult<Result> = {
  result: Result;
  average: number;
  best: number;
  worst: number;
};
/**
 * Perform a timeit on a function, returning the result and the average, best, and worst times
 * @param fn A function to time
 * @param args Arguments to pass to the function
 * @param times The number of times to run the function, defaults to 1000
 */
export async function timeit<
  Fn extends (...args: Args) => Promise<any>,
  Args extends Array<any>,
  Result extends Awaited<ReturnType<Fn>>
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
  };
}

/**
 * Pretty print the results of a timeit
 */
export async function prettyPrintResults(
  results: [TimeitResult<any>, TimeitResult<any>]
) {
  const [part1, part2] = results;

  /**
   * Displays the time in ms or µs if appropriate
   * @param ms The time in ms
   * @returns The time in ms or µs .ToFixed(2)
   */
  const displayTime = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
    return `${ms.toFixed(2)}ms`;
  };

  console.log(chalk.bold.underline("Results 1:"));
  console.log(`Result: ${chalk.blue(part1.result)}`);
  console.log(`Average Time: ${chalk.green(displayTime(part1.average))}`);
  console.log(`Best Time: ${chalk.greenBright(displayTime(part1.best))}`);
  console.log(`Worst Time: ${chalk.redBright(displayTime(part1.worst))}\n`);

  console.log(chalk.bold.underline("Results 2:"));
  console.log(`Result: ${chalk.blue(part2.result)}`);
  console.log(`Average Time: ${chalk.green(displayTime(part2.average))}`);
  console.log(`Best Time: ${chalk.greenBright(displayTime(part2.best))}`);
  console.log(`Worst Time: ${chalk.redBright(displayTime(part2.worst))}`);
}
