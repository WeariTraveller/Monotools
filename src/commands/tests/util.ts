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
  return new Promise(resolve =>
    // TS can't choose the correct overload, so the 2nd arg of {} is neccessary (2025 Aug.26)
    parser.parse(opts, {}, (err, argv, output) =>
      resolve({ err, argv, output }),
    ),
  );
}
