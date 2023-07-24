import depsToBash from "./dependency";
import configToBash from "./compile";
import { echo, INFO } from "./util";
import chalk from "chalk";

export function generateDependencyScript(
  config: ParsedDeps[],
  name: string,
  shebang = "#!/bin/bash"
) {
  name = chalk.green(name);

  let script = shebang + "\n\n";

  if (!config.length) {
    return script + echo(`No dependencies required for ${name} files.`, INFO);
  }

  script += echo(`Installing dependencies for ${name} files`, INFO);

  script += "\n" + depsToBash(config) + "\n\n\n";

  script += `echo -e ""\n`;

  script += echo(`Dependencies successfully installed for ${name} files`, INFO);

  return script;
}

export function generateCompileScript(
  config: ParsedConfig[],
  name: string,
  shebang = "#!/bin/bash"
) {
  name = chalk.green(name);

  let script = shebang + "\n\n";

  script += echo(`Compiling ${name} files.`, INFO);

  script += "\ncurrent_dir=$(pwd)\n\n\n";

  script += configToBash(config);

  script += echo(`Successfully compiled ${name} files.`, INFO);

  script += "\ncd $current_dir\n\n\n";

  return script;
}
