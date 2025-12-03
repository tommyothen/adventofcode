# 🎄 Day 3 - Lobby

[Day 3](https://adventofcode.com/2025/day/3) was a surprisingly easier challenge compared to the previous day, I assumed the complexity would ramp up much more quickly.

Part 1 was easy enough, and instead of bruteforcing all 2 digit combinations I realised quite quickly that I could just do a single pass through the input and keep track of the tens and units digits separately.
For this part, my readability really suffers and the comments are necessary to understand what is going on. I can definitely improve on this in future if need be.

For Part 2, I initially tried to do a method where we would remove all the 1s up to all the 9s in the number from left to right, until the length of the number is 12.
However, this method would work until we had the number `234234234234278` in the input, where removing all the 1s to 9s left us with `343434234278`, which is incorrect as we should have had `434234234278`.

## Results

| Part | Result          | Average of 1000 |
| ---- | --------------- | --------------- |
| 1    | 16854           | 260.12µs        |
| 2    | 167526011932478 | 411.32µs        |
