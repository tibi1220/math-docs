import { readdir, stat } from "fs/promises";
import { join } from "path";

export async function getConfigPaths(
  base: string,
  latexDir: string[],
  name = "config.yml",
  exclude = ["build"]
): Promise<string[]> {
  const configs: string[] = [];

  async function traverseDirectory(currentDir: string) {
    const files = await readdir(currentDir);

    for (const file of files) {
      const filePath = join(currentDir, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory() && exclude.indexOf(file) === -1) {
        await traverseDirectory(filePath);
      } else if (file.endsWith(name)) {
        configs.push(filePath);
        return;
      }
    }
  }

  await Promise.all(latexDir.map(dir => traverseDirectory(join(base, dir))));

  return configs;
}
