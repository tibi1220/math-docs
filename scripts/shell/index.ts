import { generateCompileScript, generateDependencyScript } from "./generate";

export default function generateBashScripts(
  config: MergedConfig,
  name: string,
  shebang = "#!/bin/bash"
) {
  return {
    dependency: generateDependencyScript(config.external_deps, name, shebang),
    compile: generateCompileScript(config.latex_roots, name, shebang),
  };
}
