# 🎄 Day 16 - Reindeer Maze

[Day 16](https://adventofcode.com/2024/day/16), another day, another 2D grid to navigate. Jokes aside, this one i found extremely challenging since part 1 was just an adapted version of the A\* pathfinding algorithm, and part 2 was a bit more complex.

In part 2 I had a hard time understanding how I could tackle the problem so I broke it down in to 3 steps:

1. First pass:
   - Use Dijkstra's algorithm to find the minimum possible cost to reach the end.
   - Along the way while finding the minimum cost, store ALL possible parents for each position when we find a path with equal cost of the minimum cost.
2. Second phase:
   - Start from the end position to backtrack to the start position.
   - For each position we add its coordinates to a set.
   - Recursively add the parent positions to the set until we reach the start position.
3. Final phase:
   - Return the size of the set.

Because of the amount of time it took for me to get a solution that works, I do not think I will be coming back to this one to optimise it. Although I'm sure I can knock off a few milliseconds by using numbers instead of strings for keys with sets and maps, similar to what I did for [day 6](../06/README.md#improvements).

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 65436  | 15.69ms         |
| 2    | 489    | 32.29ms         |
