export function mergeUrlPath(base: string | undefined, path: string): string {
  const cleanBase = (base ?? '').replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
}
