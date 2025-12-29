import type { Paths } from "./types";

export function toPaths<T extends Record<string, any>>(obj: T, path = "") {
  let paths: string[] = [];

  Object.getOwnPropertyNames(obj).forEach((name) => {
    const currentPath = path ? `${path}.${name}` : name;

    if (Object.hasOwn(obj, name)) {
      const value = obj[name];

      if (!value) return paths.push(currentPath);
      if (Array.isArray(value)) return paths.push(currentPath);

      if (typeof value === "object") {
        paths = paths.concat(toPaths(value, currentPath));
      }
    }

    paths.push(currentPath);
  });

  return paths as Paths<T>[];
}
