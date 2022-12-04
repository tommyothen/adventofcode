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
        let mut counter = 0;

        for line in self.input.lines() {
            // Process line
            let (first_range, second_range) = self.process_line(line);

            // If either of the ranges are contained within eachother, increment counter
            if first_range.0 >= second_range.0 && first_range.1 <= second_range.1 {
                counter += 1;
            } else if second_range.0 >= first_range.0 && second_range.1 <= first_range.1 {
                counter += 1;
            }
        }

        return counter.to_string();
    }

    fn part2(&self) -> String {
        let mut counter = 0;

        for line in self.input.lines() {
            // Process line
            let (first_range, second_range) = self.process_line(line);

            // If the ranges overlap, increment counter
            if first_range.0 <= second_range.1 && first_range.1 >= second_range.0 {
                counter += 1;
            }
        }

        return counter.to_string();
    }

    fn process_line(&self, line: &str) -> ((u32, u32), (u32, u32)) {
        // Split on ","
        let (first_range, second_range) = line.split_at(line.find(",").unwrap());

        // Split on "-"
        let (first_range_start, first_range_end) = first_range.split_at(first_range.find("-").unwrap());
        let (second_range_start, second_range_end) = second_range.split_at(second_range.find("-").unwrap());

        // Parse to u32
        let ranges = (
            (
                first_range_start.parse::<u32>().unwrap(),
                first_range_end[1..].parse::<u32>().unwrap(),
            ),
            (
                second_range_start[1..].parse::<u32>().unwrap(),
                second_range_end[1..].parse::<u32>().unwrap(),
            ),
        );

        // Return ranges
        return ranges;
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
