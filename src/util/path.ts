export const dirname = (path: string): string => {
  const split = path.split('/');
  return split.slice(0, split.length - 1).join('/')!;
};

export const basename = (path: string): string => {
  return path.split('/').at(-1)!;
};

export default {
  dirname,
  basename,
};
