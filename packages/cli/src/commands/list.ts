import { Command } from "commander";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getRegistryIndex } from "../utils/registry";

export const list = new Command()
  .name("list")
  .description("list all available components")
  .action(async () => {
    try {
      const registryIndex = await getRegistryIndex();

      if (!registryIndex?.length) {
        logger.warn("No components found in registry.");
        return;
      }

      logger.info("Available components:");
      logger.break();

      const components = registryIndex.filter(
        (item) => item.type === "components:ui"
      );

      for (const component of components) {
        logger.info(`${chalk.green("●")} ${chalk.bold(component.name)}`);

        if (component.dependencies?.length) {
          logger.info(
            `  ${chalk.gray("Dependencies:")} ${component.dependencies.join(", ")}`
          );
        }
      }

      logger.break();
      logger.info(
        `Total: ${chalk.bold(components.length)} component${
          components.length === 1 ? "" : "s"
        }`
      );
      logger.break();
      logger.info(
        `Run ${chalk.green("sickui add <component>")} to add a component.`
      );
    } catch (error) {
      logger.error("Failed to fetch components from registry.");
      process.exit(1);
    }
  });
