import chalk from "chalk";

export const INFO = `[${chalk.green("INFO")}]`;

export function echo(message: string, prefix?: string) {
  return `echo -e "${prefix ? prefix + " - " : ""}${message}\\n"\n`;
}
