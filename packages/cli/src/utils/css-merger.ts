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
  "--background",
  "--foreground",
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
  "--radius",
];

// SickUI variable values (HSL format to match templates)
const SICKUI_LIGHT_VALUES: Record<string, string> = {
  "--background": "0 0% 100%",
  "--foreground": "222.2 84% 4.9%",
  "--primary": "221.2 83.2% 53.3%",
  "--primary-foreground": "210 40% 98%",
  "--secondary": "210 40% 96%",
  "--secondary-foreground": "222.2 84% 4.9%",
  "--muted": "210 40% 96%",
  "--muted-foreground": "215.4 16.3% 46.9%",
  "--accent": "210 40% 96%",
  "--accent-foreground": "222.2 84% 4.9%",
  "--destructive": "0 84.2% 60.2%",
  "--destructive-foreground": "210 40% 98%",
  "--border": "214.3 31.8% 91.4%",
  "--input": "214.3 31.8% 91.4%",
  "--ring": "221.2 83.2% 53.3%",
  "--card": "0 0% 100%",
  "--card-foreground": "222.2 84% 4.9%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "222.2 84% 4.9%",
  "--radius": "0.5rem",
};

// Dark mode values for SickUI components (updated to match docs website)
const SICKUI_DARK_VALUES: Record<string, string> = {
  "--background": "0 0% 2.4%",
  "--foreground": "210 40% 98%",
  "--primary": "217.2 91.2% 59.8%",
  "--primary-foreground": "0 0% 2.4%",
  "--secondary": "0 0% 8%",
  "--secondary-foreground": "210 40% 98%",
  "--muted": "0 0% 8%",
  "--muted-foreground": "215 20.2% 65.1%",
  "--accent": "0 0% 8%",
  "--accent-foreground": "210 40% 98%",
  "--destructive": "0 62.8% 30.6%",
  "--destructive-foreground": "210 40% 98%",
  "--border": "0 0% 8%",
  "--input": "0 0% 8%",
  "--ring": "224.3 76.3% 94.1%",
  "--card": "0 0% 2.4%",
  "--card-foreground": "210 40% 98%",
  "--popover": "0 0% 2.4%",
  "--popover-foreground": "210 40% 98%",
  "--radius": "0.5rem",
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
    .map((variable) => {
      const value = values[variable];
      // For radius, use the value directly, for colors wrap in hsl()
      if (variable === "--radius") {
        return `  ${variable}: ${value};`;
      }
      return `  ${variable}: ${value};`;
    })
    .join("\n");
}

/**
 * Simple and reliable CSS merging approach
 */
export async function smartMergeCSS(
  cssPath: string,
  isTailwindV4: boolean = false
): Promise<void> {
  let existingCSS = await fs.readFile(cssPath, "utf8");

  // Fix common CSS issues: wrong media query for dark mode
  existingCSS = existingCSS.replace(
    /@media \(prefers-color-scheme: light\) \{[\s\S]*?--background: #0a0a0a;/g,
    (match) =>
      match.replace("prefers-color-scheme: light", "prefers-color-scheme: dark")
  );

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
          .map((variable) => {
            const value = SICKUI_LIGHT_VALUES[variable];
            if (variable === "--radius") {
              return `  ${variable}: ${value};`;
            }
            return `  --color-${variable.slice(2)}: ${value};`;
          })
          .join("\n");

        const updatedThemeContent =
          match[2] + "\n  /* SickUI theme variables */\n" + themeVars + "\n";
        const updatedCSS = existingCSS.replace(
          themeRegex,
          `$1${updatedThemeContent}$3`
        );

        // Also add legacy CSS variables for component compatibility
        const legacyVars = missingVars
          .map((variable) => {
            if (variable === "--radius") {
              return `  ${variable}: ${SICKUI_LIGHT_VALUES[variable]};`;
            }
            return `  ${variable}: var(--color-${variable.slice(2)});`;
          })
          .join("\n");

        appendContent =
          "\n\n/* SickUI CSS Variables for Component Compatibility */\n:root {\n" +
          legacyVars +
          "\n}";

        // Add dark mode variables to the updated CSS
        const darkModeVars = missingVars
          .map((variable) => {
            const value = SICKUI_DARK_VALUES[variable];
            if (variable === "--radius") {
              return `    ${variable}: ${value};`;
            }
            return `    --color-${variable.slice(2)}: ${value};`;
          })
          .join("\n");

        appendContent += `

@media (prefers-color-scheme: dark) {
  @theme {
${darkModeVars}
  }
  :root {
${formatVariables(missingVars, true).replace(/^/gm, "    ")}
  }
}`;

        await fs.writeFile(cssPath, updatedCSS + appendContent, "utf8");
        return;
      }
    } else {
      // Create new @theme block
      appendContent += "\n\n/* SickUI Theme Variables */\n@theme {\n";
      appendContent += missingVars
        .map((variable) => {
          const value = SICKUI_LIGHT_VALUES[variable];
          if (variable === "--radius") {
            return `  ${variable}: ${value};`;
          }
          return `  --color-${variable.slice(2)}: ${value};`;
        })
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

  // Always add dark mode variables for SickUI components
  if (missingVars.length > 0) {
    if (isTailwindV4) {
      appendContent +=
        "\n\n@media (prefers-color-scheme: dark) {\n  @theme {\n";
      appendContent += missingVars
        .map((variable) => {
          const value = SICKUI_DARK_VALUES[variable];
          if (variable === "--radius") {
            return `    ${variable}: ${value};`;
          }
          return `    --color-${variable.slice(2)}: ${value};`;
        })
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

  // Add essential base styles for SickUI components if not present
  const hasBaseStyles = existingCSS.includes("@apply border-border");

  if (!hasBaseStyles && missingVars.length > 0) {
    appendContent += `

/* SickUI Base Styles - Essential for component styling */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
  }

  // Write the updated CSS
  const updatedCSS = existingCSS + appendContent;
  await fs.writeFile(cssPath, updatedCSS, "utf8");
}
