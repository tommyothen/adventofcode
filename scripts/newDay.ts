import { join } from "path";
import { exec } from "child_process";
import { existsSync } from "fs";
const config = require("./config.json");

// Get the year
const [day, year] = (() => {
  const date = new Date();
  return [date.getDate() + 1, date.getFullYear()];
})();

// Get the language
const language = config.languages[year];

// Copy the template to the new day
const templatePath = join(__dirname, "../templates", language);
const dayPath = join(__dirname, "../years", year.toString(), `day${day}`);

// If day already exists, don't do anything
if (existsSync(dayPath)) {
  console.log(`Day ${day} already exists`);
  process.exit(0);
}

// Run the bash command
exec(`cp -r ${templatePath} ${dayPath}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Created new day ${day} for ${year} in ${language}`);
});
