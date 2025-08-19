import fs, { type CopyOptions } from "fs-extra";

export async function copy(src: string, dest: string, opt?: CopyOptions) {
  if (!(await fs.exists(src))) {
    console.warn(`⚠️ ${src} is unknown! Skip`);
    return;
  }
  if (!(opt?.overwrite ?? true) && (await fs.exists(dest))) {
    console.log(`${dest} already existed in advance! Skip`);
    return;
  }

  await fs.copy(src, dest, opt);
  console.log(`√ ${dest} has been generated!`);
}
