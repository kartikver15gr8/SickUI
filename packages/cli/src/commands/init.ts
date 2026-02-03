import { Command } from "commander";
import { existsSync, promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getProjectInfo } from "../utils/get-project-info";
import { getOrDetectTailwindMajorVersion } from "../utils/tailwind";
import {
  UTILS_TEMPLATE,
  TAILWIND_CONFIG_TEMPLATE,
  TAILWIND_CONFIG_V4_TEMPLATE,
  TAILWIND_CONFIG_V4_TEMPLATE_TS,
  GLOBALS_CSS_TEMPLATE,
  GLOBALS_CSS_V4_TEMPLATE,
} from "../utils/templates";
import { smartMergeCSS } from "../utils/css-merger";
import prompts from "prompts";
import execa from "execa";

const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
];

const TAILWIND_V3_DEPENDENCIES = [
  "tailwindcss@^3.4.0",
  "postcss@latest",
  "autoprefixer@latest",
];

const TAILWIND_V4_DEPENDENCIES = [
  "tailwindcss@latest",
  "postcss@latest",
  "@tailwindcss/postcss@latest",
];

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults,", "use default configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("--skip-install", "skip dependency installation.", false)
  .action(async (opts) => {
    const cwd = path.resolve(opts.cwd);

    // Ensure target directory exists.
    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const projectInfo = await getProjectInfo(cwd);
    const projectConfig = await promptForConfig(
      cwd,
      projectInfo,
      opts.defaults
    );

    await runInit(cwd, projectConfig, projectInfo, {
      skipInstall: opts.skipInstall,
    });

    logger.info("");
    logger.info(`${chalk.green("Success!")} Project initialization completed.`);
    logger.info("");
  });

export async function promptForConfig(
  _cwd: string,
  defaultConfig: any,
  useDefaults: boolean
) {
  const highlight = (text: string) => chalk.cyan(text);

  const styles = ["default"];
  const baseColors = ["slate", "gray", "zinc", "neutral", "stone"];

  const options = useDefaults
    ? {
        style: "default",
        baseColor: "slate",
        cssVariables: true,
      }
    : await prompts([
        {
          type: "select",
          name: "style",
          message: `Which ${highlight("style")} would you like to use?`,
          choices: styles.map((style) => ({
            title: style,
            value: style,
          })),
          initial: 0,
        },
        {
          type: "select",
          name: "baseColor",
          message: `Which color would you like to use as ${highlight(
            "base color"
          )}?`,
          choices: baseColors.map((color) => ({
            title: color,
            value: color,
          })),
          initial: 0,
        },
        {
          type: "toggle",
          name: "cssVariables",
          message: `Would you like to use ${highlight(
            "CSS variables"
          )} for colors?`,
          initial: true,
          active: "yes",
          inactive: "no",
        },
      ]);

  const config = {
    style: options.style ?? "default",
    tailwind: {
      config: defaultConfig.isNextJs
        ? "tailwind.config.ts"
        : "tailwind.config.js",
      css: defaultConfig.isNextJs
        ? defaultConfig.isSrcDir
          ? defaultConfig.isAppDir
            ? "src/app/globals.css"
            : "src/styles/globals.css"
          : defaultConfig.isAppDir
            ? "app/globals.css"
            : "styles/globals.css"
        : "src/index.css",
      baseColor: options.baseColor ?? "slate",
      cssVariables: options.cssVariables ?? true,
    },
    rsc: defaultConfig.isNextJs,
    tsx: defaultConfig.isTypeScript,
    aliases: {
      utils: defaultConfig.isSrcDir ? "@/lib/utils" : "@/lib/utils",
      components: defaultConfig.isSrcDir ? "@/components" : "@/components",
    },
  };

  return config;
}

