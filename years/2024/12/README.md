# 🎄 Day 12 - Garden Groups

[Day 12](https://adventofcode.com/2024/day/12) was all about finding shapes within a grid and finding the area, perimeter, and the number of sides the shape has. The first part was just working out the area and perimeter of the shapes which I found easy to implement with a recursive function. However, it took me a minute to figure out how I could determine the number of sides a shape has. I first tried to track the last cell and the sides on that until I had the brainwave that the amount of sides a shape has is the same as the amount of corners it has. So I can just check if it's a corner, and count those recursively too.

I think I've realised that my timing results function is a little inaccurate for timing the part 1 results, since my soltuion for both parts of today's challenge are exactly the same, using the exact same function. I think it's a startup time issue, but I'm not sure. I'll have to look into it. You can see this very clearly with the worst times displayed below.

```yaml
🚀 Running solution for 2024/12

Results 1:
Result: 1457298
Average Time: 2.54ms
Best Time: 2.04ms
Worst Time: 12.43ms

Results 2:
Result: 921636
Average Time: 2.43ms
Best Time: 2.04ms
Worst Time: 4.91ms
[4.98s] Completed in
```

## Results

| Part | Result  | Average of 1000 |
| ---- | ------- | --------------- |
| 1    | 1457298 | 2.54ms          |
| 2    | 921636  | 2.43ms          |
