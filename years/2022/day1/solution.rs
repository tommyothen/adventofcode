//! --- Day 1: Calorie Counting ---

fn part1() {
  // Read the input file
  let input = std::fs::read_to_string("input.txt").unwrap();

  // Create a score for the most calories seen
  let mut max_calories = 0;

  // Loop over lines in the input
  let mut current_elf = 0;
  for line in input.lines() {
    // If it's a new line we're finished reading the previous elf
    if line == "" {
      if max_calories < current_elf {
        max_calories = current_elf;
      }

      // Reset the counter
      current_elf = 0;
    } else {
      let calorie: i32 = line.parse().unwrap();

      current_elf += calorie;
    }
  }

  // We check once more at the end in case there isn't a new line at the end of the file
  if max_calories < current_elf {
    max_calories = current_elf;
  }

  // Print the result
  println!("The top elf is currently carrying {} calories.", max_calories);
}

fn part2() {
  let input = std::fs::read_to_string("input.txt").unwrap();

  // Create an array of i32s
  let mut elves: Vec<i32> = Vec::new();

  // Loop over lines in the input
  let mut current_elf = 0;
  for line in input.lines() {
    // If it's a new line we're finished reading the previous elf
    if line == "" {
      elves.push(current_elf);

      // Reset the counter
      current_elf = 0;
    } else {
      let calorie: i32 = line.parse().unwrap();

      current_elf += calorie;
    }
  }

  // If the last line wasn't empty we need to add the last elf
  if current_elf != 0 {
    elves.push(current_elf);
  }

  // Sort the elves, biggest to smallest
  elves.sort_by(|a, b| b.cmp(a));

  // Print the top 3 elves
  println!("Top 3 elves:");
  println!("  1. {}", elves[0]);
  println!("  2. {}", elves[1]);
  println!("  3. {}", elves[2]);
  println!("\nTotal of {} calories.", elves[0] + elves[1] + elves[2]);
}

fn main() {
  println!("Part 1:");
  part1();

  println!("\nPart 2:");
  part2();
}
