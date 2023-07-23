import { stringify, parse } from "yaml";
import { writeFile, readFile, access } from "fs/promises";
import { join, dirname, relative } from "path";

export async function writeYaml(path: string, content: string) {
  const yaml = stringify(content);

  return writeFile(path, yaml);
}

function inferLanguage(
  input: string,
  fallback: Language = "hu"
): { success: boolean; lang: Language } {
  const lang = input.split(".").at(-2);

  const success = lang === "en" || lang === "hu";

  return { success, lang: success ? (lang as Language) : fallback };
}

export async function parseYaml(
  path: string,
  cwd: string
): Promise<ParsedConfig | ConfigErrors> {
  const configFile = await readFile(path, "utf8");

  const json: LatexConfig | null = parse(configFile);

  const absolute_source_path = dirname(path);
  const absolute_output_path = join(absolute_source_path, json?.out_dir || ".");

  const source_path = relative(cwd, absolute_source_path);
  const output_path = join(source_path, json?.out_dir || ".");

  const errors: ConfigErrors = {
    source_path,
    output_path,
    errors: [],
  };

  if (json === null) {
    errors.errors.push({
      path: path,
      message: "Yaml file is empty.",
    });

    return errors;
  }

  if (!json.root_files) {
    errors.errors.push({
      path,
      message: "Missing root_files in config file.",
    });
  }

  const rcPath = join(absolute_source_path, ".latexmkrc");

  try {
    await access(rcPath);
  } catch {
    errors.errors.push({
      path: rcPath,
      message: "Missing .latexmkrc file!",
    });
  }

  // Second condition is redundant, but is needed to make ts happy
  if (errors.errors.length || !json.root_files) {
    return errors;
  }

  return {
    source_path,
    output_path,
    root_files: json.root_files.map(file => {
      const input = file.input || "main";
      const output = file.output || file.input || "main";
      const inferredLang = inferLanguage(input);
      const lang = file.lang || inferredLang.lang;

      const warnings: FileWarning[] = [];

      if (!file.input) {
        warnings.push(
          "Missing input field in config file. " +
            `Using default value: '${input}'`
        );
      }
      if (!file.output) {
        warnings.push(
          "Missing output field in config file. " +
            (file.input
              ? `Using input value: '${output}'`
              : `Using default value: '${output}'`)
        );
      }
      if (!file.lang) {
        warnings.push(
          "Missing lang field in config file. " + //
            (inferredLang.success
              ? `Using inferred value: '${inferredLang.lang}'`
              : `Using default value: '${inferredLang.lang}'`)
        );
      }

      return {
        input,
        relative_input: join(source_path, input),
        absolute_input: join(absolute_source_path, input),

        output,
        relative_output: join(output_path, output),
        absolute_output: join(absolute_output_path, output),

        lang,

        resolver: `latexmk ${file.input}.tex --jobname='${file.output}'`,

        ...(warnings.length && { warnings }),
      };
    }),
    external_deps: json.external_deps,
  };
}
