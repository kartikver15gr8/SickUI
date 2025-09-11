import { Command } from "commander";
import { existsSync, promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getConfig, resolveConfigPaths } from "../utils/get-project-info";
import { getRegistryItem } from "../utils/registry";

export const diff = new Command()
  .name("diff")
  .description("check for updates against the registry")
  .argument("[component]", "the component name")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (name, opts) => {
    const cwd = path.resolve(opts.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const config = await getConfig(cwd);
    if (!config) {
      logger.warn(
        `Configuration is missing. Please run ${chalk.green(
          `init`
        )} to create a components.json file.`
      );
      process.exit(1);
    }

    const configWithPaths = await resolveConfigPaths(cwd, config);

    if (!name) {
      logger.error("Please specify a component name.");
      process.exit(1);
    }

    try {
      const registryItem = await getRegistryItem(name);

      if (!registryItem) {
        logger.error(`Component "${name}" not found in registry.`);
        process.exit(1);
      }

      const targetDir = path.resolve(
        configWithPaths.resolvedPaths.components,
        "ui"
      );

      const componentPath = path.resolve(targetDir, `${name}.tsx`);

      if (!existsSync(componentPath)) {
        logger.warn(`Component "${name}" not found in your project.`);
        logger.info(`Run ${chalk.green(`sickui add ${name}`)} to add it.`);
        return;
      }

      const localContent = await fs.readFile(componentPath, "utf8");
      const registryContent = registryItem.files[0]?.content || "";

      // Simple content comparison
      const localLines = localContent.split("\n");
      const registryLines = registryContent.split("\n");

      let hasChanges = false;

      if (localLines.length !== registryLines.length) {
        hasChanges = true;
      } else {
        for (let i = 0; i < localLines.length; i++) {
          if (localLines[i].trim() !== registryLines[i].trim()) {
            hasChanges = true;
            break;
          }
        }
      }

      if (hasChanges) {
        logger.warn(`Component "${name}" has changes.`);
        logger.info(
          `Run ${chalk.green(
            `sickui add ${name} --overwrite`
          )} to update to the latest version.`
        );
      } else {
        logger.success(`Component "${name}" is up to date.`);
      }
    } catch (error) {
      logger.error(`Failed to check component "${name}".`);
      process.exit(1);
    }
  });
