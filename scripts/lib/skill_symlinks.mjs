import path from "node:path";

/**
 * Returns the canonical, POSIX-style relative path from a symlink's containing
 * directory to a skill package directory.
 *
 * For a package at `<repo>/skills-hub/<bucket>/<...subpath.../<name>` and a
 * link dir of `<repo>/.agents/skills/`, the result is
 * `../../skills-hub/<bucket>/<...subpath.../<name>`.
 *
 * @param {string} packageAbsolutePath absolute path to the skill package directory
 * @param {string} linkDirAbsolutePath absolute path to the directory that
 *   contains the symlink (e.g. `<repo>/.agents/skills`)
 * @returns {string} POSIX-style relative path, no trailing slash
 */
export function canonicalSymlinkTarget(packageAbsolutePath, linkDirAbsolutePath) {
  const relative = path.relative(linkDirAbsolutePath, packageAbsolutePath);
  if (relative === "") {
    throw new Error(
      `canonicalSymlinkTarget: package path equals link directory (${packageAbsolutePath})`,
    );
  }
  // Convert backslashes to forward slashes for byte-for-byte identical output
  // on POSIX and Windows. Path.relative is OS-aware; the join step here is the
  // forward-slash concatenation the invariant requires.
  return relative.split(path.sep).join("/");
}
