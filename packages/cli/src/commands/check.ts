import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getProjectInfo } from "../utils/get-project-info";
import { parseTailwindMajorVersion } from "../utils/tailwind";

export const check = new Command()
  .name("check")
  .description("Check your project setup and diagnose common issues")
  .action(async () => {
    const cwd = process.cwd();

    logger.info("🔍 Checking your SickUI setup...");
    logger.info("");

    // Check PostCSS/Tailwind setup first
    const tailwindMajor = await checkPostCSSSetup(cwd);
    logger.info("");

    // Check if components.json exists
    const componentsJsonPath = path.resolve(cwd, "components.json");
    if (!fs.existsSync(componentsJsonPath)) {
      logger.error("❌ components.json not found");
      logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} first`);
      return;
    }
    logger.success("✅ components.json found");

    // Read components.json
    const componentsJson = await fs.readJson(componentsJsonPath);
    const cssPath = path.resolve(
      cwd,
      componentsJson.tailwind?.css || "src/app/globals.css"
    );

    // Check if CSS file exists
    if (!fs.existsSync(cssPath)) {
      logger.error(`❌ CSS file not found: ${componentsJson.tailwind?.css}`);
      logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} to create it`);
      return;
    }
    logger.success(`✅ CSS file found: ${componentsJson.tailwind?.css}`);

    // Check if CSS file has required variables
    const cssContent = await fs.readFile(cssPath, "utf8");
    const isTailwindV4 =
      tailwindMajor !== null
        ? tailwindMajor >= 4
        : cssContent.includes("@theme") ||
          cssContent.includes("--color-background");
    const requiredVariables = isTailwindV4
      ? [
          "--color-background",
          "--color-foreground",
          "--color-primary",
          "--color-primary-foreground",
          "--color-border",
          "--color-input",
          "--color-ring",
        ]
      : [
          "--background",
          "--foreground",
          "--primary",
          "--primary-foreground",
          "--border",
          "--input",
          "--ring",
        ];

    const missingVariables = requiredVariables.filter(
      (variable) => !cssContent.includes(variable)
    );

    if (missingVariables.length > 0) {
      logger.error("❌ Missing CSS variables in your CSS file:");
      missingVariables.forEach((variable) => {
        logger.error(`   ${variable}`);
      });
      logger.info("");
      logger.info(
        "💡 Solution: Add the missing CSS variables to your CSS file:"
      );
      logger.info(
        `   Check the SickUI documentation for the complete CSS template`
      );
      return;
    }
    logger.success("✅ All required CSS variables found");

    // Check if Tailwind config exists
    const projectInfo = await getProjectInfo(cwd);
    const configuredTailwindPath = componentsJson.tailwind?.config;
    const tailwindConfigPath = configuredTailwindPath
      ? path.resolve(cwd, configuredTailwindPath)
      : projectInfo.isTypeScript
        ? path.resolve(cwd, "tailwind.config.ts")
        : path.resolve(cwd, "tailwind.config.js");

    if (!isTailwindV4) {
      if (!fs.existsSync(tailwindConfigPath)) {
        logger.error("❌ Tailwind config not found");
        logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} to create it`);
        return;
      }
      logger.success(
        `✅ Tailwind config found: ${path.relative(cwd, tailwindConfigPath)}`
      );

      const tailwindConfig = await fs.readFile(tailwindConfigPath, "utf8");
      if (
        !tailwindConfig.includes("./src/**/*.{ts,tsx}") &&
        !tailwindConfig.includes("./app/**/*.{ts,tsx}")
      ) {
        logger.warn("⚠️  Tailwind config might be missing content paths");
        logger.info("   Make sure your tailwind.config includes:");
        logger.info("   './src/**/*.{ts,tsx}' or './app/**/*.{ts,tsx}'");
      } else {
        logger.success("✅ Tailwind config has content paths");
      }
    } else if (fs.existsSync(tailwindConfigPath)) {
      logger.success(
        `✅ Tailwind config found (optional for v4): ${path.relative(
          cwd,
          tailwindConfigPath
        )}`
      );
    } else {
      logger.info("ℹ️  Tailwind v4 detected: config file is optional");
    }

    // Check if utils file exists
    const utilsPath = path.resolve(cwd, "src/lib/utils.ts");
    if (!fs.existsSync(utilsPath)) {
      logger.error("❌ Utils file not found: src/lib/utils.ts");
      logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} to create it`);
      return;
    }
    logger.success("✅ Utils file found");

    // Check CSS import in layout files
    logger.info("");
    logger.info("📋 Make sure your CSS file is imported:");

    if (projectInfo.isNextJs) {
      if (projectInfo.isAppDir) {
        const layoutPaths = [
          path.resolve(cwd, "app/layout.tsx"),
          path.resolve(cwd, "src/app/layout.tsx"),
        ];

        let layoutFound = false;
        for (const layoutPath of layoutPaths) {
          if (fs.existsSync(layoutPath)) {
            layoutFound = true;
            const layoutContent = await fs.readFile(layoutPath, "utf8");
            const cssFileName = path.basename(
              componentsJson.tailwind?.css || "globals.css"
            );

            if (layoutContent.includes(`import "./${cssFileName}"`)) {
              logger.success(
                `✅ CSS imported in ${path.relative(cwd, layoutPath)}`
              );
            } else {
              logger.warn(
                `⚠️  CSS not imported in ${path.relative(cwd, layoutPath)}`
              );
              logger.info(
                `   Add: ${chalk.green(`import "./${cssFileName}"`)}`
              );
            }
            break;
          }
        }

        if (!layoutFound) {
          logger.warn("⚠️  No layout.tsx found");
          logger.info(
            "   Make sure to import your CSS file in your layout component"
          );
        }
      }
    }

    logger.info("");
    logger.success("🎉 Setup check completed!");
    logger.info("");
    logger.info("If you're still having styling issues:");
    logger.info("1. Make sure your CSS file is imported in your app");
    logger.info("2. Restart your development server");
    logger.info("3. Check browser dev tools for CSS loading errors");
    logger.info("4. Run this command again to re-check your setup");
  });

