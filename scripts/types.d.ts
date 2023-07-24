type Language = "en" | "hu";

interface LatexConfig {
  root_files?: {
    input?: string;
    output?: string;
    lang?: string;
  }[];
  lang?: string | boolean;
  out_dir?: boolean | string;
  out_file?: boolean;
  external_deps?: {
    [key: string]: string[];
  };
}

interface ConfigErrors {
  source_path: string;
  output_path?: string;
  errors: {
    path: string;
    message: string;
  }[];
  external_deps?: never;
}

interface ConfigMessage {
  type: "warning" | "info";
  message: string;
}

type FileMessage = {
  type: "warning" | "info" | "error";
  message: string;
};

interface RootFile {
  input: string;
  relative_input: string;
  absolute_input: string;
  output: string;
  relative_output: string;
  absolute_output: string;
  resolver: string;
  lang: Language | false;
  messages?: FileMessage[];
}

interface ParsedSchema {
  source_path: string;
  output_path: string;
  root_files: RootFile[];
  external_deps?: {
    [key: string]: string[];
  };
  messages?: ConfigMessage[];
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
