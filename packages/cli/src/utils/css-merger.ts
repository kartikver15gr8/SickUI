/**
 * Smart CSS Merger for SickUI
 *
 * This module provides intelligent CSS merging capabilities that preserve
 * existing user CSS while adding only the necessary SickUI variables.
 * Similar to how ShadCN handles CSS integration.
 */

import { promises as fs } from "fs";

// Required SickUI variables for components to work
const REQUIRED_SICKUI_VARIABLES = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
];

// SickUI variable values
const SICKUI_LIGHT_VALUES: Record<string, string> = {
  "--primary": "#3b82f6",
  "--primary-foreground": "#f8fafc",
  "--secondary": "#f1f5f9",
  "--secondary-foreground": "#0f172a",
  "--muted": "#f1f5f9",
  "--muted-foreground": "#64748b",
  "--accent": "#f1f5f9",
  "--accent-foreground": "#0f172a",
  "--destructive": "#ef4444",
  "--destructive-foreground": "#f8fafc",
  "--border": "#e2e8f0",
  "--input": "#e2e8f0",
  "--ring": "#3b82f6",
  "--card": "#ffffff",
  "--card-foreground": "#0f172a",
  "--popover": "#ffffff",
  "--popover-foreground": "#0f172a",
};

const SICKUI_DARK_VALUES: Record<string, string> = {
  "--primary": "#60a5fa",
  "--primary-foreground": "#0f172a",
  "--secondary": "#1e293b",
  "--secondary-foreground": "#f8fafc",
  "--muted": "#1e293b",
  "--muted-foreground": "#94a3b8",
  "--accent": "#1e293b",
  "--accent-foreground": "#f8fafc",
  "--destructive": "#dc2626",
  "--destructive-foreground": "#f8fafc",
  "--border": "#1e293b",
  "--input": "#1e293b",
  "--ring": "#94a3b8",
  "--card": "#0f172a",
  "--card-foreground": "#f8fafc",
  "--popover": "#0f172a",
  "--popover-foreground": "#f8fafc",
};

/**
 * Extract existing CSS variables from content
 */
function extractExistingVariables(css: string): string[] {
  const variableRegex = /--([\w-]+)\s*:/g;
  const variables: string[] = [];
  let match;

  while ((match = variableRegex.exec(css)) !== null) {
    variables.push(`--${match[1]}`);
  }

  return variables;
}

/**
 * Get missing SickUI variables that need to be added
 */
function getMissingVariables(existingVars: string[]): string[] {
  return REQUIRED_SICKUI_VARIABLES.filter(
    (variable) => !existingVars.includes(variable)
  );
}

/**
 * Format variables for insertion into CSS
 */
function formatVariables(variables: string[], isDark: boolean = false): string {
  const values = isDark ? SICKUI_DARK_VALUES : SICKUI_LIGHT_VALUES;
  return variables
    .map((variable) => `  ${variable}: ${values[variable]};`)
    .join("\n");
}

/**
 * Simple and reliable CSS merging approach
 */
export async function smartMergeCSS(
  cssPath: string,
  isTailwindV4: boolean = false
): Promise<void> {
  const existingCSS = await fs.readFile(cssPath, "utf8");

  // Extract existing variables
  const existingVars = extractExistingVariables(existingCSS);

  // Determine what variables are missing
  const missingVars = getMissingVariables(existingVars);

  if (missingVars.length === 0) {
    return; // Nothing to add
  }

  let appendContent = "";

  if (isTailwindV4) {
    // For Tailwind v4, we need to add variables to @theme block
    const hasThemeBlock = existingCSS.includes("@theme");

    if (hasThemeBlock) {
      // Find and enhance existing @theme block
      const themeRegex = /(@theme[^{]*{)([\s\S]*?)(})/;
      const match = existingCSS.match(themeRegex);

      if (match) {
        const themeVars = missingVars
          .map(
            (variable) =>
              `  --color-${variable.slice(2)}: ${
                SICKUI_LIGHT_VALUES[variable]
              };`
          )
          .join("\n");

        const updatedThemeContent =
          match[2] + "\n  /* SickUI theme variables */\n" + themeVars + "\n";
        const updatedCSS = existingCSS.replace(
          themeRegex,
          `$1${updatedThemeContent}$3`
        );

        // Also add legacy CSS variables for component compatibility
        const legacyVars = missingVars
          .map(
            (variable) => `  ${variable}: var(--color-${variable.slice(2)});`
          )
          .join("\n");

        appendContent =
          "\n\n/* SickUI CSS Variables for Component Compatibility */\n:root {\n" +
          legacyVars +
          "\n}";

        await fs.writeFile(cssPath, updatedCSS + appendContent, "utf8");
        return;
      }
    } else {
      // Create new @theme block
      appendContent += "\n\n/* SickUI Theme Variables */\n@theme {\n";
      appendContent += missingVars
        .map(
          (variable) =>
            `  --color-${variable.slice(2)}: ${SICKUI_LIGHT_VALUES[variable]};`
        )
        .join("\n");
      appendContent += "\n}\n";

      // Add legacy CSS variables
      appendContent +=
        "\n/* SickUI CSS Variables for Component Compatibility */\n:root {\n";
      appendContent += formatVariables(missingVars, false);
      appendContent += "\n}";
    }
  } else {
    // For Tailwind v3, add regular CSS variables
    appendContent += "\n\n/* SickUI Variables */\n:root {\n";
    appendContent += formatVariables(missingVars, false);
    appendContent += "\n}";
  }

  // Add dark mode variables if they don't exist
  const hasDarkMode =
    existingCSS.includes("prefers-color-scheme: dark") ||
    existingCSS.includes(".dark");
  if (!hasDarkMode && missingVars.length > 0) {
    if (isTailwindV4) {
      appendContent +=
        "\n\n@media (prefers-color-scheme: dark) {\n  @theme {\n";
      appendContent += missingVars
        .map(
          (variable) =>
            `    --color-${variable.slice(2)}: ${SICKUI_DARK_VALUES[variable]};`
        )
        .join("\n");
      appendContent += "\n  }\n  :root {\n";
      appendContent += formatVariables(missingVars, true).replace(
        /^/gm,
        "    "
      );
      appendContent += "\n  }\n}";
    } else {
      appendContent += "\n\n@media (prefers-color-scheme: dark) {\n  :root {\n";
      appendContent += formatVariables(missingVars, true).replace(/^/gm, "  ");
      appendContent += "\n  }\n}";
    }
  }

  // Write the updated CSS
  const updatedCSS = existingCSS + appendContent;
  await fs.writeFile(cssPath, updatedCSS, "utf8");
}
