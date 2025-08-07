import type { CommandModule } from "yargs";

interface Argv {
  presets: string[];
  dest: string;
}

const command: CommandModule<{}, Argv> = {
  command: "preset [presets..]",
  describe: "Generate (specific) presets in your workspace",
  builder(yargs) {
    return yargs
      .positional("presets", {
        describe: "Names of presets that need generating",
        type: "string",
        array: true,
        default: [],
      })
      .option("dest", {
        alias: "d",
        describe: "Where to generate presets",
        type: "string",
        default: ".",
      });
  },
  async handler(argv) {
    const { copyPreset } = await import("../lib/preset.js");
    copyPreset(argv.presets, argv.dest);
  },
};

export default command;
