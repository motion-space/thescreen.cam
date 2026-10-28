type Version = [number, number, number, number];

export function parseReleaseVersion(value: string | null): Version | null {
  if (!value || !/^\d+(?:\.\d+){0,3}$/.test(value)) return null;
  const numbers = value.split(".").map(Number);
  if (numbers.some((part) => !Number.isSafeInteger(part) || part > 65535)) return null;
  while (numbers.length < 4) numbers.push(0);
  return numbers as Version;
}

function compare(left: Version, right: Version): number {
  for (let index = 0; index < 4; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function display(version: Version): string {
  return version.slice(0, version[3] === 0 ? 3 : 4).join(".");
}

export type ChangelogRangeResult =
  | { status: "all" }
  | { status: "invalid" }
  | { status: "missing" | "ready"; from: string; to: string; versions: string[] };

/** Release-note diff: exclude the installed version, include the upper version, require its notes. */
export function selectChangelogRange(search: string, versions: string[]): ChangelogRangeResult {
  const query = new URLSearchParams(search);
  if (!query.has("from") && !query.has("to")) return { status: "all" };
  if (query.getAll("from").length !== 1 || query.getAll("to").length !== 1) return { status: "invalid" };
  const from = parseReleaseVersion(query.get("from"));
  const to = parseReleaseVersion(query.get("to"));
  if (!from || !to || compare(from, to) >= 0) return { status: "invalid" };
  const parsed = versions.map((version) => ({ version, parsed: parseReleaseVersion(version) }));
  if (!parsed.some((entry) => entry.parsed && compare(entry.parsed, to) === 0)) {
    return { status: "missing", from: display(from), to: display(to), versions: [] };
  }
  return {
    status: "ready", from: display(from), to: display(to),
    versions: parsed
      .filter((entry) => entry.parsed && compare(entry.parsed, from) > 0 && compare(entry.parsed, to) <= 0)
      .sort((left, right) => compare(right.parsed!, left.parsed!))
      .map((entry) => entry.version),
  };
}
