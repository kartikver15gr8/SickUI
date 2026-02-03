import { Command } from "commander";
import { existsSync, promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { logger } from "../utils/logger";
import { getConfig, resolveConfigPaths } from "../utils/get-project-info";
import { getRegistryItem, getRegistryIndex } from "../utils/registry";
import execa from "execa";
import prompts from "prompts";
import { getPackageManager } from "./init";

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .option("--skip-install", "skip installing dependencies.", false)
  .action(async (components, opts) => {
    const cwd = path.resolve(opts.cwd);
    const skipInstall = Boolean(opts.skipInstall);

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

    const registryIndex = await getRegistryIndex();

    let selectedComponents = components;
    if (!selectedComponents?.length && !opts.all) {
      const { components: selectedComponentsFromPrompt } = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        hint: "Space to select. A to toggle all. Enter to submit.",
        instructions: false,
        choices: registryIndex.map((entry) => ({
          title: entry.name,
          value: entry.name,
          selected: opts.all ? true : false,
        })),
      });
      selectedComponents = selectedComponentsFromPrompt;
    }

    if (!selectedComponents?.length) {
      logger.warn("No components selected. Exiting.");
      process.exit(0);
    }

    if (opts.all) {
      selectedComponents = registryIndex.map((entry) => entry.name);
    }

    const tree = await resolveTree(selectedComponents, registryIndex);
    const payload = await fetchTree(tree);
    const baseColor = config.tailwind.baseColor || "slate";

    if (!payload.length) {
      logger.warn("Selected components not found. Exiting.");
      process.exit(0);
    }

    if (!opts.yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: `Ready to install components and dependencies. Proceed?`,
        initial: true,
      });

      if (!proceed) {
        process.exit(0);
      }
    }

    logger.info(`Installing components...`);
    for (const item of payload) {
      logger.info(`Installing ${item.name}...`);

      const targetDir = await getItemTargetPath(
        configWithPaths,
        item,
        opts.path
      );

      if (!targetDir) {
        continue;
      }

      if (!existsSync(targetDir)) {
        await fs.mkdir(targetDir, { recursive: true });
      }

      const existingComponent = item.files.filter((file) =>
        existsSync(path.resolve(targetDir, file.name))
      );

      if (existingComponent.length && !opts.overwrite) {
        if (selectedComponents.includes(item.name)) {
          logger.warn(
            `Component ${item.name} already exists. Use ${chalk.green(
              "--overwrite"
            )} to overwrite.`
          );
          continue;
        }

        const { overwrite } = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `Component ${item.name} already exists. Would you like to overwrite?`,
          initial: false,
        });

        if (!overwrite) {
          logger.info(
            `Skipped ${item.name}. To overwrite, run with the ${chalk.green(
              "--overwrite"
            )} flag.`
          );
          continue;
        }
      }

      for (const file of item.files) {
        let filePath = path.resolve(targetDir, file.name);

        // Run transformers.
        const content = await transform({
          filename: file.name,
          raw: file.content,
          config: configWithPaths,
          baseColor,
        });

        await fs.writeFile(filePath, content);
      }

      // Install dependencies.
      if (item.dependencies?.length) {
        if (skipInstall) {
          logger.warn(
            `Skipped installing dependencies for ${item.name}: ${item.dependencies.join(
              ", "
            )}`
          );
        } else {
          const packageManager = await getPackageManager(cwd);
          await execa(
            packageManager,
            [
              packageManager === "npm" ? "install" : "add",
              ...item.dependencies,
            ],
            {
              cwd,
            }
          );
        }
      }

      // Install devDependencies.
      if (item.devDependencies?.length) {
        if (skipInstall) {
          logger.warn(
            `Skipped installing devDependencies for ${item.name}: ${item.devDependencies.join(
              ", "
            )}`
          );
        } else {
          const packageManager = await getPackageManager(cwd);
          await execa(
            packageManager,
            [
              packageManager === "npm" ? "install" : "add",
              packageManager === "npm" ? "--save-dev" : "--dev",
              ...item.devDependencies,
            ],
            {
              cwd,
            }
          );
        }
      }
    }

    logger.success(`Done.`);
  });

async function getItemTargetPath(config: any, item: any, override?: string) {
  if (override) {
    return path.resolve(override);
  }

  if (item.type === "components:ui") {
    return path.resolve(config.resolvedPaths.components, "ui");
  }

  if (item.type === "components:component") {
    return path.resolve(config.resolvedPaths.components);
  }

  return null;
}

async function resolveTree(names: string[], index: any[]) {
  const tree: any[] = [];

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name);

    if (!entry) {
      continue;
    }

    tree.push(entry);

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(entry.registryDependencies, index);
      tree.push(...dependencies);
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  );
}

async function fetchTree(tree: any[]) {
  try {
    const payload = await Promise.all(
      tree.map(async (item) => {
        const component = await getRegistryItem(item.name);
        return component;
      })
    );

    return payload;
  } catch (error) {
    logger.error(`Failed to fetch components from registry.`);
    process.exit(1);
  }
}

async function transform(opts: {
  filename: string;
  raw: string;
  config: any;
  baseColor?: string;
}) {
  let content = opts.raw;

  // Replace imports.
  // Replace @/lib/utils
  content = content.replace(
    new RegExp("@/lib/utils", "g"),
    opts.config.aliases["utils"]
  );
  // Replace @/components/ui
  content = content.replace(
    new RegExp("@/components/ui", "g"),
    `${opts.config.aliases["components"]}/ui`
  );
  // Replace @/components
  content = content.replace(
    /@\/components\/(.*)(?!ui)/g,
    `${opts.config.aliases["components"]}/$1`
  );

  return content;
}
