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
        "Not implemented".to_string()
    }

    fn part2(&self) -> String {
        "Not implemented".to_string()
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
