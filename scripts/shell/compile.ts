import { echo, log, INFO, ERROR, WARN, Logger } from "./util";

import chalk from "chalk";
const g = chalk.green;

const INCREMENT_ERROR = "errorCount=$((errorcount + 1))";

function parseErrors({ errors, source_path }: ConfigErrors, logger: Logger) {
  let script =
    echo(`Some errors occured while parsing ${g(source_path)}.yml`, ERROR) +
    "\n";

  errors.forEach(err => {
    script += echo(err.message, ERROR) + "\n";
    script += logger.write(`${err.message} [${err.path}]`, "error") + "\n";
    script += INCREMENT_ERROR + "\n";
  });

  return script;
}

function parseConfigWarnings(
  { warnings, source_path }: ParsedSchema,
  logger: Logger
): string {
  if (!warnings) return "";

  let script =
    echo(`Some warnings occured while parsing ${g(source_path)}.yml`, WARN) +
    "\n";

  warnings.forEach(warn => {
    script += echo(warn.message, WARN) + "\n";
    script += logger.write(`${warn.message} [${warn.path}]`, "warn") + "\n";
  });

  return script + "\n\n";
}

function parseFileWarnings(
  { warnings, relative_input }: RootFile,
  logger: Logger
) {
  if (!warnings) return "";

  let script =
    echo(`Some warnings occured while parsing ${g(relative_input)}`, WARN) +
    "\n";

  warnings.forEach(warn => {
    script += echo(warn, WARN) + "\n";
    script += logger.write(`${warn} [${relative_input}]`, "warn") + "\n";
  });

  return script + "\n\n";
}

function parseFile(file: RootFile, logger: Logger): string {
  let script = parseFileWarnings(file, logger);

  // prettier-ignore
  script += `${echo(`Now compiling ${file.input}.tex`, INFO)}

if ${file.resolver}; then
  ${echo(`${file.relative_input} successfully compiled`, INFO)}
  ${echo(`${file.relative_output} has been generated`, INFO)}
  ${logger.write(`Compilation successful [${file.relative_input} -> ${file.relative_output}]`, "info")}
else
  ${echo(`An error occured while compiling ${file.relative_input}`, ERROR)}
  ${logger.write(`Error during compilation [${file.relative_input} -> ${file.relative_output}]`, "error")}
  ${INCREMENT_ERROR}
fi\n
`

  return script;
}

export default function configToBash(config: ParsedConfig[], name: string) {
  let script = `errorCount=0\n\n`;

  const logger = log(name);

  script += logger.begin() + "\n\n";

  config.forEach(cfg => {
    if (cfg.errors) {
      script += parseErrors(cfg, logger);

      return;
    }

    script += echo(`Compiling documents in ${g(cfg.source_path)}`, INFO);

    script += `\ncd ${cfg.source_path}\n`;

    script += parseConfigWarnings(cfg, logger);

    script += cfg.root_files.map(file => parseFile(file, logger));

    script += `cd $current_dir\n`;
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
