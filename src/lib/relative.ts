import { relative } from "upath";

export default function (from: string, to: string) {
  const path = relative(from, to);
  if (path.length === 0) return ".";
  // Instead of `startsWith(".")`, in case of ".profile"
  if (!path.startsWith("./") && !path.startsWith("../")) return `./${path}`;
  return path;
}
