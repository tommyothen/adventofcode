# 🎄 Day 10 - Elves Look, Elves Say

_Solved on December 10th, 2024._

[Day 10](https://adventofcode.com/2015/day/10) is about a sequence of numbers where you "look and say" the sequence. You take the previous number and say how many times each digit appears in the number.

I thought of a nice way of parsing the input by using a regular expression as shown:

```
(\d)\1*
```

Again, like 2015/09, this was FAR from the fastest solution. However, my current goal is just to solve all of 2015 first and then go back and optimise if I feel like it.

## Results

| Part | Result  | Average of 1000 |
| ---- | ------- | --------------- |
| 1    | 252594  | 67.07ms         |
| 2    | 3579328 | 1455.56ms       |
