import { join } from "node:path";
import { readJSONSync, writeJSONSync } from "fs-extra";
import { readonlyHandler } from "./usefulProxies.js";

function propretyDefiner(
  obj: Object,
  name: PropertyKey,
  attr: PropertyDescriptor & ThisType<any>,
) {
  if (attr.get) throw new TypeError("No getter");
  if (attr.set) throw new TypeError("No setter");
  if (attr.writable === false) throw TypeError("New property must be writable");
  if (attr.enumerable === false)
    throw TypeError("New property must be enumerable");
  if (attr.configurable === false)
    throw TypeError("New property must be configurable");
  (obj as any)[name] = attr.value;
  return true;
}

export class Package {
  /** Path to the directory of package.json */
  readonly path: string;
  /** Transparent and frozen packageing of package.json */
  readonly manifest: Object;
  /** A proxy whose properties you can get and set just like you are
   * operating the package.json.
   * Note: if you use Object.defineProperty, package.json won't be updated
   * until you call manifestProxy like a function. */
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
        defineProperty: propretyDefiner,
        apply(obj) {
          writeJSONSync(join(path, "package.json"), obj);
        },
      });
      return [readonlyProxy, operatableProxy];
    })();
  }
}
