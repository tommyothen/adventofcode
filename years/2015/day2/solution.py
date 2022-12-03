class Solution:
  # Store the input as a class variable
  input = ""

  @staticmethod
  def part1() -> str:
    inp = Solution.input.split("\n")

    total = 0

    for line in inp:
      l, w, h = map(int, line.split("x"))

      sides = [l * w, w * h, h * l]

      total += 2 * sum(sides) + min(sides)

    return total

  @staticmethod
  def part2() -> str:
    inp = Solution.input.split("\n")

    total = 0

    for line in inp:
      l, w, h = map(int, line.split("x"))

      sides = [l, w, h]

      total += 2 * sum(sorted(sides)[:2]) + l * w * h

    return total

if __name__ == "__main__":
  # Read the input
  with open("input.txt", "r") as file:
    Solution.input = file.read()

  # Run the solutions
  part1 = Solution.part1()
  part2 = Solution.part2()
  print(f"Part 1: {part1}")
  print(f"Part 2: {part2}")

  # Write the solutions to the output file
  with open("output.txt", "w") as file:
    file.write(f"{part1}\n{part2}")
