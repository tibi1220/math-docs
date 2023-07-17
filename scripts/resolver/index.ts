import python from "./python";

type ResolverFn = (deps?: string[]) => string | null;

interface Resolvers {
  [key: string]: ResolverFn;
}

const resolvers: Resolvers = {
  python,
};

export default function resolver(program: string, deps?: string[]) {
  const programs = Object.keys(resolvers) as (keyof Resolvers)[];

  if (!programs.includes(program)) {
    return null;
  }

  return resolvers[program]?.(deps) || null;
}
