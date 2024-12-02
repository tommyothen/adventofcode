import { getSessionCookie, USER_AGENT } from "../helpers";

interface ColourMap {
  [key: string]: string;
}

function extractColours(style: string): ColourMap {
  // Example: `.calendar .calendar-color-6b { color:#009900; }`
  const colourRegex =
    /.(calendar-color-\w*) {.* color:\s?(#(?:[0-9a-fA-F]{3}){1,2})/;
  const colours: ColourMap = {};

  for (const line of style.split("\n")) {
    // Match the regex against the line
    const match = colourRegex.exec(line);

    // If we don't have a match, skip to the next line
    if (!match) continue;

    // The first capturing group is the colour name, the second is the hex code
    const [, name, hex] = match;

    colours[name] = hex;
  }

  return colours;
}

function grabTags(html: string): [string, string] {
  // We only care what's in the <main> tag
  const mainRegex = /<main>[\s\S]*?<\/main>/;
  const mainMatch = html.match(mainRegex);

  // If we can't find the main tag, throw an error
  if (!mainMatch) {
    throw new Error("Failed to extract artwork, main tag not found");
  }

  // Remove the script tags
  const scriptRegex = /<script>[\s\S]*?<\/script>/g;
  const cleaned = mainMatch[0].replace(scriptRegex, "");

  // Grab the pre tag
  const preRegex = /<pre class="calendar">([\s\S]*?)<\/pre>/;
  const preMatch = cleaned.match(preRegex);

  // Grab the style tag
  const styleRegex = /<style>([\s\S]*?)<\/style>/;
  const styleMatch = cleaned.match(styleRegex);

  // If we can't find the style or pre tags, throw an error
  if (!styleMatch || !preMatch) {
    throw new Error("Failed to extract artwork, style or pre tag not found");
  }

  return [styleMatch[1], preMatch[1]];
}

function cleanPre(pre: string): string {
  // Remove the <a> tags
  const aRegex = /<a.*?>(.*?)<\/a>/g;
  return pre.replace(aRegex, "$1");
}

function convertToSVG(content: string, colourMap: ColourMap): string {
  const CHAR_WIDTH = 8;
  const CHAR_HEIGHT = 16;
  const lines = content.split("\n");
  let svgContent: string[] = [];

  function escapeSvgChar(char: string): string {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      default:
        return char;
    }
  }

  // First convert content to a 2D array of characters with their colors
  type Cell = { char: string; color: string };
  const grid: Cell[][] = [];

  // Initialize grid with empty cells
  const maxWidth = Math.max(...lines.map((l) => l.length));
  for (let i = 0; i < lines.length; i++) {
    grid[i] = Array(maxWidth).fill({ char: " ", color: "#ffffff" });
  }

  // Fill the grid
  let currentY = 0;
  for (const line of lines) {
    let currentX = 0;
    let currentColor = "#ffffff";
    let i = 0;
    let isFutureDay = false;

    while (i < line.length) {
      if (line[i] === "<") {
        // Check for aria-hidden attribute (future day)
        if (line.slice(i).startsWith('<span aria-hidden="true"')) {
          isFutureDay = true;
          const spanEnd = line.indexOf(">", i);
          i = spanEnd + 1;
          continue;
        }

        // Handle color span start
        const spanEnd = line.indexOf(">", i);
        const span = line.slice(i, spanEnd + 1);
        const colorMatch = /class="(calendar-color-\w*)"/.exec(span);
        if (colorMatch) {
          // If it's a future day, use #333333 regardless of the class color
          currentColor = isFutureDay
            ? "#333333"
            : colourMap[colorMatch[1]] || "#ffffff";
        }
        i = spanEnd + 1;
      } else if (line[i] === "/" && line[i - 1] === "<") {
        // Handle span end
        if (line.slice(i - 1, i + 7) === "</span>") {
          currentColor = isFutureDay ? "#333333" : "#ffffff";
          i += 6; // Skip </span>
        }
      } else {
        // Handle regular character or entity
        if (line[i] === "&") {
          // Check for entity
          const entityEnd = line.indexOf(";", i);
          if (entityEnd > -1) {
            const entity = line.slice(i, entityEnd + 1);
            const char =
              entity === "&gt;"
                ? ">"
                : entity === "&lt;"
                ? "<"
                : entity === "&amp;"
                ? "&"
                : entity;
            grid[currentY][currentX] = {
              char,
              color: isFutureDay ? "#333333" : currentColor,
            };
            currentX++;
            i = entityEnd + 1;
            continue;
          }
        }

        if (line[i] !== " ") {
          grid[currentY][currentX] = {
            char: line[i],
            color: isFutureDay ? "#333333" : currentColor,
          };
        }
        currentX++;
        i++;
      }
    }
    currentY++;
  }

  // Pre-process the grid to identify and color star pairs
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length - 1; x++) {
      if (
        grid[y][x].char === "*" &&
        grid[y][x + 1].char === "*" &&
        grid[y][x].color === "#ccc" &&
        grid[y][x + 1].color === "#ccc"
      ) {
        grid[y][x].color = "#ffff66";
        grid[y][x + 1].color = "#ffff66";
      }
    }
  }

  // Now convert grid to optimized SVG text elements
  for (let y = 0; y < grid.length; y++) {
    let currentRun: string[] = [];
    let currentColor = "";
    let startX = 0;

    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];

      if (cell.char !== " " && cell.color === currentColor) {
        currentRun.push(cell.char);
      } else {
        if (currentRun.length > 0) {
          const text = currentRun.map(escapeSvgChar).join("");
          svgContent.push(
            `    <text x="${startX * CHAR_WIDTH}" y="${
              y * CHAR_HEIGHT + CHAR_HEIGHT - 4
            }" fill="${currentColor}">${text}</text>`
          );
        }

        if (cell.char !== " ") {
          currentRun = [cell.char];
          currentColor = cell.color;
          startX = x;
        } else {
          currentRun = [];
          currentColor = "";
        }
      }
    }

    if (currentRun.length > 0) {
      const text = currentRun.map(escapeSvgChar).join("");
      svgContent.push(
        `    <text x="${startX * CHAR_WIDTH}" y="${
          y * CHAR_HEIGHT + CHAR_HEIGHT - 4
        }" fill="${currentColor}">${text}</text>`
      );
    }
  }

  const width = Math.floor((maxWidth * CHAR_WIDTH) / 11);
  const height = lines.length * CHAR_HEIGHT;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 ${width} ${height}" width="${width}" height="${height}">
    <style>
        text {
            font-family: 'Source Code Pro', monospace;
            font-size: 14px;
            white-space: pre;
        }
        svg {
            background: #0f0f23;
        }
    </style>
    <rect width="100%" height="100%" fill="#0f0f23"/>
${svgContent.join("\n")}
</svg>`;
}

export default async function (): Promise<void> {
  const sessionCookie = getSessionCookie();

  // Fetch the AOC website for the current year
  const response = await fetch("https://adventofcode.com/", {
    headers: {
      cookie: `session=${sessionCookie}`,
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Advent of Code website");
  }

  const html = await response.text();

  const [style, p] = grabTags(html);
  const pre = cleanPre(p);

  const colours = extractColours(style);
  const artwork = convertToSVG(pre, colours);

  const year = new Date().getFullYear();
  Bun.write(`./artworks/${year}.svg`, artwork);
}
