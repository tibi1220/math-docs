import chalk from "chalk";

export const INFO = `[${chalk.green("INFO")}]`;
export const ERROR = `[${chalk.red("ERROR")}]`;

export function echo(message: string, prefix?: string) {
  return `echo -e "${prefix ? prefix + " - " : ""}${message}\\n"`;
}
