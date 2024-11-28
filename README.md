# 🎄 Advent of Code

A collection of solutions to the [Advent of Code](https://adventofcode.com/) challenges written
in TypeScript using the [Bun](https://bun.sh) runtime.

## Overview

This repository contains my colutions to Advent of Code, an annual series of programming challenges released
daily in December. After experimenting with Rust in 2022, I've chosen TypeScript as my launguage of choice for
all future challenges, allowing me to focus on the problems themselves rather than the language.

## Goals

In 2023, I was able to complete Day 1-10 before I struggled to keep up with the daily challenges. In 2024,
I aim to complete more of the challenges, ideally finishing all 25 days, however, I will be happy with any progress I make.

## Project Structure

```
.
└── years
    └── YYYY
        └── DD          # Solutions for each day
```

## Setup

This projects uses Bun as a runtime and aims for no dependencies that provide functionality that is not
already available in the runtime. However, any packages that provide visual output or other non-essential
functionality, such as `chalk`, are allowed in my book.

### Requirements

1. Install [Bun](https://bun.sh) using the instructions on the website.
2. Clone this repository and navigate to the root directory.
3. Run `bun install` to install the required dependencies.

### Development Workflow

The repository includes a custom CLI tool to streamline the development process. Here's how to use it:

```bash
# Run solutions
bun cli run           # Run solution for current day
bun cli run 2023/01   # Run solution for specific day

# Create new solutions
bun cli create        # Create solution for current day
bun cli create 2023/01   # Create solution for specific day

# Fetch inputs (requires session cookie)
bun cli input         # Get input for current day
bun cli populate      # Get input for all days with solutions

# Help
bun cli help          # Show all available commands

# Testing
bun test              # Run test suite
```

Each solution directory will be automatically populated with the necessary template files when using the
create command. Input files can be automatically downloaded if you provide your Advent of Code session cookie.

### Automated Setup

This repository includes a GitHub Action that automatically creates solution templates for each day of the Advent of Code event. The actions runs daily at midnight during December 1-25, creating the necessary directory structure and files for that day's challenge. This ensures that everything is ready to go when the challenge is released.

## Contributing

This repository primarily serves as a personal collection of solutions, but feel free to use it as
inspiration for your own Advent of Code journey. If you spot any issues or have suggestions for
improvements, please open an issue or submit a pull request.

## License

This repository is licensed under the MIT license. See [LICENSE](LICENSE) for more information.

---
```md
           *
         _/ \_
        \     /
        /_' '_\
         /  -\
        /.*@@ \
       /  ' + -\
      /  -o *'+ \
     /   .*  -@+ \
    *-------------*
       [_______]
        \_____/
```
- ASCII tree by [xmas-tree](https://github.com/importre/xmas-tree)

Happy Coding! 🎉
