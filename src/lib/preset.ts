import path from "node:path";
import fs from "fs-extra";

const assetsDir = path.resolve(__dirname, "../../assets");
export async function copyPreset(
  presets: string[] | Promise<string[]>,
  destDir: string,
) {
  if (presets instanceof Promise) presets = await presets;
  for (const preset of presets) {
    const src = path.resolve(assetsDir, preset);
    const target = path.resolve(destDir, preset);

    if (!(await fs.exists(src))) {
      console.warn(`${preset} is unknown! Skip`);
      continue;
    }
    if (await fs.exists(target)) {
      console.log(`${preset} has existed in destination directory! Skip`);
      continue;
    }

    await fs.copy(src, target, { overwrite: false, errorOnExist: true });
    console.log(`${preset} has been generated!`);
  }
}
