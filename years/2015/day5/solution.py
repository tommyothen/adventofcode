class Solution:
  # Store the input as a class variable
  input = ""

  @staticmethod
  def part1() -> str:
    inp = Solution.input.split("\n")

    def is_nice(string):
      vowels = "aeiou"
      bad = ["ab", "cd", "pq", "xy"]

      for b in bad:
        if b in string:
          return False

      count = 0
      for c in string:
        if c in vowels:
          count += 1

      if count < 3:
        return False

      for i in range(len(string) - 1):
        if string[i] == string[i + 1]:
          break
      else:
        return False

      return True

    filtered = list(filter(is_nice, inp))

    return len(filtered)

  @staticmethod
  def part2() -> str:
    inp = Solution.input.split("\n")

    def is_nice(string):
      # Check for pairs
      for i in range(len(string) - 2):
        # Check if the rest of the string contains the pair
        if string[i:i + 2] in string[i + 2:]:
          break
      else:
        return False

      # Check for repeating letters with a gap
      for i in range(len(string) - 2):
        # Check if the next letter is the same as the one after the gap
        if string[i] == string[i + 2]:
          break
      else:
        return False

      return True

    filtered = list(filter(is_nice, inp))

    return len(filtered)



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
