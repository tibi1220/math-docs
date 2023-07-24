import { stringify, parse } from "yaml";
import { writeFile, readFile } from "fs/promises";
import { join, dirname, relative } from "path";

export async function writeYaml(path: string, content: string) {
  const yaml = stringify(content);

  return writeFile(path, yaml);
}

export async function parseYaml(
  path: string,
  cwd: string
): Promise<ParsedConfig> {
  const configFile = await readFile(path, "utf8");

  const json: LatexConfig = parse(configFile);

  path = relative(cwd, path);

  const source_path = dirname(path);
  const output_path = join(source_path, json.out_dir || ".");

  return {
    source_path,
    output_path,
    root_files: json.root_files.map(file => ({
      input: file.input || "main",
      output: file.output || file.input || "main",
      lang: file.lang || "hu",
      input_long: join(source_path, file.input + ".tex"),
      output_long: join(output_path, file.output + ".pdf"),
      resolver: `latexmk ${file.input}.tex --jobname='${file.output}'`,
    })),
    external_deps: json.external_deps,
  };
}
