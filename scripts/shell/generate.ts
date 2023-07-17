import depsToBash from "./dependency";
import configToBash from "./compile";
import { echo, INFO } from "./util";

import type { ParsedDeps, ParsedConfig } from "../types";

export function generateDependencyScript(
  config: ParsedDeps[],
  shebang = "#!/bin/bash"
) {
  let script = shebang + "\n\n";

  if (!config.length) return script + echo("No dependencies required", INFO);

  script += echo("Installing dependencies.", INFO);

  script += "\n" + depsToBash(config) + "\n\n\n";

  script += `echo -e ""\n`;

  script += echo("Dependencies successfully installed.", INFO);

  return script;
}

export function generateCompileScript(
  config: ParsedConfig[],
  shebang = "#!/bin/bash"
) {
  let script = shebang + "\n\n";

  script += echo("Compiling documents.", INFO);

  script += "\ncurrent_dir=$(pwd)\n\n\n";

  script += configToBash(config);

  script += echo("Documents successfully compiled.", INFO);

  script += "\ncd $current_dir\n\n\n";

  return script;
}
