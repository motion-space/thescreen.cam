// Windows release notes. The Markdown files are copied from motion-space/screen-cam-win
// (changelogs/*.md) the same way the macOS notes in changelogs/*.md are copied from the macOS repo:
// one `# 1.0.11` heading per Microsoft Store release, newest first, followed by a flat bullet list.

export const windowsChangelogLocales = ["en", "zh-Hans"] as const;

export type WindowsChangelogLocale = (typeof windowsChangelogLocales)[number];

export type WindowsChangelogVersion = {
  version: string;
  notes: Record<WindowsChangelogLocale, string[]>;
};

export type WindowsChangelogFeed = {
  platform: "windows";
  url: string;
  versions: WindowsChangelogVersion[];
};

const sources = import.meta.glob("../../changelogs/windows/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function sourceFor(locale: WindowsChangelogLocale): string {
  const source = sources[`../../changelogs/windows/${locale}.md`];
  if (source === undefined) {
    throw new Error(`Missing changelogs/windows/${locale}.md`);
  }
  return source;
}

/** Strips inline Markdown so the feed carries plain text. */
function plainText(value: string): string {
  return value
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^\w*])[*_]([^*_]+)[*_](?=$|[^\w*])/g, "$1$2")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses `# version` headings and `- bullet` lines; continuation lines join the previous bullet. */
export function parseChangelog(markdown: string): { version: string; notes: string[] }[] {
  const versions: { version: string; notes: string[] }[] = [];
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const heading = /^#\s+(.+)$/.exec(line);
    if (heading) {
      versions.push({ version: plainText(heading[1]), notes: [] });
      continue;
    }
    const current = versions.at(-1);
    if (!current) continue;
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      current.notes.push(plainText(bullet[1]));
    } else if (line.trim() && current.notes.length > 0) {
      const last = current.notes.length - 1;
      current.notes[last] = plainText(`${current.notes[last]} ${line}`);
    }
  }
  return versions;
}

export function getWindowsChangelogFeed(siteUrl: string): WindowsChangelogFeed {
  const english = parseChangelog(sourceFor("en"));
  const chinese = new Map(parseChangelog(sourceFor("zh-Hans")).map((entry) => [entry.version, entry.notes]));

  return {
    platform: "windows",
    url: `${siteUrl}/changelog/windows`,
    versions: english.map((entry) => {
      const translated = chinese.get(entry.version);
      if (!translated || translated.length !== entry.notes.length) {
        throw new Error(
          `changelogs/windows/zh-Hans.md must have the same ${entry.notes.length} notes as en.md for ${entry.version}`,
        );
      }
      return {
        version: entry.version,
        notes: { en: entry.notes, "zh-Hans": translated },
      };
    }),
  };
}
