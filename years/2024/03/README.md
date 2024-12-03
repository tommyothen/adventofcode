# 🎄 Mull It Over

[Day 3](https://adventofcode.com/2024/day/3) was a super forgiving challenge that required searching for substrings in a string. I was able to solve both parts without any issues. The problem was probably not meant to be used with regex, however, I found it to be the most straightforward solution and the performance shown below is more than acceptable in my humble opinion.

## Results

| Part | Result    | Average of 1000 |
| ---- | --------- | --------------- |
| 1    | 174336360 | 137.30µs        |
| 2    | 88802350  | 81.49µs         |

## Alternative Solutions

### Non-Regex Solution

I also implemented a solution that doesn't use regex. It's a bit more verbose, and the performace is suprisingly worse than the regex, but it's still humbly fast enough.

| Part | Average of 1000 |
| ---- | --------------- |
| 1    | 177.27µs        |
| 2    | 176.19µs        |

```typescript
  private static isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private static parseMultiplication(
    input: string,
    startIndex: number
  ): number {
    const functionSignature = "mul(";
    if (!input.startsWith(functionSignature, startIndex)) {
      return 0;
    }

    let numberBuffer = "";
    let firstNumber: number | null = null;
    let index = startIndex + functionSignature.length;

    while (index < input.length) {
      const char = input[index];

      if (char === ",") {
        // Handle comma separator
        if (numberBuffer === "" || firstNumber !== null) {
          return 0;
        }
        firstNumber = parseInt(numberBuffer, 10);
        numberBuffer = "";
      } else if (char === ")") {
        // Handle closing parenthesis
        if (numberBuffer === "" || firstNumber === null) {
          return 0;
        }
        const secondNumber = parseInt(numberBuffer, 10);
        return firstNumber * secondNumber;
      } else if (!Solution.isDigit(char)) {
        // Invalid character found
        return 0;
      } else {
        numberBuffer += char;
      }
      index++;
    }

    return 0;
  }

  private static handleControlStatement(
    input: string,
    index: number
  ): [boolean, number] {
    if (input.startsWith("do()", index)) {
      return [false, 3];
    }
    if (input.startsWith("don't()", index)) {
      return [true, 6];
    }
    return [false, 0];
  }

  public static async part1(input: string): Promise<number> {
    let sum = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === "m") {
        sum += Solution.parseMultiplication(input, i);
      }
    }

    return sum;
  }

  public static async part2(input: string): Promise<number> {
    let sum = 0;
    let disabled = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (char === "m") {
        const result = Solution.parseMultiplication(input, i);
        if (!disabled) {
          sum += result;
        }
      } else if (char === "d") {
        const [newDisabledState, skipCount] = Solution.handleControlStatement(
          input,
          i
        );
        if (skipCount > 0) {
          disabled = newDisabledState;
          i += skipCount;
        }
      }
    }

    return sum;
  }
```

### Positive Lookbehind Regex

Just playing around with even more regex I discovered "positive lookbehind" which isn't supported in every regex engine, but it is supported with whatever Bun uses! So I wrote this beautiful regex that captures all the `mul` calls that are between a do() and a don't(). The performance is absolutely terrible, averaging at 289.71ms per run, but I think it is a fun solution to show off!

```typescript
  public static async part2(input: string): Promise<number> {
    let result = 0;
    const mulRegex = /(?<=(?:^|do\(\))(?:(?!don't\(\))[\s\S])*?)(mul\(\d+,\d+\))(?=[\s\S]*?(?:$|don't\(\)))/g;

    // For each match, split the numbers and multiply them
    const matches = input.match(mulRegex);
    if (!matches) return result;

    for (const match of matches) {
      const [a, b] = match
        .slice(4, -1) // Remove the `mul(` and `)`
        .split(",") // Split the numbers
        .map(Number); // Convert them to numbers

      result += a * b;
    }

    return result;
  }
```