use std::collections::HashSet;
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
        let mut sum: i32 = 0;

        for line in self.input.lines() {
            // Split the line in half
            let (first, second) = self.split_line_in_half(line);

            // Turn the first and second half into a set of unique characters
            let first_set = self.to_set(first);
            let second_set = self.to_set(second);

            // Find the intersection of the two sets
            let intersection = self.intersection(&[&first_set, &second_set]);

            // Get the first character in the intersection
            let first_char = intersection.iter().next().unwrap();

            // Add the character to the sum
            sum += self.char_to_priority(*first_char) as i32;
        }

        return sum.to_string();
    }

    fn part2(&self) -> String {
        let mut sum: i32 = 0;

        // Read every 3 lines at a time
        for lines in self.input.lines().collect::<Vec<&str>>().chunks(3) {
            let current_line = lines[0].to_string();
            let next_line = lines[1].to_string();
            let last_line = lines[2].to_string();

            // Find the intersection of all three lines
            let intersection = self.intersection(&[
                &self.to_set(current_line),
                &self.to_set(next_line),
                &self.to_set(last_line),
            ]);

            // Find the badge type of the group
            let badge = intersection.iter().next().unwrap();

            // Add the badge to the sum
            sum += self.char_to_priority(*badge) as i32;
        }

        return sum.to_string();
    };

    fn intersection(&self, sets: &[&HashSet<char>]) -> HashSet<char> {
        let mut intersection = sets[0].clone();

        // Loop through all the sets
        for set in sets {

            // Intersect the current set with the intersection
            intersection = intersection.intersection(set).cloned().collect();
        }

        return intersection;
    }

    fn to_set(&self, input: String) -> HashSet<char> {
        let mut set = HashSet::new();

        // For every character add it to the set
        for c in input.chars() {
            set.insert(c);
        }

        return set;
    }

    fn split_line_in_half(&self, line: &str) -> (String, String) {
        let (first, second) = line.split_at(line.len() / 2);

        return (first.to_string(), second.to_string());
    }

    fn char_to_priority(&self, letter: char) -> u8 {
        let shift;

        // Check the case of the letter
        if letter.is_ascii_lowercase() {
            // Lowercase letter
            shift = 96;
        } else {
            // Uppercase letter
            shift = 38;
        }

        // Return the priority
        return (letter as u8) - shift;
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
