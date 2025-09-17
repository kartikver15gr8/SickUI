import { existsSync } from "fs";
import path from "path";

export function validateProjectStructure(cwd: string) {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    throw new Error(
      "package.json not found. Please make sure you're in a valid project directory."
    );
  }

  return true;
}

export function validateComponentName(name: string) {
  if (!name || typeof name !== "string") {
    throw new Error("Component name is required.");
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      "Component name must be lowercase and can only contain letters, numbers, and hyphens."
    );
  }

  return true;
}

export function validatePath(targetPath: string) {
  try {
    path.resolve(targetPath);
    return true;
  } catch (error) {
    throw new Error(`Invalid path: ${targetPath}`);
  }
}
