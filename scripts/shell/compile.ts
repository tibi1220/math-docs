import { echo, INFO } from "./util";

export default function configToBash(config: ParsedConfig[]) {
  return config
    .map(cfg => {
      let script = echo(`Compiling documents in ${cfg.source_path}`, INFO);

      script += `\ncd ${cfg.source_path}\n\n`;

      script += cfg.root_files.map(file => file.resolver).join("\n") + "\n\n";

      script += `\ncd $current_dir\n\n\n`;

      return script;
    })
    .join("");
}
