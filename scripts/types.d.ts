type Language = "en" | "hu";

interface LatexConfig {
  root_files?: {
    input?: string;
    output?: string;
    lang?: Language;
  }[];
  out_dir?: string;
  external_deps?: {
    [key: string]: string[];
  };
}

interface ConfigErrors {
  source_path: string;
  output_path: string;
  errors: {
    path: string;
    message: string;
  }[];
  external_deps?: never;
}

interface ConfigWarning {
  path: string;
  message: string;
}

type FileWarning = string;

interface RootFile {
  input: string;
  relative_input: string;
  absolute_input: string;
  output: string;
  relative_output: string;
  absolute_output: string;
  resolver: string;
  lang: Language;
  warnings?: FileWarning[];
}

interface ParsedSchema {
  source_path: string;
  output_path: string;
  root_files: RootFile[];
  external_deps?: {
    [key: string]: string[];
  };
  warnings?: ConfigWarning[];
  errors?: never;
}

type ParsedConfig = ParsedSchema | ConfigErrors;

interface ParsedDeps {
  program: string;
  deps: string[];
  resolver: string | null;
}

interface MergedConfig {
  external_deps: ParsedDeps[];
  latex_roots: ParsedConfig[];
}
