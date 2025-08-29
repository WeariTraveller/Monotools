import type * as yargs from "yargs";

type PrsClbk<T> = yargs.ParseCallback<T>;
export type PrsClbkParam<T> = Parameters<PrsClbk<T>>;
export type ParseResult<T> = {
  err: PrsClbkParam<T>[0];
  argv: PrsClbkParam<T>[1];
  output: PrsClbkParam<T>[2];
};

export function doParse<T>(
  parser: yargs.Argv<T>,
  opts: string,
): Promise<ParseResult<T>> {
  // TS can't choose the correct overload, so the 2nd arg of undefined is neccessary (2025 Aug.26)
  return new Promise(resolve =>
    parser.parse(opts, undefined, (err, argv, output) =>
      resolve({ err, argv, output }),
    ),
  );
}
