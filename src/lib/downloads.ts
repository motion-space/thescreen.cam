const manifests = {
  release: {
    manifestUrl: "https://download.thescreen.cam/release/latest.json",
    fallbackUrl: "https://download.thescreen.cam/release/latest.zip"
  },
  nightly: {
    manifestUrl: "https://download.thescreen.cam/nightly/latest.json",
    fallbackUrl: "https://download.thescreen.cam/nightly/latest.zip"
  }
} as const;

export type DownloadChannel = keyof typeof manifests;

const readString = (value: unknown) => (typeof value === "string" ? value : null);
const readNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

const getRecord = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

export const isDownloadChannel = (value: string): value is DownloadChannel =>
  Object.prototype.hasOwnProperty.call(manifests, value);

export const fetchDownloadChannel = async (channel: DownloadChannel) => {
  const config = manifests[channel];

  try {
    const response = await fetch(config.manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Download manifest failed: ${response.status}`);

    const manifest = getRecord(await response.json());
    const artifact = getRecord(manifest?.artifact);

    return {
      build: readString(manifest?.build),
      channel,
      createdAt: readString(manifest?.createdAt),
      name: readString(artifact?.name),
      size: readNumber(artifact?.size),
      url: readString(artifact?.url) ?? config.fallbackUrl,
      version: readString(manifest?.version)
    };
  } catch {
    return {
      build: null,
      channel,
      createdAt: null,
      name: null,
      size: null,
      url: config.fallbackUrl,
      version: null
    };
  }
};
