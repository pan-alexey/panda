export function trycatch<Result>(fn: Promise<Result>): Promise<{ result: Result | null; err: Error | null }> {
  return new Promise((resolve) => {
    const result: { result: Result | null; err: Error | null } = { result: null, err: null };

    fn.then((res) => {
      result.result = res as Result;
      resolve(result);
    }).catch((err) => {
      result.err = err;
      resolve(result);
    });
  });
}
