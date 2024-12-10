# 🎄 Day 9 - All in a Single Night

_Solved on December 10th, 2024._

[Day 9](https://adventofcode.com/2015/day/9) is about finding the shortest path between all locations. This wasn't too difficult, however I do think this can be optimised GREATLY. Right now, I'm generating all possible permutations of the locations and then calculating the distance for each permutation. This is a brute force approach and I'm sure there's a better way to do this, however right now I'm just trying to complete all of 2015's puzzles.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 141    | 17.00ms         |
| 2    | 736    | 16.69ms         |
