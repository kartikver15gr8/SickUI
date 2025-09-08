import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getProjectInfo } from "../utils/get-project-info";

export const check = new Command()
  .name("check")
  .description("Check your project setup and diagnose common issues")
  .action(async () => {
    const cwd = process.cwd();
    
    logger.info("🔍 Checking your SickUI setup...");
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
    const cssPath = path.resolve(cwd, componentsJson.tailwind?.css || "src/app/globals.css");
    
    // Check if CSS file exists
    if (!fs.existsSync(cssPath)) {
      logger.error(`❌ CSS file not found: ${componentsJson.tailwind?.css}`);
      logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} to create it`);
      return;
    }
    logger.success(`✅ CSS file found: ${componentsJson.tailwind?.css}`);

    // Check if CSS file has required variables
    const cssContent = await fs.readFile(cssPath, "utf8");
    const requiredVariables = [
      "--background",
      "--foreground", 
      "--primary",
      "--primary-foreground",
      "--border",
      "--input",
      "--ring"
    ];

    const missingVariables = requiredVariables.filter(
      variable => !cssContent.includes(variable)
    );

    if (missingVariables.length > 0) {
      logger.error("❌ Missing CSS variables in your CSS file:");
      missingVariables.forEach(variable => {
        logger.error(`   ${variable}`);
      });
      logger.info("");
      logger.info("💡 Solution: Add the missing CSS variables to your CSS file:");
      logger.info(`   Check the SickUI documentation for the complete CSS template`);
      return;
    }
    logger.success("✅ All required CSS variables found");

    // Check if Tailwind config exists
    const projectInfo = await getProjectInfo();
    const tailwindConfigPath = projectInfo.isTypeScript 
      ? path.resolve(cwd, "tailwind.config.ts")
      : path.resolve(cwd, "tailwind.config.js");
    
    if (!fs.existsSync(tailwindConfigPath)) {
      logger.error("❌ Tailwind config not found");
      logger.info(`   Run ${chalk.cyan("npx @sickui/cli init")} to create it`);
      return;
    }
    logger.success("✅ Tailwind config found");

    // Check if Tailwind config has required content paths
    const tailwindConfig = await fs.readFile(tailwindConfigPath, "utf8");
    if (!tailwindConfig.includes("./src/**/*.{ts,tsx}") && !tailwindConfig.includes("./app/**/*.{ts,tsx}")) {
      logger.warn("⚠️  Tailwind config might be missing content paths");
      logger.info("   Make sure your tailwind.config includes:");
      logger.info("   './src/**/*.{ts,tsx}' or './app/**/*.{ts,tsx}'");
    } else {
      logger.success("✅ Tailwind config has content paths");
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
          path.resolve(cwd, "src/app/layout.tsx")
        ];
        
        let layoutFound = false;
        for (const layoutPath of layoutPaths) {
          if (fs.existsSync(layoutPath)) {
            layoutFound = true;
            const layoutContent = await fs.readFile(layoutPath, "utf8");
            const cssFileName = path.basename(componentsJson.tailwind?.css || "globals.css");
            
            if (layoutContent.includes(`import "./${cssFileName}"`)) {
              logger.success(`✅ CSS imported in ${path.relative(cwd, layoutPath)}`);
            } else {
              logger.warn(`⚠️  CSS not imported in ${path.relative(cwd, layoutPath)}`);
              logger.info(`   Add: ${chalk.green(`import "./${cssFileName}"`)}`);
            }
            break;
          }
        }
        
        if (!layoutFound) {
          logger.warn("⚠️  No layout.tsx found");
          logger.info("   Make sure to import your CSS file in your layout component");
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
  });
