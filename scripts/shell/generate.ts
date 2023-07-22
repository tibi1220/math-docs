import depsToBash from "./dependency";
import configToBash from "./compile";
import { echo, INFO } from "./util";
import chalk from "chalk";

export function generateDependencyScript(
  config: ParsedDeps[],
  name: string,
  shebang = "#!/bin/bash"
) {
  let script = shebang + "\n\n";

  const cName = chalk.green(name);

  if (!config.length) {
    return script + echo(`No dependencies required for ${cName} files.`, INFO);
  }

  script += echo(`Installing dependencies for ${cName} files`, INFO);

  script += "\n" + depsToBash(config) + "\n\n\n";

  script += `echo -e ""\n`;

  script += echo(
    `Dependencies successfully installed for ${cName} files`,
    INFO
  );

  return script;
}

export function generateCompileScript(
  config: ParsedConfig[],
  name: string,
  shebang = "#!/bin/bash"
) {
  let script = shebang + "\n\n";

  const cName = chalk.green(name);

  script += echo(`Compiling ${cName} files.`, INFO);

  script += "\ncurrent_dir=$(pwd)\n\n";

  script += configToBash(config, name);

  return script;
}
