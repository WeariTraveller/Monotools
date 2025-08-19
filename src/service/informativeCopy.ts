import path from "node:path";
import fs from "fs-extra";

const assetsDir = path.join(__dirname, "../../assets");
export async function copy(presets: string[], destDir: string) {
  for (const preset of presets) {
    const src = path.join(assetsDir, preset);
    const target = path.join(destDir, preset);

    if (!(await fs.exists(src))) {
      console.warn(`${preset} is unknown! Skip`);
      continue;
    }
    if (await fs.exists(target)) {
      console.log(`${preset} already existed in advance! Skip`);
      continue;
    }

    await fs.copy(src, target, { overwrite: false, errorOnExist: true });
    console.log(`√ ${preset} has been generated!`);
  }
}
