# 🎄 Day 11 - Plutonian Pebbles

After reading the challenge for [Day 11](https://adventofcode.com/2024/day/11) I absolutely knew that it was going to be an optimisation problem, however before putting any actual thought into it, for part 1 I just did a simple brute force solution. This was to get a feel for the problem before diving into the optimisation. After getting the answer for part 1 and seeing that part 2 was just part 1 but performed 75 times, I did naively try to run part 1 75 times to see if it would complete in a reasonable time. However, after Bun refusing to give me the answer I had to rethink my approach.

I think the main breakthrough in my thought was that i don't actually have to care about the whole line of stones, since the value at the end is just the length. Also caching the results of the previous stones make it very easy and quick to find the next.

## Results

| Part | Result          | Average of 1000 |
| ---- | --------------- | --------------- |
| 1    | 233875          | 375.11µs        |
| 2    | 277444936413293 | 13.68ms         |
