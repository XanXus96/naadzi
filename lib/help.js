const commands = [
  {
    long_option: "help",
    short_option: "h",
    description: "display this help message",
  },
  {
    long_option: "path",
    short_option: "p",
    description: "the absolute or relative path to the image (required)",
  },
  {
    long_option: "width",
    short_option: "w",
    description: "the width of the output in characters (optional[default=80])",
  },
  {
    long_option: "colors",
    short_option: "c",
    description: "flag for using colors (optional)",
  },
  {
    long_option: "output",
    short_option: "o",
    description:
      "the absolute or relative output path with filename (optional[default='./ascii-art.txt'])",
  },
];

const help = () => {
  console.table(
    commands.map((command) => {
      return {
        "Long Option": command.long_option,
        "Short Option": command.short_option,
        Description: command.description,
      };
    })
  );
  process.exit();
};

module.exports = help;
