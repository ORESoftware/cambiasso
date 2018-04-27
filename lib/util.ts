export const isValidDirname = function (dir: string) {
  return !/[<>:"/\\|?*]/.test(dir);
};