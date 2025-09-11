import path from "path";
import fs from "fs-extra";

export async function getPackageInfo() {
  const packageJsonPath = path.join(__dirname, "..", "..", "package.json");
  
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    return packageJson;
  } catch (error) {
    return {};
  }
}
