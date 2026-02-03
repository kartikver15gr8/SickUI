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
function getMissingVariables(
  existingVars: string[],
  isTailwindV4: boolean
): string[] {
  return REQUIRED_SICKUI_VARIABLES.filter((variable) => {
    if (existingVars.includes(variable)) {
      return false;
    }

    if (isTailwindV4) {
      const v4Token = `--color-${variable.slice(2)}`;
      if (existingVars.includes(v4Token)) {
        return false;
      }
    }

    return true;
  });
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

function formatV4Variables(
  variables: string[],
  isDark: boolean = false
): string {
  const values = isDark ? SICKUI_DARK_VALUES : SICKUI_LIGHT_VALUES;
  return variables
    .map((variable) => {
      const value = values[variable];
      if (variable === "--radius") {
        return `  --radius: ${value};`;
      }
      return `  --color-${variable.slice(2)}: ${value};`;
    })
    .join("\n");
}

function detectDarkStrategy(css: string): "class" | "media" {
  const hasClass = /\.dark\s*{/.test(css);
  const hasMedia = /prefers-color-scheme:\s*dark/.test(css);

  if (hasClass) {
    return "class";
  }

  if (hasMedia) {
    return "media";
  }

  return "class";
}

/**
 * Simple and reliable CSS merging approach
 */
export async function smartMergeCSS(
  cssPath: string,
  isTailwindV4: boolean = false
): Promise<void> {
  let existingCSS = await fs.readFile(cssPath, "utf8");

  // If the project is explicitly using Tailwind v4, we should NOT convert
  // v4 syntax back to v3. Only attempt conversion when we're in a v3 setup
  // but the CSS file appears to contain v4-style directives.
  const hasV4Syntax = existingCSS.includes('@import "tailwindcss"');
  const hasV4Theme = existingCSS.includes("@theme");

  if (!isTailwindV4 && (hasV4Syntax || hasV4Theme)) {
    // Convert v4 syntax to v3 syntax so SickUI variables and @apply work
    // correctly in a Tailwind v3 project.
    existingCSS = convertV4ToV3CSS(existingCSS);
  }

  // Fix common CSS issues: wrong media query for dark mode
  existingCSS = existingCSS.replace(
    /@media \(prefers-color-scheme: light\) \{[\s\S]*?--background: #0a0a0a;/g,
    (match) =>
      match.replace("prefers-color-scheme: light", "prefers-color-scheme: dark")
  );

  const darkStrategy = detectDarkStrategy(existingCSS);

  // Extract existing variables
  const existingVars = extractExistingVariables(existingCSS);

  // Determine what variables are missing
  const missingVars = getMissingVariables(existingVars, isTailwindV4);

  if (missingVars.length === 0) {
    return; // Nothing to add
  }

  let appendContent = "";

  if (isTailwindV4) {
    const hasThemeBlock = existingCSS.includes("@theme");
    const darkVars = formatV4Variables(
      missingVars.filter((variable) => variable !== "--radius"),
      true
    );

    if (hasThemeBlock) {
      const themeRegex = /(@theme\s*{)([\s\S]*?)(})/;
      const match = existingCSS.match(themeRegex);

      if (match) {
        const themeVars = formatV4Variables(missingVars, false);
        const updatedThemeContent =
          match[2] + "\n  /* SickUI theme variables */\n" + themeVars + "\n";
        let updatedCSS = existingCSS.replace(
          themeRegex,
          `$1${updatedThemeContent}$3`
        );

        if (darkStrategy === "media") {
          const darkThemeRegex =
            /(@media\s*\(prefers-color-scheme:\s*dark\)[\s\S]*?@theme\s*{)([\s\S]*?)(})/;
          const darkMatch = updatedCSS.match(darkThemeRegex);

          if (darkMatch) {
            const updatedDarkContent =
              darkMatch[2] +
              "\n  /* SickUI dark theme variables */\n" +
              darkVars +
              "\n";
            updatedCSS = updatedCSS.replace(
              darkThemeRegex,
              `$1${updatedDarkContent}$3`
            );
          } else if (darkVars.trim().length > 0) {
            updatedCSS += `

@media (prefers-color-scheme: dark) {
  @theme {
${darkVars.replace(/^/gm, "  ")}
  }
}`;
          }
        } else if (darkVars.trim().length > 0) {
          const darkClassRegex = /(\.dark\s*{)([\s\S]*?)(})/;
          const darkClassMatch = updatedCSS.match(darkClassRegex);

          if (darkClassMatch) {
            const updatedDarkContent =
              darkClassMatch[2] +
              "\n  /* SickUI dark theme variables */\n" +
              darkVars +
              "\n";
            updatedCSS = updatedCSS.replace(
              darkClassRegex,
              `$1${updatedDarkContent}$3`
            );
          } else {
            updatedCSS += `

@layer base {
  .dark {
${darkVars.replace(/^/gm, "  ")}
  }
}`;
          }
        }

        await fs.writeFile(cssPath, updatedCSS, "utf8");
        return;
      }
    }

    appendContent += "\n\n@theme {\n";
    appendContent += formatV4Variables(missingVars, false);
    appendContent += "\n}\n";

    if (darkVars.trim().length > 0) {
      if (darkStrategy === "media") {
        appendContent += `
@media (prefers-color-scheme: dark) {
  @theme {
${darkVars.replace(/^/gm, "  ")}
  }
}`;
      } else {
        appendContent += `
@layer base {
  .dark {
${darkVars.replace(/^/gm, "  ")}
  }
}`;
      }
    }
  } else {
    appendContent += "\n\n@layer base {\n  :root {\n";
    appendContent += formatVariables(missingVars, false).replace(/^/gm, "  ");
    appendContent += "\n  }\n}\n";

    if (darkStrategy === "media") {
      appendContent +=
        "\n@media (prefers-color-scheme: dark) {\n  :root {\n";
      appendContent += formatVariables(missingVars, true).replace(/^/gm, "  ");
      appendContent += "\n  }\n}";
    } else {
      appendContent += "\n@layer base {\n  .dark {\n";
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

  const extractVars = (content: string): string[] => {
    const vars: string[] = [];
    const colorVarRegex = /--color-([^:]+):\s*([^;]+);/g;
    let colorMatch;

    while ((colorMatch = colorVarRegex.exec(content)) !== null) {
      const varName = colorMatch[1];
      const varValue = colorMatch[2].trim();

      if (!varValue.startsWith("var(")) {
        vars.push(`  --${varName}: ${varValue};`);
      }
    }

    const otherVarRegex = /--((?!color-)[^:]+):\s*([^;]+);/g;
    let otherMatch;

    while ((otherMatch = otherVarRegex.exec(content)) !== null) {
      const varName = otherMatch[1];
      const varValue = otherMatch[2].trim();

      if (!varValue.startsWith("var(")) {
        vars.push(`  --${varName}: ${varValue};`);
      }
    }

    return vars;
  };

  const extractedVars: string[] = [];
  const extractedDarkVars: string[] = [];

  // Extract dark variables from media theme blocks first
  const darkMediaRegex =
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?)\}/g;
  let darkMediaMatch;

  while ((darkMediaMatch = darkMediaRegex.exec(convertedCSS)) !== null) {
    const mediaContent = darkMediaMatch[1];
    const themeMatches = mediaContent.matchAll(/@theme\s*{([\s\S]*?)}/g);

    for (const match of themeMatches) {
      extractedDarkVars.push(...extractVars(match[1]));
    }
  }

  convertedCSS = convertedCSS.replace(darkMediaRegex, "");

  // Extract dark variables from .dark blocks (v4 class-based)
  const darkClassRegex = /\.dark\s*{([\s\S]*?)}/g;
  let darkClassMatch;

  while ((darkClassMatch = darkClassRegex.exec(convertedCSS)) !== null) {
    const darkContent = darkClassMatch[1];
    const darkVars = extractVars(darkContent);
    if (darkVars.length > 0) {
      extractedDarkVars.push(...darkVars);
    }
  }

  convertedCSS = convertedCSS.replace(
    /\.dark\s*{[\s\S]*?--color-[\s\S]*?}/g,
    ""
  );

  // Extract light variables from remaining @theme blocks
  const themeRegex = /@theme\s+[^{]*\{([^}]*)\}/g;
  let themeMatch;

  while ((themeMatch = themeRegex.exec(convertedCSS)) !== null) {
    extractedVars.push(...extractVars(themeMatch[1]));
  }

  // Remove all @theme blocks
  convertedCSS = convertedCSS.replace(/@theme\s+[^{]*\{[^}]*\}/g, "");

  const unique = (vars: string[]) => Array.from(new Set(vars));
  const lightVars = unique(extractedVars);
  const darkVars = unique(extractedDarkVars);

  if (lightVars.length > 0) {
    let rootVars = `:root {\n${lightVars.join("\n")}\n}\n\n`;
    if (darkVars.length > 0) {
      rootVars += `.dark {\n${darkVars.join("\n")}\n}\n\n`;
    }

    const tailwindDirectives =
      "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
    convertedCSS = convertedCSS.replace(
      tailwindDirectives,
      tailwindDirectives + "\n" + rootVars
    );
  }

  return convertedCSS;
}
