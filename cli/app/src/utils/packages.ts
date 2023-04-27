export const getPackageJson = (name?: string): Record<string, unknown> | null => {
  if (!name) return {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const resolvePackage = require(`${name}/package.json`);
    return resolvePackage || null;
  } catch (error) {
    return null;
  }
};

export const resolvePackageFile = (filePath: string): string | null => {
  try {
    const packagePath = require.resolve(filePath);
    if (!packagePath) {
      return null;
    }
    return packagePath;
  } catch (error) {
    return null;
  }
};
