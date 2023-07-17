import { generateCompileScript, generateDependencyScript } from "./generate";

import type { MergedConfig } from "../types";

export default function generateBashScripts(
  config: MergedConfig,
  shebang = "#!/bin/bash"
) {
  return {
    dependency: generateDependencyScript(config.external_deps, shebang),
    compile: generateCompileScript(config.latex_roots, shebang),
  };
}
