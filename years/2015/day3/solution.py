class Solution:
  # Store the input as a class variable
  input = ""

  @staticmethod
  def part1() -> str:
    houses = {(0, 0): 1}

    x = 0
    y = 0

    for c in Solution.input:
      if c == "^":
        y += 1
      elif c == "v":
        y -= 1
      elif c == ">":
        x += 1
      elif c == "<":
        x -= 1

      houses[(x, y)] = houses.get((x, y), 0) + 1

    return len(houses)

  @staticmethod
  def part2() -> str:
    houses = {(0, 0): 2}

    x = [0, 0]
    y = [0, 0]

    for i, c in enumerate(Solution.input):
      if c == "^":
        y[i % 2] += 1
      elif c == "v":
        y[i % 2] -= 1
      elif c == ">":
        x[i % 2] += 1
      elif c == "<":
        x[i % 2] -= 1

      houses[(x[i % 2], y[i % 2])] = houses.get((x[i % 2], y[i % 2]), 0) + 1

    return len(houses)

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
