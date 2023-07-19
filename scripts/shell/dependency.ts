export default function depsToBash(deps: ParsedDeps[]) {
  return deps
    .filter(dep => dep.resolver)
    .map(dep => dep.resolver)
    .join("\n");
}
