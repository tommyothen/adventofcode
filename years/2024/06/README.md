# 🎄 Day 6 - Guard Gallivant

[Day 6](https://adventofcode.com/2024/day/6), honestly this day shouldn't have taken me nearly as long as it did. I was fighting my part 2 for honestly way too long. I was sure the logic was right but I would always get a number that was way too high.

I came to the conclusion that sometimes it's better to start over than to keep trying to fix a bad solution. I started over and got it working in not long at all. The issue was that I was double counting walls that have already been done! Currently the solution is not the fastest at a staggering 247.22ms for part 2. I'm going to optimise it a bit more later today, I already have some easy wins in mind. Although, I really doubt I can get it to sub 1ms. So I'll be happy with it under 100ms.

#### Improvements

I came back to this problem later in the day but I wasn't able to think of any logic changes. So to aim for my 100ms goal I decided to just do some easy optimisations when it comes to my solution. I decided to never compare strings since, unlike numbers, comparing strings is slow. Also when it comes to my Set's I decided to do a fun encoding trick. Since the positions of the numbers are never too big, I can encode the direction in the number itself using bitwise operations like so;
```ts
const encodePosition = (flatPos: number, direction: Direction): number =>
    (direction << 16) | flatPos;
```
Where as you can see I just encode the information as a number. This way I can achieve the same result as a `${x},${y},${direction}` string but with a lot less overhead.

Optimisations like such got me down to a nice 103.93ms. Not quite the average <100ms like I wanted, but if I wanted to be cheeky, the best time from that run was 99.14ms. So I'm going to call it a win!

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 5516   | 239.91µs        |
| 2    | 2008   | 103.93ms        |
