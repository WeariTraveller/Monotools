import { join } from "node:path";
import { readJSONSync } from "fs-extra";

export class Package {
  readonly path: string;
  /** Transparent and non-extensible packageing of package.json */
  readonly manifest: Object;
  /** A proxy whose properties you can get and set just like you are
   * operating the package.json */
  readonly manifestProxy: Object;

  constructor(path: string) {
    this.path = path;

    // Use closure to make the real manifest object invisible even if inside the class
    [this.manifest, this.manifestProxy] = (() => {
      const manifest = readJSONSync(join(path, "package.json"));
      if (typeof manifest !== "object")
        throw new TypeError(
          "package.json is invalid as not parsed into an object",
        );
      const readonlyProxy = new Proxy(manifest, {});
      const operatableProxy = new Proxy(manifest, {});
      return [readonlyProxy, operatableProxy];
    })();
  }
}
