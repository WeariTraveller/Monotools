import { join } from "node:path";
import { readJSONSync, writeJSONSync } from "fs-extra";
import { readonlyHandler } from "./usefulProxies.js";

export class Package {
  readonly path: string;
  /** Transparent and non-extensible packageing of package.json */
  readonly manifest: Object;
  /** A proxy whose properties you can get and set just like you are
   * operating the package.json.
   * Don't use Object.defineProperty on it, or you'll get SyntaxError */
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
      const readonlyProxy = new Proxy(manifest, readonlyHandler);
      const operatableProxy = new Proxy(manifest, {
        set(obj, name, value, receiver) {
          if (receiver) throw new TypeError("No setter so no receiver");
          obj[name] = value;
          writeJSONSync(join(path, "package.json"), obj);
          return true;
        },
        defineProperty() {
          throw new SyntaxError("Don't use defineProperty");
        },
      });
      return [readonlyProxy, operatableProxy];
    })();
  }
}