async function checkPostCSSSetup(cwd: string): Promise<number | null> {
  logger.info("🔧 Checking PostCSS/Tailwind setup...");

  // Check package.json for dependencies
  const packageJsonPath = path.resolve(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    logger.error("❌ package.json not found");
    return null;
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Check Tailwind CSS
  if (!dependencies.tailwindcss) {
    logger.error("❌ Tailwind CSS not installed");
    logger.info(`   Run: ${chalk.cyan("npm install tailwindcss@latest")}`);
    return null;
  } else {
    const versionLabel = dependencies.tailwindcss;
    logger.success(`✅ Tailwind CSS ${versionLabel} installed`);
  }
  const detectedMajor = parseTailwindMajorVersion(dependencies.tailwindcss);
  const inferredMajor =
    detectedMajor ?? (dependencies["@tailwindcss/postcss"] ? 4 : null);
  const isTailwindV4 = inferredMajor !== null && inferredMajor >= 4;

  // Check PostCSS (either standalone or @tailwindcss/postcss)
  const hasPostCSS =
    dependencies.postcss || dependencies["@tailwindcss/postcss"];
  if (!hasPostCSS) {
    logger.error("❌ PostCSS not installed");
    logger.info(`   Run: ${chalk.cyan("npm install postcss@latest")}`);
    logger.info("   Or for Tailwind v4+:");
    logger.info(
      `   Run: ${chalk.cyan("npm install @tailwindcss/postcss@latest")}`
    );
    logger.info(
      "   This fixes the 'tailwindcss directly as PostCSS plugin' error"
    );
    return inferredMajor;
  } else {
    if (dependencies["@tailwindcss/postcss"]) {
      logger.success("✅ @tailwindcss/postcss installed (Tailwind v4+)");
    } else {
      logger.success("✅ PostCSS installed");
    }
  }

  // Check Autoprefixer
  if (!dependencies.autoprefixer) {
    if (!isTailwindV4) {
      logger.warn("⚠️  Autoprefixer not installed (recommended)");
      logger.info(`   Run: ${chalk.cyan("npm install autoprefixer@latest")}`);
    } else {
      logger.info("ℹ️  Autoprefixer not installed (optional for Tailwind v4)");
    }
  } else {
    logger.success("✅ Autoprefixer installed");
  }

  // Check PostCSS config
  const postCSSPaths = [
    path.resolve(cwd, "postcss.config.js"),
    path.resolve(cwd, "postcss.config.mjs"),
    path.resolve(cwd, "postcss.config.cjs"),
    path.resolve(cwd, ".postcssrc.js"),
    path.resolve(cwd, ".postcssrc.json"),
  ];

  let postCSSConfigFound = false;
  for (const configPath of postCSSPaths) {
    if (fs.existsSync(configPath)) {
      postCSSConfigFound = true;
      logger.success(`✅ PostCSS config found: ${path.basename(configPath)}`);

      // Check if config includes Tailwind and detect problematic formats
      const configContent = await fs.readFile(configPath, "utf8");
      const hasV4Plugin = configContent.includes("@tailwindcss/postcss");
      const hasLegacyPlugin =
        configContent.includes("tailwindcss") && !hasV4Plugin;
      const hasTailwindCSS = hasV4Plugin || hasLegacyPlugin;

      if (hasTailwindCSS) {
        if (hasV4Plugin) {
          logger.success(
            "✅ PostCSS config includes Tailwind CSS (v4+ format)"
          );
        } else {
          logger.success("✅ PostCSS config includes Tailwind CSS");
        }

        if (isTailwindV4 && hasLegacyPlugin) {
          logger.warn(
            "⚠️  POTENTIAL ISSUE: Tailwind v4 with legacy PostCSS config"
          );
          logger.info(
            "   Update your PostCSS config to use @tailwindcss/postcss"
          );
          logger.info(
            chalk.red(
              "   'It looks like you're trying to use tailwindcss directly as a PostCSS plugin'"
            )
          );
          logger.info("");
          logger.info("💡 Solutions:");
          logger.info(
            `   1. Install: ${chalk.cyan(
              "npm install @tailwindcss/postcss@latest"
            )}`
          );
          logger.info("   2. Update your PostCSS config to use:");
          logger.info(chalk.green('      plugins: ["@tailwindcss/postcss"]'));
          logger.info(
            `   3. Or run: ${chalk.cyan("npx @sickui/cli init")} to auto-fix`
          );
        } else if (!isTailwindV4 && hasV4Plugin) {
          logger.warn(
            "⚠️  POTENTIAL ISSUE: Tailwind v3 with v4 PostCSS plugin"
          );
          logger.info(
            "   Update your PostCSS config to use the tailwindcss plugin"
          );
          logger.info(
            chalk.green("   plugins: { tailwindcss: {}, autoprefixer: {} }")
          );
        }
      } else {
        logger.warn("⚠️  PostCSS config doesn't include Tailwind CSS");
        logger.info("   Make sure your PostCSS config includes:");
        logger.info("   plugins: { tailwindcss: {}, autoprefixer: {} }");
        logger.info("   Or for Tailwind v4+:");
        logger.info('   plugins: ["@tailwindcss/postcss"]');
      }
      break;
    }
  }

  if (!postCSSConfigFound) {
    logger.error("❌ PostCSS config not found");
    logger.info("   This is likely causing the PostCSS plugin error");
    logger.info(`   Run: ${chalk.cyan("npx @sickui/cli init")} to create one`);
    logger.info("   Or create postcss.config.js manually:");
    logger.info(chalk.gray("   module.exports = {"));
    logger.info(chalk.gray("     plugins: {"));
    logger.info(chalk.gray("       tailwindcss: {},"));
    logger.info(chalk.gray("       autoprefixer: {},"));
    logger.info(chalk.gray("     },"));
    logger.info(chalk.gray("   }"));
  }

  return inferredMajor;
}
