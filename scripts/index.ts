import generateBashScript from "./shell";
import { getConfigPaths, mergeDeps, parseYaml } from "./parser";

import { join } from "path";
import { cwd } from "process";
import { writeFile } from "fs/promises";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { stringify } from "yaml";

const CONFIG_NAME = "config.yml";
const BASE_DIR = cwd();
const LATEX_DIRS = [
  { dirs: ["book", "handout"], name: "root" },
  { dirs: ["exercise", "graphics"], name: "standalone" },
];
const GENERATED = "generate";
const SHEBANG = "#!/bin/bash";

const GENERATED_DIR = join(BASE_DIR, GENERATED);

if (!existsSync(GENERATED_DIR)) {
  mkdirSync(GENERATED_DIR);
}

LATEX_DIRS.forEach(async ({ dirs, name }) => {
  const configs = await getConfigPaths(BASE_DIR, dirs, CONFIG_NAME);

  const rcFile = join(BASE_DIR, ".latexmkrc.production");

  const parsed = await Promise.all(
    configs.map(async cfg => parseYaml(cfg, BASE_DIR, rcFile, "build"))
  );

  const deps = mergeDeps(parsed);

  const merged: MergedConfig = {
    external_deps: deps,
    latex_roots: parsed,
  };

  const script = generateBashScript(merged, name, SHEBANG);

  writeFile(join(GENERATED_DIR, name + "-deps.yml"), stringify(deps));
  writeFile(join(GENERATED_DIR, name + "-compile.yml"), stringify(parsed));

  const dependencyStream = createWriteStream(
    join(GENERATED_DIR, name + "-deps.sh"),
    { mode: 0o755 }
  );

  dependencyStream.write(script.dependency);
  dependencyStream.end();

  const compileStream = createWriteStream(
    join(GENERATED_DIR, name + "-compile.sh"),
    { mode: 0o755 }
  );

  compileStream.write(script.compile);
  compileStream.end();
});
