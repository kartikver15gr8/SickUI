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

  // Fix v4 to v3 conversion if needed
  const hasV4Syntax = existingCSS.includes('@import "tailwindcss"');
  const hasV4Theme = existingCSS.includes("@theme");

  if (hasV4Syntax || hasV4Theme) {
    // Convert v4 syntax to v3 syntax
    existingCSS = convertV4ToV3CSS(existingCSS);
    isTailwindV4 = false; // Force v3 mode after conversion
  }

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
      const themeRegex = /(@theme\s*{)([\s\S]*?)(})/;
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

        // Add dark mode @theme block
        const darkModeVars = missingVars
          .map((variable) => {
            const value = SICKUI_DARK_VALUES[variable];
            if (variable === "--radius") {
              return `    ${variable}: ${value};`;
            }
            return `    --color-${variable.slice(2)}: ${value};`;
          })
          .join("\n");

        // Check if dark mode @theme exists
        const hasDarkTheme =
          /@media \(prefers-color-scheme: dark\)[\s\S]*?@theme/.test(
            updatedCSS
          );

        if (!hasDarkTheme) {
          appendContent = `

@media (prefers-color-scheme: dark) {
  @theme {
${darkModeVars}
  }
}`;
        }

        await fs.writeFile(cssPath, updatedCSS + appendContent, "utf8");
        return;
      }
    } else {
      // Create new @theme block
      appendContent += "\n\n@theme {\n";
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

      // Add dark mode @theme
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
}`;
    }
  } else {
    // For Tailwind v3, add regular CSS variables
    appendContent += "\n\n/* SickUI Variables */\n:root {\n";
    appendContent += formatVariables(missingVars, false);
    appendContent += "\n}";
  }

  // Add dark mode variables for Tailwind v3 only (v4 handles it above)
  if (missingVars.length > 0 && !isTailwindV4) {
    appendContent += "\n\n@media (prefers-color-scheme: dark) {\n  :root {\n";
    appendContent += formatVariables(missingVars, true).replace(/^/gm, "  ");
    appendContent += "\n  }\n}";
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

/**
 * Convert Tailwind v4 CSS syntax to v3 syntax
 */
function convertV4ToV3CSS(css: string): string {
  let convertedCSS = css;

  // Replace @import "tailwindcss" with v3 directives
  convertedCSS = convertedCSS.replace(
    /@import\s+["']tailwindcss["'];?\s*/g,
    "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
  );

  // Remove @theme blocks and extract variables
  const themeRegex = /@theme\s+[^{]*\{([^}]*)\}/g;
  let themeMatch;
  const extractedVars: string[] = [];

  while ((themeMatch = themeRegex.exec(convertedCSS)) !== null) {
    const themeContent = themeMatch[1];

    // Convert --color-* variables to regular CSS variables
    const colorVarRegex = /--color-([^:]+):\s*([^;]+);/g;
    let colorMatch;

    while ((colorMatch = colorVarRegex.exec(themeContent)) !== null) {
      const varName = colorMatch[1];
      const varValue = colorMatch[2].trim();

      // Skip if it's a var() reference
      if (!varValue.startsWith("var(")) {
        extractedVars.push(`  --${varName}: ${varValue};`);
      }
    }

    // Extract other variables (like --radius)
    const otherVarRegex = /--((?!color-)[^:]+):\s*([^;]+);/g;
    let otherMatch;

    while ((otherMatch = otherVarRegex.exec(themeContent)) !== null) {
      const varName = otherMatch[1];
      const varValue = otherMatch[2].trim();

      if (!varValue.startsWith("var(")) {
        extractedVars.push(`  --${varName}: ${varValue};`);
      }
    }
  }

  // Remove all @theme blocks
  convertedCSS = convertedCSS.replace(/@theme\s+[^{]*\{[^}]*\}/g, "");

  // If we extracted variables, add them to :root
  if (extractedVars.length > 0) {
    const rootVars = `:root {\n${extractedVars.join("\n")}\n}\n\n`;

    // Insert after the @tailwind directives
    const tailwindDirectives =
      "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
    convertedCSS = convertedCSS.replace(
      tailwindDirectives,
      tailwindDirectives + "\n" + rootVars
    );
  }

  return convertedCSS;
}
