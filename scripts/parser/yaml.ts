import { stringify, parse } from "yaml";
import { writeFile, readFile, access } from "fs/promises";
import { join, dirname, relative } from "path";

function isLanguage(lang?: string) {
  return lang === "en" || lang === "hu";
}

export async function writeYaml(path: string, content: string) {
  const yaml = stringify(content);

  return writeFile(path, yaml);
}

function inferLanguage(
  input: string,
  fallback: Language = "hu"
): { success: boolean; lang: Language } {
  const lang = input.split(".").at(-2);

  const success = isLanguage(lang);

  return { success, lang: success ? (lang as Language) : fallback };
}

type ParserFn = {
  (input: string): { success: boolean; lang: Language };
};

type LanguageParser =
  | {
      status: "force" | "fallback";
      fallback: Language;
      parser?: never;
      message: string;
    }
  | {
      status: "infer" | "invalid";
      fallback: Language;
      parser: ParserFn;
      message: string;
    };

function getLanguageParser(
  mode: boolean | string = true,
  fallback: Language = "hu"
): LanguageParser {
  if (mode === "en" || mode === "hu")
    return {
      status: "force",
      fallback: mode,
      message: `Using forced language mode: '${mode}'`,
    };

  if (mode === false)
    return {
      status: "fallback",
      fallback,
      message: `Using fallback language mode: '${fallback}'`,
    };

  return {
    status: mode === true ? "infer" : "invalid",
    fallback,
    parser: (input: string) => inferLanguage(input, fallback),
    message: `${
      mode === true ? "" : `Invalid language: '${mode}'. `
    }Using inferred language mode with fallback: '${fallback}'`,
  };
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
  const langParser = getLanguageParser(json.lang, "hu");

  configMessages.push({
    type: langParser.status === "invalid" ? "warning" : "info",
    message: langParser.message,
  });

  // Global out_file option
  // let out_file: string;

  return {
    source_path,
    output_path,
    root_files: json.root_files.map(file => {
      const input = file.input || "main";
      const output = file.output || file.input || "main";

      const fileMessages: FileMessage[] = [];

      let lang: Language;
      const isLang = isLanguage(file.lang);

      // If status is force, use the forced lang
      if (langParser.status === "force") {
        lang = langParser.fallback;

        fileMessages.push({
          type: "info",
          message: `Using forced lang: '${lang}'`,
        });
      }
      // If provided lang is valid, use it
      else if (isLang) {
        lang = file.lang as Language;

        fileMessages.push({
          type: "info",
          message: `Using provided lang: '${lang}'`,
        });
      }
      // Use fallback if provided lang is invalid
      else if (langParser.status === "fallback") {
        lang = langParser.fallback;

        fileMessages.push({
          type: file.lang ? "warning" : "info",
          message: file.lang
            ? `Provided lang invalid, using fallback: '${langParser.fallback}'`
            : `Using fallback lang: '${langParser.fallback}'`,
        });
      }
      // Infer lang if provided lang is invalid
      else {
        const { success, lang: _lang } = (langParser.parser as ParserFn)(input);

        lang = _lang;
        const isWarning = !success || file.lang;

        fileMessages.push({
          type: isWarning ? "warning" : "info",
          message: isWarning
            ? `Using fallback lang: '${lang}'`
            : `Using inferred lang: '${_lang}'`,
        });
      }

      if (!file.input) {
        fileMessages.push({
          type: "error",
          message: "Missing input field in config file!",
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
