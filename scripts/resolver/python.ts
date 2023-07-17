export default function python(deps?: string[]) {
  if (!deps?.length) return null;

  return `python3 -m pip install ${deps.join(" ")} --break-system-packages`;
}
