import { echo, log, INFO, ERROR, WARN, Logger } from "./util";

const ECHO_MAP = {
  info: INFO,
  error: ERROR,
  warn: WARN,
} as const;

import chalk from "chalk";
const g = chalk.green;

const INCREMENT_ERROR = "errorCount=$((errorcount + 1))";
const INCREMENT_WARN = "warnCount=$((errorcount + 1))";

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

function parseConfigMessages(
  { messages, source_path }: ParsedSchema,
  logger: Logger
): string {
  if (!messages) return "";

  let script = "";

  if (messages.some(({ type }) => type === "warn")) {
    script +=
      echo(
        `Some warnings occured while parsing ${g(`${source_path}.yml`)}`,
        WARN
      ) + "\n";
  }

  messages.forEach(({ message, type }) => {
    script += echo(message, ECHO_MAP[type]) + "\n";
    script += logger.write(message, type) + "\n";

    if (type === "warn") script += INCREMENT_WARN + "\n";
  });

  return script + "\n";
}

function parseFileMessages(
  { messages, relative_input }: RootFile,
  logger: Logger
) {
  if (!messages) return { script: "", error: false };

  const errors = messages.filter(({ type }) => type === "error");

  if (errors.length) {
    return {
      script: errors
        .map(
          err => `${echo(err.message, ERROR)}
${logger.write(`${err.message}`, "error")}
${INCREMENT_ERROR}
`
        )
        .join(""),
      error: true,
    };
  }

  let script = "";

  if (messages.some(({ type }) => type === "warn")) {
    script +=
      echo(
        `Some warnings occured while parsing ${g(`${relative_input}.tex`)}`,
        WARN
      ) + "\n";
  }

  messages.forEach(({ message, type }, i) => {
    script +=
      echo(message, ECHO_MAP[type], false, messages.length - 1 === i) + "\n";
    script += logger.write(`${message} [${relative_input}]`, type) + "\n";

    if (type === "warn") script += INCREMENT_WARN + "\n";
  });

  return { script: script, error: false };
}

function parseFile(file: RootFile, logger: Logger): string {
  let { script, error } = parseFileMessages(file, logger);

  if (error) return script;

  script =
    echo(`Now compiling ${file.input}.tex`, INFO, true, true) + "\n" + script;

  // prettier-ignore
  script += `
if ${file.resolver}; then
  ${echo(`${file.relative_input}.tex successfully compiled`, INFO)}
  ${echo(`${file.relative_output}.pdf has been generated`, INFO)}
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
  let script = `errorCount=0
warnCount=0\n\n`;

  const logger = log(name);

  script += logger.begin() + "\n\n";

  config.forEach(cfg => {
    if (cfg.errors) {
      script += parseErrors(cfg, logger);

      return;
    }

    script += echo(
      `Compiling documents in ${g(cfg.source_path)}`,
      INFO,
      true,
      true
    );

    script += `\ncd ${cfg.source_path}\n`;

    script += parseConfigMessages(cfg, logger);

    script += cfg.root_files.map(file => parseFile(file, logger)).join("\n");

    script += `cd $current_dir\n\n`;
  });

  script += `
if (( $warnCount > 0 )); then
  ${echo(`Some warnings ($warnCount) have occured during compilation`, WARN)}
fi\n
`;

  script += `
if (( $errorCount > 0 )); then
  ${echo(`Some errors ($errorCount) have occured during compilation`, ERROR)}
  exit 1
else
  ${echo(`Successfully compiled ${g(name)} files.`, INFO, true, false)}
  exit 0
fi\n
`;

  script += logger.end();

  return script;
}
