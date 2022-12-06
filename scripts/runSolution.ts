import * as yargs from "yargs";
import { exec } from "child_process";
import { prompt } from "enquirer";
const config = require("./config.json");
const { AutoComplete } = require("enquirer");

const langs: {
  [key: string]: string;
} = config.languages;

const selectYear = async (): Promise<{ year: string }> => {
  // Get the year from the choices of 2015-202?
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    {
      length: currentYear - 2015 + 1,
    },
    (_, i) => 2022 - i
  );

  return await prompt({
    type: "select",
    name: "year",
    message: "What year is it?",
    choices: years.map((year) => year.toString()),
  });
};

const selectDay = async (): Promise<string> => {
  // Get the day from the choices of 1-25 starting at todays date
  const todayDay = new Date().getDate();
  const days = Array.from(
    {
      length: 25,
    },
    (_, i) => `Day ${((i + todayDay - 1) % 25) + 1}`
  );

  return new AutoComplete({
    name: "day",
    message: "What day is it?",
    choices: days,
    limit: 5,
  }).run();
};

const run: {
  [key: string]: (year: string, day: number) => void;
} = {
  "Rust": (year, day) => {
    // In the future I want to use the cargo run --release --bin 2022-04

    // For now we will cd into the directory and run cargo single
    exec(`cd years/${year}/day${day} && cargo single run solution.rs`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else if (stderr) {
        console.error(stderr);
      } else if (stdout) {
        console.log(stdout);
      }

      return exec("cd ../../..", () => {});
    });
  },

  "Python": (year, day) => {
    exec(`cd years/${year}/day${day} && python solution.py`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else if (stderr) {
        console.error(stderr);
      } else if (stdout) {
        console.log(stdout);
      }

      return exec("cd ../../..", () => {});
    });
  }
};

async function runSolution() {
  const args = await yargs.argv;
  const year = (args.year as string) || (await selectYear()).year;
  const day = (args.day as string) || (await selectDay()).replace("Day ", "");

  run[langs[year]](year, Number(day));
}

runSolution();
