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
        self.input.clone()
    }

    fn part2(&self) -> String {
        self.input.clone()
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
