import { Command } from "commander";
import { existsSync, promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getProjectInfo } from "../utils/get-project-info";
import {
  COMPONENTS_JSON_TEMPLATE,
  UTILS_TEMPLATE,
  TAILWIND_CONFIG_TEMPLATE,
  TAILWIND_CONFIG_V4_TEMPLATE,
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
  .action(async (opts) => {
    const cwd = path.resolve(opts.cwd);

    // Ensure target directory exists.
    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const projectInfo = await getProjectInfo();
    const projectConfig = await promptForConfig(
      cwd,
      projectInfo,
      opts.defaults
    );

    await runInit(cwd, projectConfig, projectInfo);

    logger.info("");
    logger.info(`${chalk.green("Success!")} Project initialization completed.`);
    logger.info("");
  });

export async function promptForConfig(
  cwd: string,
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

export async function runInit(cwd: string, config: any, projectInfo: any) {
  logger.info(`Initializing project...`);

  // Check and fix Tailwind/PostCSS setup first
  await ensureTailwindSetup(cwd);

  // Remove conflicting Tailwind v4 packages first
  await removeConflictingTailwindPackages(cwd);

  // Install dependencies first so we can detect the correct Tailwind version
  logger.info("");
  logger.info("Installing dependencies...");
  const packageManager = await getPackageManager(cwd);

  // Install Tailwind v3 by default to match SickUI components
  const dependenciesToInstall = TAILWIND_V3_DEPENDENCIES;

  // Install Tailwind and PostCSS dependencies first
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependenciesToInstall],
    {
      cwd,
    }
  );
  logger.success(`Installed Tailwind CSS dependencies`);

  // Install project dependencies
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...PROJECT_DEPENDENCIES],
    {
      cwd,
    }
  );
  logger.success(`Installed project dependencies`);

  // Write components.json.
  logger.info("");
  const componentsJson = JSON.stringify(config, null, 2);
  await fs.writeFile(
    path.resolve(cwd, "components.json"),
    componentsJson,
    "utf8"
  );
  logger.success(`Created ${chalk.green("components.json")}`);

  // NOW detect Tailwind version after installation
  const isTailwindV4 = await isTailwindVersion4(cwd);

  // Write tailwind config with appropriate template
  const tailwindTemplate = isTailwindV4
    ? TAILWIND_CONFIG_V4_TEMPLATE
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

  // Write PostCSS config (force v3 format)
  await ensurePostCSSConfig(cwd, true);

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

async function removeConflictingTailwindPackages(cwd: string) {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const conflictingPackages = [];

    // Check for Tailwind v4 packages that conflict with v3
    if (dependencies["@tailwindcss/postcss"]) {
      conflictingPackages.push("@tailwindcss/postcss");
      logger.info(
        "🔄 Removing conflicting @tailwindcss/postcss (v4) package..."
      );
    }

    // If we have both v3 and v4 tailwindcss, remove the newer one
    if (dependencies.tailwindcss) {
      const version = dependencies.tailwindcss.replace(/[^\d.]/g, "");
      const majorVersion = parseInt(version.split(".")[0]);

      if (majorVersion >= 4) {
        conflictingPackages.push("tailwindcss");
        logger.info("🔄 Removing Tailwind CSS v4 to install v3...");
      }
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

async function ensureTailwindSetup(cwd: string) {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    logger.warn("⚠️  package.json not found, skipping dependency check");
    return;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for Tailwind CSS version
    if (dependencies.tailwindcss) {
      const tailwindVersion = dependencies.tailwindcss.replace(/[^\d.]/g, "");
      logger.info(`📦 Found Tailwind CSS ${tailwindVersion}`);
    }

    // Check for PostCSS
    if (!dependencies.postcss) {
      logger.warn("⚠️  PostCSS not found - will install latest version");
    }

    // Check for autoprefixer
    if (!dependencies.autoprefixer) {
      logger.warn("⚠️  Autoprefixer not found - will install latest version");
    }
  } catch (error) {
    logger.warn("⚠️  Could not read package.json");
  }
}

async function ensurePostCSSConfig(cwd: string, forceV3: boolean = false) {
  const postCSSConfigPath = path.resolve(cwd, "postcss.config.js");
  const postCSSConfigMjsPath = path.resolve(cwd, "postcss.config.mjs");
  const postCSSConfigCjsPath = path.resolve(cwd, "postcss.config.cjs");

  // Check if PostCSS config already exists
  let existingConfigPath = "";
  if (existsSync(postCSSConfigPath)) existingConfigPath = postCSSConfigPath;
  else if (existsSync(postCSSConfigMjsPath))
    existingConfigPath = postCSSConfigMjsPath;
  else if (existsSync(postCSSConfigCjsPath))
    existingConfigPath = postCSSConfigCjsPath;

  if (existingConfigPath) {
    const configContent = await fs.readFile(existingConfigPath, "utf8");

    // If forceV3 is true, update existing config to v3 format
    if (forceV3) {
      logger.info("🔄 Updating PostCSS config to Tailwind v3 format...");

      // Use appropriate syntax based on file extension
      const isESM = existingConfigPath.endsWith(".mjs");
      const v3PostCSSConfig = isESM
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
}`;

      await fs.writeFile(existingConfigPath, v3PostCSSConfig, "utf8");
      logger.success(
        `✅ Updated ${path.basename(existingConfigPath)} to v3 format`
      );
      return;
    }

    logger.info("📄 PostCSS config already exists");

    // Check for problematic old format
    if (
      configContent.includes("tailwindcss: {}") &&
      !configContent.includes("@tailwindcss/postcss")
    ) {
      logger.warn("⚠️  Found old PostCSS config format that may cause errors");
      logger.info(
        "   Your config uses 'tailwindcss: {}' which can cause PostCSS plugin errors"
      );
      logger.info(
        "   Consider updating to use '@tailwindcss/postcss' for Tailwind v4+"
      );
    }
    return;
  }

  // Detect Tailwind version to create appropriate config
  const packageJsonPath = path.resolve(cwd, "package.json");
  let useLegacyFormat = true;

  // Force v3 format if requested
  if (forceV3) {
    useLegacyFormat = true;
  } else if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if (dependencies.tailwindcss) {
        const version = dependencies.tailwindcss.replace(/[^\d.]/g, "");
        const majorVersion = parseInt(version.split(".")[0]);

        // Use new format for Tailwind v4+
        if (majorVersion >= 4) {
          useLegacyFormat = false;
        }
      }
    } catch (error) {
      // Fall back to legacy format if we can't read package.json
    }
  }

  // Create appropriate PostCSS config based on Tailwind version
  let postCSSConfig;

  if (useLegacyFormat) {
    // Legacy format for Tailwind v3 and below
    postCSSConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  } else {
    // New format for Tailwind v4+
    postCSSConfig = `module.exports = {
  plugins: ["@tailwindcss/postcss"],
}`;
  }

  await fs.writeFile(postCSSConfigPath, postCSSConfig, "utf8");
  logger.success(
    `Created ${chalk.green("postcss.config.js")} ${
      useLegacyFormat ? "(legacy format)" : "(modern format)"
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

async function isTailwindVersion4(cwd: string): Promise<boolean> {
  const packageJsonPath = path.resolve(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (dependencies.tailwindcss) {
      const version = dependencies.tailwindcss.replace(/[^\d.]/g, "");
      const majorVersion = parseInt(version.split(".")[0]);
      return majorVersion >= 4;
    }
  } catch (error) {
    // Fall back to false if we can't read package.json
  }

  return false;
}
