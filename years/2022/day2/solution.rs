use std::collections::HashMap;
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
        let mut result = 0;

        for line in self.input.lines() {
            result += self.calc_rps_round(line);
        }

        result.to_string()
    }

    fn part2(&self) -> String {
        let mut result = 0;

        for line in self.input.lines() {
            result += self.calc_rps_round_with_prediction(line);
        }

        result.to_string()
    }

    fn calc_rps_round(&self, round: &str) -> i32 {
        // Replace the characters with "rock", "paper" or "scissors"
        let round_rewritten = round
            // Replace opponent's moves
            .replace("A", "rock")
            .replace("B", "paper")
            .replace("C", "scissors")
            // Replace players moves
            .replace("X", "rock")
            .replace("Y", "paper")
            .replace("Z", "scissors");

        // Split by spaces
        let mut rps = round_rewritten.split(" ");

        // Get the moves
        let opponent_move = rps.next().unwrap();
        let player_move = rps.next().unwrap();

        // Determine the winner
        let round_outcome = match (opponent_move, player_move) {
            ("rock", "rock") => "draw",
            ("rock", "paper") => "win",
            ("rock", "scissors") => "lose",
            ("paper", "rock") => "lose",
            ("paper", "paper") => "draw",
            ("paper", "scissors") => "win",
            ("scissors", "rock") => "win",
            ("scissors", "paper") => "lose",
            ("scissors", "scissors") => "draw",
            _ => "none",
        };

        // Calculate the result
        let scores_map = HashMap::from([
            ("rock", 1),
            ("paper", 2),
            ("scissors", 3),
            ("lose", 0),
            ("draw", 3),
            ("win", 6),
        ]);

        let score = scores_map.get(player_move).unwrap() + scores_map.get(round_outcome).unwrap();

        // Return the result
        return score;
    }

    fn calc_rps_round_with_prediction(&self, round: &str) -> i32 {
        // Replace the characters with "rock", "paper" or "scissors"
        let round_rewritten = round
            // Replace opponent's moves
            .replace("A", "rock")
            .replace("B", "paper")
            .replace("C", "scissors")
            // Replace the desired result
            .replace("X", "lose")
            .replace("Y", "draw")
            .replace("Z", "win");

        // Split by spaces
        let mut rps = round_rewritten.split(" ");

        // Get the values
        let opponent_move = rps.next().unwrap();
        let desired_result = rps.next().unwrap();

        // Get the player's move
        let player_move = match (opponent_move, desired_result) {
            ("rock", "lose") => "scissors",
            ("rock", "draw") => "rock",
            ("rock", "win") => "paper",
            ("paper", "lose") => "rock",
            ("paper", "draw") => "paper",
            ("paper", "win") => "scissors",
            ("scissors", "lose") => "paper",
            ("scissors", "draw") => "scissors",
            ("scissors", "win") => "rock",
            _ => "none",
        };

        // Calculate the result
        let scores_map = HashMap::from([
            ("rock", 1),
            ("paper", 2),
            ("scissors", 3),
            ("lose", 0),
            ("draw", 3),
            ("win", 6),
        ]);

        let score = scores_map.get(player_move).unwrap() + scores_map.get(desired_result).unwrap();

        // Return the result
        return score;
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
