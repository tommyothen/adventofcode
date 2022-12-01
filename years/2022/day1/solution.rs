use std::fs::File;
use std::io::prelude::*;

struct Solution {
    input: String,
}

impl Solution {
    fn new(input: &str) -> Self {
        Self {
            input: input.to_string(),
        }
    }

    fn part1(&self) -> String {
        // Create a score for the most calories seen
        let mut max_calories = 0;

        // Loop over lines in the input
        let mut current_elf = 0;
        for line in self.input.lines() {
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

        // Return the result
        max_calories.to_string()
    }

    fn part2(&self) -> String {
        // Create an array of i32s
        let mut elves: Vec<i32> = Vec::new();

        // Loop over lines in the input
        let mut current_elf = 0;
        for line in self.input.lines() {
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

        // Sort the elves
        elves.sort_by(|a, b| b.cmp(a));

        // Return the result
        (elves[0] + elves[1] + elves[2]).to_string()
    }
}

fn main() {
    // Read the input
    let input = std::fs::read_to_string("input.txt").unwrap();

    // Create the solution
    let solution = Solution::new(&input);

    // Run the solutions
    println!("Part 1: {}", solution.part1());
    println!("Part 2: {}", solution.part2());

    // Create the output file
    let mut file = File::create("output.txt").unwrap();

    // Write the solutions to the output file
    let output = format!("{}\n{}", solution.part1(), solution.part2());
    file.write_all(output.as_bytes())
        .map_err(|err| println!("{:?}", err))
        .ok();
}
