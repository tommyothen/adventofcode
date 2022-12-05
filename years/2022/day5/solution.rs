use std::collections::VecDeque;
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
        let (mut stacks, lines) = self.parse_input();

        for line in lines.lines() {
            // Parse the line
            let (amount, from, to) = self.parse_move(line);

            // Execute the move
            for _ in 0..amount {
                let crate_ = stacks[from-1].pop_back().unwrap();
                stacks[to-1].push_back(crate_);
            }
        }

        // Return the top crate of each stack
        let mut result = "".to_string();

        for mut stack in stacks {
            let crate_ = stack.pop_back().unwrap();
            result += &crate_.to_string();
        }

        return result;
    }

    fn part2(&self) -> String {
        let (mut stacks, lines) = self.parse_input();

        for line in lines.lines() {
            // Parse the line
            let (amount, from, to) = self.parse_move(line);

            // Get the crates to move
            let mut crates = VecDeque::new();
            for _ in 0..amount {
                let crate_ = stacks[from-1].pop_back().unwrap();
                crates.push_front(crate_);
            }

            // Execute the move
            for crate_ in crates {
                stacks[to-1].push_back(crate_);
            }
        }

        // Return the top crate of each stack
        let mut result = "".to_string();

        for mut stack in stacks {
            let crate_ = stack.pop_back().unwrap();
            result += &crate_.to_string();
        }

        return result;
    }

    fn parse_move(&self, line: &str) -> (usize, usize, usize) {
        let formatted = line
            .to_string()
            .replace("move ", "")
            .replace(" from ", ",")
            .replace(" to ", ",");

        let nums = formatted
            .split(",")
            .collect::<Vec<&str>>()
            .iter()
            .map(|x| x.parse::<usize>().unwrap())
            .collect::<Vec<usize>>();

        return (nums[0], nums[1], nums[2]);
    }

    fn parse_input(&self) -> (Vec<VecDeque<char>>, String) {
        // Get the first 8 lines of the input
        let lines = self.input.lines().take(8);
        // Get the rest of the input
        let rest = self
            .input
            .lines()
            .skip(10)
            .collect::<Vec<&str>>()
            .join("\n");

        // Format the lines so we only have every 4x+1 character
        let mut formatted_lines = lines
            .map(|line| {
                let mut chars: String = "".to_string();

                for (i, c) in line.chars().enumerate() {
                    if i % 4 == 1 {
                        chars += &c.to_string();
                    }
                }

                return chars;
            })
            .collect::<Vec<String>>();

        // Flip the lines so we read from bottom to top
        formatted_lines.reverse();

        // Create a VecDeque for each column
        let mut columns = vec![VecDeque::<char>::new(); 9];

        // For each formatted line, add the characters to the corresponding column
        for line in &formatted_lines {
            for (i, c) in line.chars().enumerate() {
                if c != ' ' {
                    columns[i].push_back(c);
                }
            }
        }

        return (columns, rest);
    }
}

fn main() {
    // Read the input
    let input = std::fs::read_to_string("input.txt").unwrap();

    // Create the solution
    let solution = Solution::new(&input);

    // Run the solutions
    let (part1, part2) = (solution.part1(), solution.part2());
    println!("Part 1: {}", part1);
    println!("Part 2: {}", part2);

    // Create the output file
    let mut file = File::create("output.txt").unwrap();

    // Write the solutions to the output file
    let output = format!("{}\n{}", part1, part2);
    file.write_all(output.as_bytes())
        .map_err(|err| println!("{:?}", err))
        .ok();
}