export async function runInit(
  cwd: string,
  config: any,
  projectInfo: any,
  options: { skipInstall?: boolean } = {}
) {
  const skipInstall = Boolean(options.skipInstall);
  logger.info(`Initializing project...`);

  // Decide which Tailwind major version this project should use.
  const desiredTailwindMajor = await getOrDetectTailwindMajorVersion(cwd);
  await ensureTailwindSetup(cwd, desiredTailwindMajor);
  const isTailwindV4 = desiredTailwindMajor >= 4;

  logger.info("");
  logger.info(
    `Using Tailwind CSS v${desiredTailwindMajor} for this project (${chalk.cyan(
      isTailwindV4 ? "v4 (CSS-first)" : "v3"
    )}).`
  );

  if (!skipInstall) {
    // Remove conflicting Tailwind packages first, based on the desired major version.
    await removeConflictingTailwindPackages(cwd, desiredTailwindMajor);

    // Install Tailwind and PostCSS dependencies for the chosen major version.
    logger.info("");
    logger.info("Installing Tailwind CSS dependencies...");
    const packageManager = await getPackageManager(cwd);

    const dependenciesToInstall =
      desiredTailwindMajor >= 4
        ? TAILWIND_V4_DEPENDENCIES
        : TAILWIND_V3_DEPENDENCIES;

    await execa(
      packageManager,
      [packageManager === "npm" ? "install" : "add", ...dependenciesToInstall],
      {
        cwd,
      }
    );
    logger.success(
      `Installed Tailwind CSS ${isTailwindV4 ? "v4+" : "v3"} dependencies`
    );

    // Install shared project dependencies (SickUI related utilities).
    await execa(
      packageManager,
      [packageManager === "npm" ? "install" : "add", ...PROJECT_DEPENDENCIES],
      {
        cwd,
      }
    );
    logger.success(`Installed project dependencies`);
  } else {
    logger.info("");
    logger.info(
      "Skipping dependency installation (--skip-install). Install dependencies manually."
    );
  }

  // Write components.json.
  logger.info("");
  const componentsJson = JSON.stringify(config, null, 2);
  await fs.writeFile(
    path.resolve(cwd, "components.json"),
    componentsJson,
    "utf8"
  );
  logger.success(`Created ${chalk.green("components.json")}`);

  // Write tailwind config with appropriate template
  const tailwindTemplate = isTailwindV4
    ? config.tailwind.config.endsWith(".ts")
      ? TAILWIND_CONFIG_V4_TEMPLATE_TS
      : TAILWIND_CONFIG_V4_TEMPLATE
    : TAILWIND_CONFIG_TEMPLATE;
  await fs.writeFile(
    path.resolve(cwd, config.tailwind.config),
    tailwindTemplate,
    "utf8"
  );
  logger.success(
    `Created ${chalk.green(config.tailwind.config)} ${
      isTailwindV4 ? "(v4 compatible)" : "(v3 compatible)"
    }`
  );

  // Write PostCSS config using the appropriate format for the chosen Tailwind version.
  await ensurePostCSSConfig(cwd, desiredTailwindMajor);

  // Write css file.
  const cssDir = path.resolve(cwd, path.dirname(config.tailwind.css));
  if (!existsSync(cssDir)) {
    await fs.mkdir(cssDir, { recursive: true });
  }

  await ensureCSSFile(cwd, config.tailwind.css, isTailwindV4);

  // Show important setup instructions
  logger.info("");
  logger.info("📋 Important: Make sure to import the CSS file in your app:");
  logger.info("");
  if (projectInfo.isNextJs) {
    if (projectInfo.isAppDir) {
      logger.info(
        `   Add this to your ${chalk.cyan("app/layout.tsx")} or ${chalk.cyan(
          "src/app/layout.tsx"
        )}:`
      );
      logger.info(
        `   ${chalk.green(`import "./${path.basename(config.tailwind.css)}"`)}`
      );
    } else {
      logger.info(`   Add this to your ${chalk.cyan("pages/_app.tsx")}:`);
      logger.info(`   ${chalk.green(`import "../${config.tailwind.css}"`)}`);
    }
  } else {
    logger.info(
      `   Add this to your main file (${chalk.cyan(
        "src/main.tsx"
      )} or ${chalk.cyan("src/index.tsx")}):`
    );
    logger.info(
      `   ${chalk.green(`import "./${path.basename(config.tailwind.css)}"`)}`
    );
  }
  logger.info("");

  // Write cn lib.
  // Detect if project has src directory
  const hasSrcDir = existsSync(path.resolve(cwd, "src"));
  const basePath = hasSrcDir ? "src/" : "";

  const utilsDir = path.resolve(
    cwd,
    config.aliases["utils"].replace(/^@\//, basePath)
  );
  const utilsPath = path.resolve(utilsDir, "..", "utils.ts");

  if (!existsSync(path.dirname(utilsPath))) {
    await fs.mkdir(path.dirname(utilsPath), { recursive: true });
  }

  await fs.writeFile(utilsPath, UTILS_TEMPLATE, "utf8");
  logger.success(`Created ${chalk.green(config.aliases["utils"])}`);

  // Create components directory.
  const componentsDir = path.resolve(
    cwd,
    config.aliases["components"].replace(/^@\//, basePath)
  );
  const componentsUiDir = path.resolve(componentsDir, "ui");

  if (!existsSync(componentsUiDir)) {
    await fs.mkdir(componentsUiDir, { recursive: true });
  }
  logger.success(`Created ${chalk.green(config.aliases["components"])}`);
}

export async function getPackageManager(
  targetDir: string
): Promise<"npm" | "pnpm" | "yarn"> {
  const lockFiles = [
    { file: "pnpm-lock.yaml", pm: "pnpm" as const },
    { file: "yarn.lock", pm: "yarn" as const },
    { file: "package-lock.json", pm: "npm" as const },
  ];

  for (const { file, pm } of lockFiles) {
    if (existsSync(path.resolve(targetDir, file))) {
      return pm;
    }
  }

  return "npm";
}

async function removeConflictingTailwindPackages(
  cwd: string,
  desiredMajor: number
) {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies: Record<string, string | undefined> = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const conflictingPackages: string[] = [];

    const tailwindDep = dependencies.tailwindcss;
    if (tailwindDep) {
      const version = tailwindDep.replace(/[^\d.]/g, "");
      const majorVersion = parseInt(version.split(".")[0]);

      if (!Number.isNaN(majorVersion) && majorVersion !== desiredMajor) {
        conflictingPackages.push("tailwindcss");
        logger.info(
          `🔄 Removing Tailwind CSS v${majorVersion} to install v${desiredMajor}...`
        );
      }
    }

    // @tailwindcss/postcss is only needed for Tailwind v4+
    const hasTailwindPostCSS = Boolean(dependencies["@tailwindcss/postcss"]);
    if (hasTailwindPostCSS && desiredMajor < 4) {
      conflictingPackages.push("@tailwindcss/postcss");
      logger.info(
        "🔄 Removing @tailwindcss/postcss (Tailwind v4 plugin) for a Tailwind v3 setup..."
      );
    }

    if (conflictingPackages.length > 0) {
      const packageManager = await getPackageManager(cwd);

      await execa(
        packageManager,
        [
          packageManager === "npm" ? "uninstall" : "remove",
          ...conflictingPackages,
        ],
        { cwd }
      );

      logger.success("✅ Removed conflicting Tailwind packages");
    }
  } catch (error) {
    logger.warn("⚠️  Could not check for conflicting packages");
  }
}

async function ensureTailwindSetup(cwd: string, desiredTailwindMajor: number) {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    logger.warn("⚠️  package.json not found, skipping dependency check");
    return;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies: Record<string, string | undefined> = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for Tailwind CSS version
    if (dependencies.tailwindcss) {
      const tailwindVersion = dependencies.tailwindcss.replace(/[^\d.]/g, "");
      if (tailwindVersion) {
        logger.info(`📦 Found Tailwind CSS ${tailwindVersion}`);
      }
    }

    // Check for PostCSS
    if (!dependencies.postcss) {
      logger.warn("⚠️  PostCSS not found - will install latest version");
    }

    // Check for autoprefixer
    if (!dependencies.autoprefixer) {
      if (desiredTailwindMajor >= 4) {
        logger.info("ℹ️  Autoprefixer not found (optional for Tailwind v4)");
      } else {
        logger.warn("⚠️  Autoprefixer not found - will install latest version");
      }
    }
  } catch (error) {
    logger.warn("⚠️  Could not read package.json");
  }
}

