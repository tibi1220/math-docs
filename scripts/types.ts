export interface LatexConfig {
  root_files: {
    input: string;
    output: string;
  }[];
  out_dir?: string;
  external_deps?: {
    [key: string]: string[];
  };
}

export interface ParsedConfig {
  source_path: string;
  output_path: string;
  root_files: {
    input: string;
    input_long: string;
    output: string;
    output_long: string;
    resolver: string;
  }[];
  external_deps?: {
    [key: string]: string[];
  };
}

export interface ParsedDeps {
  program: string;
  deps: string[];
  resolver: string | null;
}

export interface MergedConfig {
  external_deps: ParsedDeps[];
  latex_roots: ParsedConfig[];
}
