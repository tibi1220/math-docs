import { echo, log, INFO, ERROR } from "./util";

import chalk from "chalk";
const g = chalk.green;

export default function configToBash(config: ParsedConfig[], name: string) {
  let script = `errorCount=0\n\n`;

  const logger = log(name);

  script += logger.begin() + "\n\n";

  config.forEach(cfg => {
    script += echo(`Compiling documents in ${g(cfg.source_path)}`, INFO);

    script += `\ncd ${cfg.source_path}\n`;

    // prettier-ignore
    script += cfg.root_files.map(file => `
${echo(`Now compiling ${file.input}.tex`, INFO)}

if ${file.resolver}; then
  ${echo(`${file.input_long} successfully compiled`, INFO)}
  ${echo(`${file.output_long} has been generated`, INFO)}
  ${logger.write(`Compilation successful [${file.input_long} -> ${file.output_long}]`, "info")}
else
  ${echo(`An error occured while compiling ${file.input_long}`, ERROR)}
  ${logger.write(`Error during compilation [${file.input_long} -> ${file.output_long}]`, "error")}
  errorCount=$((errorcount + 1))
fi
`).join("\n");

    script += `\ncd $current_dir\n`;
  });

  script += `
if (( $errorCount > 0 )); then
  ${echo(`Some errors ($errorCount) have occured during compilation`, ERROR)}
  exit 1
else
  ${echo(`Successfully compiled ${g(name)} files.`, INFO)}
  exit 0
fi\n
`;

  script += logger.end();

  return script;
}
