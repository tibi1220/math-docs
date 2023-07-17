import { readdir, stat } from "fs/promises";
import { join } from "path";

export async function getConfigPaths(
  base: string,
  latexDir: string,
  name = "config.yml",
  // exclude = /(node_modules|build|dist|scripts|python|\.pnpm)/gi
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

  await traverseDirectory(join(base, latexDir));

  return configs;
}
