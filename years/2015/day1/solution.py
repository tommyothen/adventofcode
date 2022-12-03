class Solution:
  # Store the input as a class variable
  input = ""

  @staticmethod
  def part1() -> str:
    inp = Solution.input

    return inp.count("(") - inp.count(")")

  @staticmethod
  def part2() -> str:
    inp = Solution.input

    floor = 0

    for i, c in enumerate(inp):
      floor += 1 if c == "(" else -1

      if floor == -1:
        return i + 1

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
