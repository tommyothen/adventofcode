use std::fs::File;
use std::io::prelude::*;
use::std::collections::HashSet;

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
        let mut index: i32 = -1;

        for i in 0..self.input.len()-4 {
            let set = self.get_n_chars(i, 4);

            if set.len() == 4 {
                index = (i+4) as i32;
                break;
            }
        }

        return index.to_string();
    }

    fn part2(&self) -> String {
        let mut index: i32 = -1;

        for i in 0..self.input.len()-14 {
            let set = self.get_n_chars(i, 14);

            if set.len() == 14 {
                index = (i+14) as i32;
                break;
            }
        }

        return index.to_string();
    }

    fn get_n_chars(&self, pos: usize, n: usize) -> HashSet<char> {
        let mut set = HashSet::new();

        for i in 0..n {
            set.insert(self.input.chars().nth(pos+i).unwrap());
        }

        return set;
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
