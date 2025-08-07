import type { CommandModule } from "yargs";

const command: CommandModule = {
  command: "updateTsRef",
  describe: "Update (and fix) the project references in each tsconfig.json",
  async handler() {
    const { updateTsRef } = await import("../lib/updateTsRef.js");
    updateTsRef();
  },
};

export default command;
