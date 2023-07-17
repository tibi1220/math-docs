import resolver from "../resolver";
import type { ParsedConfig, ParsedDeps } from "../types";

export function mergeDeps(merged: ParsedConfig[]): ParsedDeps[] {
  const dep_keys: string[] = [
    ...new Set(
      merged
        .map((cfg) => (cfg.external_deps ? Object.keys(cfg.external_deps) : []))
        .flat()
    ),
  ];

  const deps = dep_keys.map((program) => {
    const deps = [
      ...new Set(
        merged.map((cfg) => cfg.external_deps?.[program] || []).flat()
      ),
    ];

    return {
      program,
      deps,
      resolver: resolver(program, deps),
    };
  });

  return deps;
}
