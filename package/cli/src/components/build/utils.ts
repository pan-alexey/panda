export const isPackage = (name?: string): boolean => {
  if (!name) return false;
  try {
    const resolvePackage = require.resolve(name);
    return !!resolvePackage;
  } catch (error) {
    return false;
  }
};
