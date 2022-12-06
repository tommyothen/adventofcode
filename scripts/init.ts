import * as yargs from "yargs";
import { prompt } from "enquirer";
import { existsSync } from "fs";
import { copySync } from "fs-extra";
import { join } from "path";
const { AutoComplete } = require("enquirer");
const config = require("./config.json");

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

const createDay = (year: string, day: string) => {
  const language = langs[year];

  // Copy the template to the new day
  const templatePath = join(__dirname, "../templates", language);
  const dayPath = join(__dirname, "../years", year.toString(), `day${Number(day)}`);

  // If day already exists, don't do anything
  if (existsSync(dayPath)) {
    console.log(`Day ${day} already exists`);
    process.exit(0);
  }

  // Run the copy command using fs-extra
  copySync(templatePath, dayPath, {
    recursive: true,
  });
};

async function init() {
  const args = await yargs.argv;
  const year = (args.year as string) || (await selectYear()).year;
  const day = (args.day as string) || (await selectDay()).replace("Day ", "");

  createDay(year, day);
}

init();
