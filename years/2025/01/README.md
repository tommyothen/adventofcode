# 🎄 Day 1 - Secret Entrance

[Day 1](https://adventofcode.com/2025/day/1) was a nice warm-up challenge that required us to process a list of instructions to input movements in to a dial lock. The challenge was straightforward and focused on correctly interpreting the instructions.

For part 2, I initially found the result by simulating each individual movement to see if it crossed 0, which was inefficient but let me find the answer quickly. After that, I took a mathematical approach to determine the number of times the dial crossed 0 based on the total distance moved in each direction, which brought the average execution time down significantly from ~2ms to ~500µs.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 1120   | 469.33µs        |
| 2    | 6554   | 524.62µs        |
