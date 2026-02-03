import path from "path";
import fs from "fs-extra";
import { cosmiconfig } from "cosmiconfig";

const explorer = cosmiconfig("components", {
  searchPlaces: ["components.json"],
});

export type Config = {
  style: string;
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
  };
  aliases: {
    components: string;
    utils: string;
  };
};

export const DEFAULT_STYLE = "default";
export const DEFAULT_COMPONENTS = "@/components";
export const DEFAULT_UTILS = "@/lib/utils";
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.js";
export const DEFAULT_TAILWIND_CSS = "app/globals.css";

export async function getConfig(cwd: string): Promise<Config | null> {
  try {
    const configResult = await explorer.search(cwd);

    if (!configResult) {
      return null;
    }

    return configResult.config as Config;
  } catch (error) {
    return null;
  }
}

export async function resolveConfigPaths(cwd: string, config: Config) {
  // Resolve tailwind config.
  const tailwindConfigPath = path.resolve(cwd, config.tailwind.config);

  // Resolve tailwind css file.
  const tailwindCssPath = path.resolve(cwd, config.tailwind.css);

  return {
    ...config,
    resolvedPaths: {
      tailwindConfig: tailwindConfigPath,
      tailwindCss: tailwindCssPath,
      utils: await resolveImport(config.aliases["utils"], config, cwd),
      components: await resolveImport(
        config.aliases["components"],
        config,
        cwd
      ),
    },
  };
}

export async function resolveImport(
  importPath: string,
  _config: Config,
  cwd?: string
) {
  if (importPath.startsWith("@/")) {
    // Detect if project has src directory
    const projectCwd = cwd || process.cwd();
    const hasSrcDir = await fs.pathExists(path.resolve(projectCwd, "src"));

    // Use appropriate base path based on project structure
    const basePath = hasSrcDir ? "src/" : "";
    return importPath.replace("@/", basePath);
  }

  return importPath;
}

export async function getProjectInfo(cwd: string = process.cwd()) {
  const projectCwd = cwd;

  const [packageJson, tsConfig] = await Promise.allSettled([
    fs.readJson(path.resolve(projectCwd, "package.json")),
    fs.readJson(path.resolve(projectCwd, "tsconfig.json")),
  ]);

  const isTypeScript = tsConfig.status === "fulfilled";
  const isNextJs =
    packageJson.status === "fulfilled" && packageJson.value?.dependencies?.next;
  const isSrcDir = await fs.pathExists(path.resolve(projectCwd, "src"));
  const isAppDir = await fs.pathExists(
    path.resolve(projectCwd, `${isSrcDir ? "src/" : ""}app`)
  );

  return {
    isTypeScript,
    isNextJs,
    isSrcDir,
    isAppDir,
  };
}
