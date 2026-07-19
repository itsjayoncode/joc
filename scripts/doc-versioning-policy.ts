export function archiveDirectoryName(version: string): string {
  return `v${version}`;
}

export function archiveBasePath(packageId: string, version: string): string {
  return `/packages/${packageId}/${archiveDirectoryName(version)}`;
}

/** Which release bump types create a frozen docs snapshot. */
export interface DocArchiveFlags {
  readonly major: boolean;
  readonly minor: boolean;
  readonly patch: boolean;
}

export const DEFAULT_DOC_ARCHIVE_FLAGS: DocArchiveFlags = {
  major: true,
  minor: true,
  patch: false,
};

/**
 * Resolve archive flags from a manifest `archive` object or legacy `archivePolicy` string.
 *
 * - Object form (preferred): `{ major, minor, patch }`
 * - `"minor-major"` / legacy `"minor"`: major + minor (not patch)
 * - `"major"`: major only
 */
export function resolveDocArchiveFlags(
  archive?: Partial<DocArchiveFlags> | "minor-major" | "minor" | "major" | null,
): DocArchiveFlags {
  if (archive && typeof archive === "object") {
    return {
      major: archive.major ?? DEFAULT_DOC_ARCHIVE_FLAGS.major,
      minor: archive.minor ?? DEFAULT_DOC_ARCHIVE_FLAGS.minor,
      patch: archive.patch ?? DEFAULT_DOC_ARCHIVE_FLAGS.patch,
    };
  }

  if (archive === "major") {
    return { major: true, minor: false, patch: false };
  }

  // "minor-major", legacy "minor", or unset → project default
  return { ...DEFAULT_DOC_ARCHIVE_FLAGS };
}

export function shouldArchiveForBumpType(
  _currentVersion: string,
  bumpType: string | null,
  archive?: Partial<DocArchiveFlags> | "minor-major" | "minor" | "major" | null,
): boolean {
  if (!bumpType || bumpType === "none") {
    return false;
  }

  const flags = resolveDocArchiveFlags(archive);

  if (bumpType === "major") {
    return flags.major;
  }

  if (bumpType === "minor") {
    return flags.minor;
  }

  if (bumpType === "patch") {
    return flags.patch;
  }

  return false;
}
