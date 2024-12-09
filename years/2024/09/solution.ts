import { prettyPrintResults, timeit } from "@/utils";
import { resolve } from "path";

/**
 * ### Advent of Code 2024 - Day 9
 */
export default class Solution {
  private static input: Promise<string> = Bun.file(
    resolve(import.meta.dir, "./input.txt")
  ).text();

  public static async solve() {
    const input = await Solution.input;

    return {
      part1: await timeit(Solution.part1, [input]),
      part2: await timeit(Solution.part2, [input]),
    };
  }

  public static async part1(input: string): Promise<number> {
    // First pass: count total size needed
    let totalSize = 0;
    for (let i = 0; i < input.length; i += 2) {
      totalSize +=
        parseInt(input[i]) +
        (i + 1 < input.length ? parseInt(input[i + 1]) : 0);
    }

    // Create disk map
    const diskMap = new Array<number | undefined>(totalSize);
    let pos = 0;

    // Fill disk map
    for (let i = 0; i < input.length; i += 2) {
      const fileId = Math.floor(i / 2);
      const blockSize = parseInt(input[i]);
      const freeSpace = i + 1 < input.length ? parseInt(input[i + 1]) : 0;

      // Fill file blocks
      for (let j = 0; j < blockSize; j++) {
        diskMap[pos++] = fileId;
      }
      // Fill free space
      pos += freeSpace;
    }

    // Compact in single pass using two pointers
    let write = 0;
    let read = diskMap.length - 1;

    // Find first empty space
    while (write < diskMap.length && diskMap[write] !== undefined) {
      write++;
    }

    // Compact files
    while (read > write) {
      // Find next file from right
      while (read > write && diskMap[read] === undefined) {
        read--;
      }

      // Move file if found
      if (diskMap[read] !== undefined) {
        diskMap[write] = diskMap[read];
        diskMap[read] = undefined;
        write++;
        read--;
      }

      // Find next empty space
      while (write < read && diskMap[write] !== undefined) {
        write++;
      }
    }

    // Calculate checksum up to first undefined
    let checksum = 0;
    for (let i = 0; diskMap[i] !== undefined; i++) {
      checksum += diskMap[i]! * i;
    }

    return checksum;
  }

  public static async part2(input: string): Promise<number> {
    let diskMap: Array<number | undefined> = [];

    // Initial disk map creation
    for (let i = 0; i < input.length; i += 2) {
      let [blockSize, freeSpace] = input
        .slice(i, i + 2)
        .split("")
        .map(Number);
      if (freeSpace === undefined) freeSpace = 0;

      const fileId = Math.floor(i / 2);
      diskMap.push(...Array<number>(blockSize).fill(fileId));
      diskMap.push(...Array<undefined>(freeSpace).fill(undefined));
    }

    // Create a map of file data
    const fileData = new Map<
      number,
      { start: number; end: number; length: number }
    >();

    // Find start, end, and length of each file
    for (let i = 0; i < diskMap.length; i++) {
      const fileId = diskMap[i];
      if (fileId === undefined) continue;

      if (!fileData.has(fileId)) {
        fileData.set(fileId, {
          start: i,
          end: i,
          length: 1,
        });
      } else {
        const data = fileData.get(fileId)!;
        data.end = i;
        data.length = data.end - data.start + 1;
      }
    }

    // Process files in reverse ID order
    const fileIds = Array.from(fileData.keys()).sort((a, b) => b - a);

    // Compact files
    for (const fileId of fileIds) {
      const file = fileData.get(fileId)!;

      // Find the leftmost space that can fit the file
      let bestFit = -1;
      let consecutiveSpaces = 0;
      let currentStart = -1;

      // Only look until the start of this file
      for (let i = 0; i < file.start; i++) {
        if (diskMap[i] === undefined) {
          if (currentStart === -1) currentStart = i;
          consecutiveSpaces++;

          if (consecutiveSpaces >= file.length) {
            bestFit = currentStart;
            break;
          }
        } else {
          currentStart = -1;
          consecutiveSpaces = 0;
        }
      }

      // If we found a fit, move the file
      if (bestFit !== -1) {
        // Clear old positions
        for (let i = file.start; i <= file.end; i++) {
          diskMap[i] = undefined;
        }

        // Set new positions
        for (let i = 0; i < file.length; i++) {
          diskMap[bestFit + i] = fileId;
        }

        // Update file data
        fileData.set(fileId, {
          start: bestFit,
          end: bestFit + file.length - 1,
          length: file.length,
        });
      }
    }

    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < diskMap.length; i++) {
      if (diskMap[i] === undefined) continue;
      checksum += diskMap[i]! * i;
    }

    return checksum;
  }
}

export async function main(): Promise<[number, number]> {
  const { part1, part2 } = await Solution.solve();
  prettyPrintResults([part1, part2]);

  Bun.write(
    resolve(import.meta.dir, "./output.txt"),
    `${part1.result}\n${part2.result}`
  );

  return [part1.result, part2.result];
}
