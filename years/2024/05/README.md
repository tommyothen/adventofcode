# 🎄 Day 5 - Print Queue

[Day 5](https://adventofcode.com/2024/day/5) was a step up in difficulty compared to the previous days. Part 1 was a simple problem, however, part 2 was a lot more challenging. When reading the extended problem, I thought it would be good to implement a topological sort algorithm since I had the problem in a dependency graph format.

I'm not sure if there is a simpler way staring me in the face, but this is the initial solution I came up with. I may revisit this later to see if there is a simpler solution since my solution isn't the fastest and I would like to try keep it below 1ms.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 4609   | 873.94µs        |
| 2    | 5723   | 1.83ms          |
