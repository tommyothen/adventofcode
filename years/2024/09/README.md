# 🎄 Day 9 - Disk Fragmenter

[Day 9](https://adventofcode.com/2024/day/9). Part 1 of this challenge wasn't the trickiest however, I did run in to a problem that stumped me for a while where the ID's of the files can be more than one digit which I hadn't accounted for. I had to change the way I was storing the disk data to an array of numbers instead of a string. Part 2 was a little more challenging and I'm not able to spot any big optimisations that I can make to my current solution. If I were to come back to it and look at it again, maybe I could find a better and faster way to solve it.

## Results

| Part | Result        | Average of 1000 |
| ---- | ------------- | --------------- |
| 1    | 6337367222422 | 671.26µs        |
| 2    | 6361380647183 | 112.36ms        |
