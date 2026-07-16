export function archiveDirectoryName(version: string): string {
  return `v${version}`;
}

export function archiveBasePath(packageId: string, version: string): string {
  return `/packages/${packageId}/${archiveDirectoryName(version)}`;
}

export function shouldArchiveForBumpType(
  currentVersion: string,
  bumpType: string | null,
  archivePolicy = "minor",
): boolean {
  if (!bumpType || bumpType === "none") {
    return false;
  }

  if (bumpType === "major") {
    return true;
  }

  const major = Number.parseInt(currentVersion.split(".")[0] ?? "0", 10);

  if (archivePolicy === "major") {
    return bumpType === "major";
  }

  if (major === 0) {
    return bumpType === "minor" || bumpType === "major";
  }

  return bumpType === "major";
}
