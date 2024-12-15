# 🎄 Day 15 - Warehouse Woes

[Day 15](https://adventofcode.com/2024/day/15) was a really fun one to solve. Part 1 I was able to solve pretty quickly and I actually have a pretty good idea of speeding it up that I will try and implement after writing and committing this day. Part 2 was a bit more challenging but I had a really good idea on how to solve it pretty cleanly and without entering the if-else hell that I originally started to write.

For a really quick summary, we perform these key steps:

1. Every time we run in to a box, we find all the connected boxes that are meant to be moved in the given direction.

2. While collecting the connected boxes, if ANY box is not able to be moved, we clear the entire list of connected boxes since we need to move all of them in one chunk.

3. If we have boxes to move, we need to sort them from the furthest away to the closest. Then we move them one by one. Sorting them ensures that we never try to move a box in to another space that's already occupied by a box that hasn't been moved yet.

## Results

| Part | Result  | Average of 1000 |
| ---- | ------- | --------------- |
| 1    | 1441031 | 633.13µs        |
| 2    | 1425169 | 2.08ms          |
