type Language = "en" | "hu";

interface LatexConfig {
  root_files: {
    input?: string;
    output?: string;
    lang?: Language;
  }[];
  out_dir?: string;
  external_deps?: {
    [key: string]: string[];
  };
}

interface ParsedConfig {
  source_path: string;
  output_path: string;
  root_files: {
    input: string;
    input_long: string;
    output: string;
    output_long: string;
    resolver: string;
    lang: Language;
  }[];
  external_deps?: {
    [key: string]: string[];
  };
}

interface ParsedDeps {
  program: string;
  deps: string[];
  resolver: string | null;
}

interface MergedConfig {
  external_deps: ParsedDeps[];
  latex_roots: ParsedConfig[];
}
