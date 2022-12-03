import hashlib

class Solution:
  # Store the input as a class variable
  input = ""

  @staticmethod
  def part1() -> str:
    return Solution.find_hash(Solution.input, 5)

  @staticmethod
  def part2() -> str:
    return Solution.find_hash(Solution.input, 6)

  def find_hash(string, zeros):
    i = 0

    while True:
      string = Solution.input + str(i)
      hashed = hashlib.md5(string.encode()).hexdigest()

      if hashed[:zeros] == "0"*zeros:
        return i

      i += 1

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
