import chalk from "chalk";

export const INFO = `[${chalk.green("INFO")}]`;
export const ERROR = `[${chalk.red("ERROR")}]`;
export const WARN = `[${chalk.yellow("WARN")}]`;

export function echo(message: string, prefix?: string) {
  return `echo -e "${prefix ? prefix + " - " : ""}${message}\\n"`;
}

export function date(format = "%H:%M:%S") {
  return `$(date +"${format}")`;
}

export interface Logger {
  begin: () => string;
  end: () => string;
  write: (message: string, option: "warn" | "error" | "info") => string;
}

export function log(name: string): Logger {
  return {
    begin: () => `exec 3<> ${name}.log`,
    end: () => `exec 3>&-`,
    write: (message: string, option: "warn" | "error" | "info") =>
      `echo "[${date()}] - [${option.toUpperCase()}] - ${message}" >&3`,
  };
}
