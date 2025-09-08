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
  GLOBALS_CSS_TEMPLATE,
} from "../utils/templates";
import prompts from "prompts";
import execa from "execa";

const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
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
  const baseColors = [
    "slate",
    "gray",
    "zinc",
    "neutral",
    "stone",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];

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
  const spinner = logger.info(`Initializing project...`);

  // Write components.json.
  logger.info("");
  const componentsJson = JSON.stringify(config, null, 2);
  await fs.writeFile(
    path.resolve(cwd, "components.json"),
    componentsJson,
    "utf8"
  );
  logger.success(`Created ${chalk.green("components.json")}`);

  // Write tailwind config.
  await fs.writeFile(
    path.resolve(cwd, config.tailwind.config),
    TAILWIND_CONFIG_TEMPLATE,
    "utf8"
  );
  logger.success(`Created ${chalk.green(config.tailwind.config)}`);

  // Write css file.
  const cssDir = path.resolve(cwd, path.dirname(config.tailwind.css));
  if (!existsSync(cssDir)) {
    await fs.mkdir(cssDir, { recursive: true });
  }

  await fs.writeFile(
    path.resolve(cwd, config.tailwind.css),
    GLOBALS_CSS_TEMPLATE,
    "utf8"
  );
  logger.success(`Created ${chalk.green(config.tailwind.css)}`);

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
  const utilsDir = path.resolve(
    cwd,
    config.aliases["utils"].replace(/^@\//, "src/")
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
    config.aliases["components"].replace(/^@\//, "src/")
  );
  const componentsUiDir = path.resolve(componentsDir, "ui");

  if (!existsSync(componentsUiDir)) {
    await fs.mkdir(componentsUiDir, { recursive: true });
  }
  logger.success(`Created ${chalk.green(config.aliases["components"])}`);

  // Install dependencies.
  logger.info("");
  logger.info("Installing dependencies...");
  const packageManager = await getPackageManager(cwd);

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...PROJECT_DEPENDENCIES],
    {
      cwd,
    }
  );
  logger.success(`Installed dependencies`);
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
