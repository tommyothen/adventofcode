# 🎄 Ceres Search

[Day 4](https://adventofcode.com/2024/day/4), a nice puzzle still and I solved it relatively quickly. We needed to just search a 2D grid for specific patterns. I tackled it thinking similarly to finding words in a word search puzzle. There might be a blazingly obvious way to do it, but I'm happy with my solution. However, when writing part 1, I did assume that part 2 would be a simple extension of part 1 where we would have to search for different patterns and not just the one. That assumption wasn't exactly correct so my effort of writing a generic search function was not needed. I think if I were to come back to part 1, I would just hard code the search for the pattern we needed since I think it would be faster.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 2639   | 739.13µs        |
| 2    | 2005   | 221.19µs        |
