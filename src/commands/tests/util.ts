import type * as yargs from "yargs";

export function doParse<T>(parser: yargs.Argv<T>, opts: string) {
  // TS can't choose the correct overload, so the 2nd arg of undefined is neccessary (2025 Aug.26)
  return new Promise(resolve =>
    parser.parse(opts, undefined, (err, argv, output) =>
      resolve({ err, argv, output }),
    ),
  );
}
