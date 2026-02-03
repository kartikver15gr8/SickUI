import path from "path";
import { existsSync, promises as fs } from "fs";

export function parseTailwindMajorVersion(
  version: string | undefined
): number | null {
  if (!version) {
    return null;
  }

  const cleaned = version.replace(/[^\d.]/g, "");
  if (!cleaned) {
    return null;
  }

  const major = parseInt(cleaned.split(".")[0], 10);
  return Number.isNaN(major) ? null : major;
}

export async function getTailwindMajorVersion(
  cwd: string
): Promise<number | null> {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies: Record<string, string | undefined> = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return parseTailwindMajorVersion(dependencies.tailwindcss);
  } catch {
    return null;
  }
}

export async function getOrDetectTailwindMajorVersion(
  cwd: string
): Promise<number> {
  const major = await getTailwindMajorVersion(cwd);
  return major && major > 0 ? major : 4;
}
