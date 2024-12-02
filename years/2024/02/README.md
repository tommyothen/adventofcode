# 🎄 Red-Nosed Reports

[Day 2](https://adventofcode.com/2024/day/2) was a nice challenge that required us to process a row of numbers and compare them to a set of rules, counting the number of "safe" rows. Not difficult, but again a good challenge to get us started.

### Ammendments
After helping a friend with part 2, I realized just how lucky I'd been with my inputs. My original solution for part 2 was pretty much identical to part 1, and it had a major flaw. For edge cases where the first two numbers were the same, my solution would have failed if the row was trending downward.

HOWEVER, I got super lucky because in ALL of my inputs, whenever the first two numbers were the same, the row would trend upwards (like `39 39 42 43 46`). I never encountered inputs like `39 39 38 37 36`. So while I totally lucked out, I'm glad I was able to spot my mistake and fix it.

Also, there's almost certainly a more elegant way to solve this, and I will most likely revisit this in the future.

## Results

| Part | Result | Average of 1000 |
| ---- | ------ | --------------- |
| 1    | 663    | 293.43µs        |
| 2    | 692    | 501.22µs        |
