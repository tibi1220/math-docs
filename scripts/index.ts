import { getConfigPaths, mergeDeps, parseYaml } from "./parser";

import { join } from "path";
import { cwd } from "process";
import { writeFile } from "fs/promises";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { stringify } from "yaml";

import type { MergedConfig } from "./types";
import generateBashScript from "./shell";

const CONFIG_NAME = "config.yml";
const BASE_DIR = cwd();
const LATEX_DIRS = ["root_file", "exercise"];
const GENERATED = "generate";
const SHEBANG = "#!/bin/bash";

const GENERATED_DIR = join(BASE_DIR, GENERATED);

if (!existsSync(GENERATED_DIR)) {
  mkdirSync(GENERATED_DIR);
}

LATEX_DIRS.forEach(async dir => {
  const configs = await getConfigPaths(BASE_DIR, dir, CONFIG_NAME);

  const parsed = await Promise.all(configs.map(parseYaml));

  const deps = mergeDeps(parsed);

  const merged: MergedConfig = {
    external_deps: deps,
    latex_roots: parsed,
  };

  const script = generateBashScript(merged, SHEBANG);

  writeFile(join(GENERATED_DIR, dir + "-deps.yml"), stringify(deps));
  writeFile(join(GENERATED_DIR, dir + "-compile.yml"), stringify(parsed));

  const dependencyStream = createWriteStream(
    join(GENERATED_DIR, dir + "-deps.sh"),
    { mode: 0o755 }
  );

  dependencyStream.write(script.dependency);
  dependencyStream.end();

  const compileStream = createWriteStream(
    join(GENERATED_DIR, dir + "-compile.sh"),
    { mode: 0o755 }
  );

  compileStream.write(script.compile);
  compileStream.end();
});
