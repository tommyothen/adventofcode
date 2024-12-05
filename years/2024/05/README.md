# 🎄 Day 5 - Print Queue

~~[Day 5](https://adventofcode.com/2024/day/5) was a step up in difficulty compared to the previous days. Part 1 was a simple problem, however, part 2 was a lot more challenging. When reading the extended problem, I thought it would be good to implement a topological sort algorithm since I had the problem in a dependency graph format.~~

~~I'm not sure if there is a simpler way staring me in the face, but this is the initial solution I came up with. I may revisit this later to see if there is a simpler solution since my solution isn't the fastest and I would like to try keep it below 1ms.~~

Coming back to this later on in the day and with a mind that didn't just wake up at 5am to tackle this problem. I realised there was an easier solution, like a LOT simpler than implementing a topological sorting algorithm... At least for our problem here we can build the dependents and then we can implement a simple comparison function and just use the built in sorting method with our custom comparison function...

After implementing this logic with part 1 and 2, we can see part 1 drop from an 873.94µs average to 245.59µs. Part 2 follows suit with a drop from 1.83ms to 431.87µs. This is a much better solution than my initial thoughts and I really should have not overthought a day 5 problem. I'm happy with the results now and I can peacefully move on to day 6 tomorrow.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 4609   | 245.59µs        |
| 2    | 5723   | 431.87µs        |
