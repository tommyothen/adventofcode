# 🎄 Day 13 - Claw Contraption

[Day 13](https://adventofcode.com/2024/day/13) provided a problem that immediately stood out as a maths problem, specifically a simultaneous equation problem. My initial approach was to use [Bézout's identity](https://en.wikipedia.org/wiki/B%C3%A9zout%27s_identity) and the [extended Euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) to solve the problem. However, after some attempts then coming back to the problem later after a days work and a little more research, I found that [Cramer's rule](https://en.wikipedia.org/wiki/Cramer%27s_rule) was a perfect fit for the problem.

## Results

| Part | Result         | Average of 1000 |
| ---- | -------------- | --------------- |
| 1    | 38839          | 141.08µs        |
| 2    | 75200131617108 | 127.51µs        |
