// Windows release notes. The Markdown files are copied from motion-space/screen-cam-win
// (changelogs/*.md) the same way the macOS notes in changelogs/*.md are copied from the macOS repo:
// one `# 1.0.11` heading per Microsoft Store release, newest first, followed by a flat bullet list.
// Right under a heading, an HTML comment may list up to 3 short highlights for the app's update
// reminder; it is invisible on the rendered page:
//
//   # 1.0.11
//
//   <!-- highlights
//   - Word-by-word captions, offline or cloud
//   -->
//
//   - Generate word-by-word captions for your recordings, ...

export const windowsChangelogLocales = ["en", "zh-Hans"] as const;

export type WindowsChangelogLocale = (typeof windowsChangelogLocales)[number];

/** The app shows at most this many highlights per release. */
export const maxWindowsChangelogHighlights = 3;

export type WindowsChangelogVersion = {
  version: string;
  notes: Record<WindowsChangelogLocale, string[]>;
  highlights: Record<WindowsChangelogLocale, string[]>;
};

export type WindowsChangelogFeed = {
  platform: "windows";
  url: string;
  versions: WindowsChangelogVersion[];
};

type ParsedVersion = { version: string; notes: string[]; highlights: string[] };

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

/**
 * Parses `# version` headings and `- bullet` lines; continuation lines join the previous bullet.
 * Bullets inside a `<!-- highlights ... -->` comment are the version's highlights; any other
 * HTML comment is skipped.
 */
export function parseChangelog(markdown: string): ParsedVersion[] {
  const versions: ParsedVersion[] = [];
  let comment: "highlights" | "other" | null = null;
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const current = versions.at(-1);

    if (comment !== null) {
      if (line.trim() === "-->") {
        comment = null;
        continue;
      }
      if (line.includes("-->")) {
        throw new Error(`Put the closing --> of a changelog comment on its own line: "${line.trim()}"`);
      }
      const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
      if (comment === "highlights" && current) {
        if (bullet) {
          current.highlights.push(plainText(bullet[1]));
        } else if (line.trim()) {
          throw new Error(`Highlights for ${current.version} must be "- " bullets: "${line.trim()}"`);
        }
      }
      continue;
    }

    const opening = /^\s*<!--\s*(.*)$/.exec(line);
    if (opening) {
      const rest = opening[1].trim();
      if (rest.endsWith("-->")) continue; // single-line comment
      if (/^highlights$/i.test(rest)) {
        if (!current) throw new Error("A highlights comment must follow a # version heading");
        if (current.highlights.length > 0) throw new Error(`${current.version} has more than one highlights comment`);
        comment = "highlights";
      } else {
        comment = "other";
      }
      continue;
    }

    const heading = /^#\s+(.+)$/.exec(line);
    if (heading) {
      versions.push({ version: plainText(heading[1]), notes: [], highlights: [] });
      continue;
    }
    if (!current) continue;
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      current.notes.push(plainText(bullet[1]));
    } else if (line.trim() && current.notes.length > 0) {
      const last = current.notes.length - 1;
      current.notes[last] = plainText(`${current.notes[last]} ${line}`);
    }
  }
  if (comment !== null) {
    throw new Error("Unclosed HTML comment in a Windows changelog");
  }
  return versions;
}

export function getWindowsChangelogFeed(siteUrl: string): WindowsChangelogFeed {
  const english = parseChangelog(sourceFor("en"));
  const chinese = new Map(parseChangelog(sourceFor("zh-Hans")).map((entry) => [entry.version, entry]));

  return {
    platform: "windows",
    url: `${siteUrl}/changelog/windows`,
    versions: english.map((entry) => {
      const translated = chinese.get(entry.version);
      if (!translated || translated.notes.length !== entry.notes.length) {
        throw new Error(
          `changelogs/windows/zh-Hans.md must have the same ${entry.notes.length} notes as en.md for ${entry.version}`,
        );
      }
      if (translated.highlights.length !== entry.highlights.length) {
        throw new Error(
          `changelogs/windows/zh-Hans.md must have the same ${entry.highlights.length} highlights as en.md for ${entry.version}`,
        );
      }
      if (entry.highlights.length > maxWindowsChangelogHighlights) {
        throw new Error(
          `${entry.version} has ${entry.highlights.length} highlights; the app shows at most ${maxWindowsChangelogHighlights}`,
        );
      }
      return {
        version: entry.version,
        notes: { en: entry.notes, "zh-Hans": translated.notes },
        highlights: { en: entry.highlights, "zh-Hans": translated.highlights },
      };
    }),
  };
}