async function ensurePostCSSConfig(cwd: string, desiredTailwindMajor: number) {
  const postCSSConfigPath = path.resolve(cwd, "postcss.config.js");
  const postCSSConfigMjsPath = path.resolve(cwd, "postcss.config.mjs");
  const postCSSConfigCjsPath = path.resolve(cwd, "postcss.config.cjs");
  const isTailwindV4 = desiredTailwindMajor >= 4;

  const renderPostCSSConfig = (useV4: boolean, isESM: boolean) => {
    if (useV4) {
      return isESM
        ? `const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;`
        : `module.exports = {
  plugins: ["@tailwindcss/postcss"],
};`;
    }

    return isESM
      ? `const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;`
      : `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
  };

  const updatePostCSSConfigContent = (content: string) => {
    let updated = content;

    if (isTailwindV4) {
      updated = updated.replace(
        /tailwindcss\s*:\s*\{\s*\}/g,
        '"@tailwindcss/postcss": {}'
      );
      updated = updated.replace(
        /require\(["']tailwindcss["']\)/g,
        'require("@tailwindcss/postcss")'
      );
      updated = updated.replace(
        /from\s+["']tailwindcss["']/g,
        'from "@tailwindcss/postcss"'
      );
      updated = updated.replace(
        /["']tailwindcss["']/g,
        '"@tailwindcss/postcss"'
      );
    } else {
      updated = updated.replace(/@tailwindcss\/postcss/g, "tailwindcss");
    }

    return updated;
  };

  // Check if PostCSS config already exists
  let existingConfigPath = "";
  if (existsSync(postCSSConfigPath)) existingConfigPath = postCSSConfigPath;
  else if (existsSync(postCSSConfigMjsPath))
    existingConfigPath = postCSSConfigMjsPath;
  else if (existsSync(postCSSConfigCjsPath))
    existingConfigPath = postCSSConfigCjsPath;

  if (existingConfigPath) {
    const configContent = await fs.readFile(existingConfigPath, "utf8");
    const hasV4Plugin = configContent.includes("@tailwindcss/postcss");
    const hasLegacyPlugin =
      configContent.includes("tailwindcss") && !hasV4Plugin;

    if ((isTailwindV4 && hasV4Plugin) || (!isTailwindV4 && hasLegacyPlugin)) {
      logger.info("📄 PostCSS config already exists");
      return;
    }

    const updatedContent = updatePostCSSConfigContent(configContent);
    const updatedHasV4 = updatedContent.includes("@tailwindcss/postcss");
    const updatedHasLegacy =
      updatedContent.includes("tailwindcss") && !updatedHasV4;

    if (
      (isTailwindV4 && updatedHasV4) ||
      (!isTailwindV4 && updatedHasLegacy)
    ) {
      if (updatedContent !== configContent) {
        logger.info(
          `🔄 Updating ${path.basename(existingConfigPath)} for Tailwind ${
            isTailwindV4 ? "v4" : "v3"
          }...`
        );
        await fs.writeFile(existingConfigPath, updatedContent, "utf8");
        logger.success(
          `✅ Updated ${path.basename(
            existingConfigPath
          )} to Tailwind ${isTailwindV4 ? "v4" : "v3"} format`
        );
      }
      return;
    }

    logger.warn(
      "⚠️  Existing PostCSS config could not be safely updated. Please update it manually."
    );
    return;
  }

  const postCSSConfig = renderPostCSSConfig(isTailwindV4, false);
  await fs.writeFile(postCSSConfigPath, postCSSConfig, "utf8");
  logger.success(
    `Created ${chalk.green("postcss.config.js")} ${
      isTailwindV4 ? "(v4 format)" : "(v3 format)"
    }`
  );
}

async function ensureCSSFile(
  cwd: string,
  cssPath: string,
  isTailwindV4: boolean = false
) {
  const fullCssPath = path.resolve(cwd, cssPath);

  // Check if CSS file already exists
  if (existsSync(fullCssPath)) {
    logger.info(`📄 CSS file already exists: ${cssPath}`);

    try {
      // Use smart CSS merging to preserve existing styles
      logger.info("🔄 Intelligently merging SickUI variables...");
      await smartMergeCSS(fullCssPath, isTailwindV4);
      logger.success(`✅ Enhanced ${cssPath} with SickUI variables`);
    } catch (error) {
      logger.error("❌ Failed to merge CSS variables");
      logger.error(`Error: ${error}`);

      // Fallback to manual instructions
      logger.warn("⚠️  Please manually add SickUI variables to your CSS file");
      logger.info("   You can either:");
      logger.info(
        `   1. Backup your CSS and run ${chalk.cyan(
          "npx @sickui/cli init"
        )} again`
      );
      logger.info(
        `   2. Manually add the variables from the SickUI documentation`
      );
    }
    return;
  }

  // Create new CSS file with appropriate template
  const cssTemplate = isTailwindV4
    ? GLOBALS_CSS_V4_TEMPLATE
    : GLOBALS_CSS_TEMPLATE;
  await fs.writeFile(fullCssPath, cssTemplate, "utf8");
  logger.success(
    `Created ${chalk.green(cssPath)} ${
      isTailwindV4 ? "(v4 compatible)" : "(v3 compatible)"
    }`
  );
}
