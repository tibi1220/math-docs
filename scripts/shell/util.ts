import chalk from "chalk";

export const INFO = `[${chalk.green("INFO")}]`;
export const ERROR = `[${chalk.red("ERROR")}]`;

export function echo(message: string, prefix?: string) {
  return `echo -e "${prefix ? prefix + " - " : ""}${message}\\n"`;
}

export function date(format = "%H:%M:%S") {
  return `$(date +"${format}")`;
}

export function log(name: string) {
  return {
    begin: () => `exec 3<> ${name}.log`,
    end: () => `exec 3>&-`,
    write: (message: string, option: "warn" | "error" | "info") =>
      `echo "[${date()}] - [${
        option.toUpperCase() + (option !== "error" ? "] " : "]")
      } - ${message}" >&3`,
  };
}
