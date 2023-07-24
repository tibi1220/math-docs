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

async function inferOutDir(
  rcPath: string,
  mode = true,
  fallback = "build"
): Promise<{
  dir: string;
  status: "fallback" | "infer" | "warning";
  message: string;
}> {
  if (mode === false) {
    return {
      status: "fallback",
      dir: fallback,
      message: `Using default out_dir value: '${fallback}'`,
    };
  }

  const rc = await readFile(rcPath, "utf8");
  const regex = /\$out_dir.*=.*(\'|\")(\w+)(\'|\")/g;

  // The second capturing group is needed
  const dir = regex.exec(rc)?.[2];

  if (!dir) {
    return {
      status: "warning",
      dir: fallback,
      message: `Cannot infer out_dir. Using default value: '${fallback}'`,
    };
  }

  return {
    status: "infer",
    dir,
    message: `Inferred out_dir: '${dir}'`,
  };
}

export async function parseYaml(
  path: string,
  cwd: string
): Promise<ParsedConfig | ConfigErrors> {
  const configFile = await readFile(path, "utf8");

  const json: LatexConfig | null = parse(configFile);

  const absolute_source_path = dirname(path);
  const source_path = relative(cwd, absolute_source_path);

  const errors: ConfigErrors = {
    source_path,
    errors: [],
  };

  // Config file is totally empty
  if (json === null) {
    errors.errors.push({
      path: path,
      message: "Invalid yaml file",
    });

    return errors;
  }

  // The config file does not contain files to compile
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
    // The .latexmkrc file does not exist
    errors.errors.push({
      path: rcPath,
      message: "Missing .latexmkrc file!",
    });
  }

  // In case of an error, we won't be able to compile any files in that dir
  // Second condition is redundant, but is needed to make ts happy
  if (errors.errors.length || !json.root_files) {
    return errors;
  }

  const configMessages: ConfigMessage[] = [];

  // Global out dir option
  let out_dir: string;

  if (typeof json.out_dir !== "string") {
    const { dir, status, message } = await inferOutDir(
      rcPath,
      json.out_dir,
      "build"
    );
    out_dir = dir;

    configMessages.push({
      type: status === "warning" ? "warning" : "info",
      message,
    });
  } else {
    out_dir = json.out_dir;

    configMessages.push({
      type: "info",
      message: `Using out_dir value: '${out_dir}'`,
    });
  }

  const absolute_output_path = join(absolute_source_path, out_dir);
  const output_path = join(source_path, out_dir);

  // Global lang option
  // let lang: string;

  // Global out_file option
  // let out_file: string;

  return {
    source_path,
    output_path,
    root_files: json.root_files.map(file => {
      const input = file.input || "main";
      const output = file.output || file.input || "main";
      const inferredLang = inferLanguage(input);
      const lang = file.lang || inferredLang.lang;

      const fileMessages: FileMessage[] = [];

      if (!file.input) {
        fileMessages.push({
          type: "warning",
          message:
            "Missing input field in config file. " +
            `Using default value: '${input}'`,
        });
      }
      if (!file.output) {
        fileMessages.push({
          type: "warning",
          message:
            "Missing output field in config file. " +
            (file.input
              ? `Using input value: '${output}'`
              : `Using default value: '${output}'`),
        });
      }
      if (!file.lang) {
        fileMessages.push({
          type: inferredLang.success ? "info" : "warning",
          message:
            "Missing lang field in config file. " + //
            (inferredLang.success
              ? `Using inferred value: '${inferredLang.lang}'`
              : `Using default value: '${inferredLang.lang}'`),
        });
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

        ...(fileMessages.length && { messages: fileMessages }),
      };
    }),
    external_deps: json.external_deps,
    ...(configMessages.length && { messages: configMessages }),
  };
}
