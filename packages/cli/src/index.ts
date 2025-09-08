#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { list } from "./commands/list";
import { diff } from "./commands/diff";
import { check } from "./commands/check";
import { getPackageInfo } from "./utils/get-package-info";
import { handleError } from "./utils/handle-error";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
process.on("uncaughtException", handleError);
process.on("unhandledRejection", handleError);

async function main() {
  const packageInfo = await getPackageInfo();

  const program = new Command()
    .name("sickui")
    .description("Add components and dependencies to your project")
    .version(
      packageInfo.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program
    .addCommand(init)
    .addCommand(add)
    .addCommand(list)
    .addCommand(diff)
    .addCommand(check);

  program.parse();
}

main();
