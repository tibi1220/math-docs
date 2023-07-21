import { echo, INFO, ERROR } from "./util";

export default function configToBash(config: ParsedConfig[], name: string) {
  let script = `errorCount=0\n\n`;

  config.forEach(cfg => {
    script += echo(`Compiling documents in ${cfg.source_path}`, INFO);

    script += `\ncd ${cfg.source_path}\n`;

    // prettier-ignore
    script += cfg.root_files.map(file => `
${echo(`Now compiling ${file.input}.tex`, INFO)}

if ${file.resolver}; then
  ${echo(`${file.input_long} successfully compiled`, INFO)}
  ${echo(`${file.output_long} has been generated`, INFO)}
else
  ${echo(`An error occured while compiling ${file.input_long}`, ERROR)}
  errorCount=$((errorcount + 1))
fi
`).join("\n");

    script += `\ncd $current_dir\n`;
  });

  script += `
if (( $errorCount > 0 )); then
  ${echo(`Some errors ($errorCount) have occured during compilation`, ERROR)}
else
  ${echo(`Successfully compiled ${name} files.`, INFO)}
fi
`;

  return script;
}
