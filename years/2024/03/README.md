# 🎄 Mull It Over

[Day 3](https://adventofcode.com/2024/day/3) was a super forgiving challenge that required searching for substrings in a string. I was able to solve both parts without any issues. The problem was probably not meant to be used with regex, however, I found it to be the most straightforward solution and the performance shown below is more than acceptable in my humble opinion.

## Results

| Part | Result    | Average of 1000 |
| ---- | --------- | --------------- |
| 1    | 174336360 | 137.30µs        |
| 2    | 88802350  | 81.49µs         |

## Alternative Solutions

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

For fun, I also played around with the idea of capturing all of the enabled multiplication functions between the do() and don't() using regex. But the performance was SIGNIFICANTLY worse than the other two solutions averaging at 2.27ms per run. For completeness, here's the code:

```typescript
  public static async part2(input: string): Promise<number> {
    let result = 0;
    const enabledRegex = /(?:^|do\(\))((?:.|\n)*?)(?:$|don't\(\))/g;
    const mulRegex = /mul\(\d+,\d+\)/g;

    // Match all the enabled sections
    const enabledMatches = input.matchAll(enabledRegex);

    // For each enabled section, match all the `mul` calls
    for (const match of enabledMatches) {
      const [, section] = match;
      const mulMatches = section.match(mulRegex);

      if (!mulMatches) continue;

      // For each match, split the numbers and multiply them
      for (const mulMatch of mulMatches) {
        const [a, b] = mulMatch
          .slice(4, -1) // Remove the `mul(` and `)`
          .split(",") // Split the numbers
          .map(Number); // Convert them to numbers

        result += a * b;
      }
    }

    return result;
  }
```
