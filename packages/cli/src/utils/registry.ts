import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    })
  ),
  type: z.enum(["components:ui", "components:component", "components:example"]),
});

export const registryIndexSchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;

export const REGISTRY_URL =
  "https://raw.githubusercontent.com/kartikver15gr8/SickUI/main/registry";

export const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/kartikver15gr8/SickUI/main/packages/core/src/components/ui";

export async function getRegistryIndex(): Promise<RegistryItem[]> {
  try {
    const response = await fetch(`${REGISTRY_URL}/index.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return registryIndexSchema.parse(data);
  } catch (error) {
    throw new Error(`Failed to fetch registry index: ${error}`);
  }
}

export async function getRegistryItem(name: string): Promise<RegistryItem> {
  try {
    // First, get component metadata from registry
    const response = await fetch(`${REGISTRY_URL}/${name}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const registryData = await response.json();

    // Then, fetch the actual component code directly from GitHub
    const componentResponse = await fetch(`${GITHUB_RAW_URL}/${name}.tsx`);
    if (!componentResponse.ok) {
      throw new Error(
        `HTTP ${componentResponse.status}: ${componentResponse.statusText}`
      );
    }
    const componentCode = await componentResponse.text();

    // Combine registry metadata with fresh component code
    const item: RegistryItem = {
      ...registryData,
      files: [
        {
          name: `${name}.tsx`,
          content: componentCode,
        },
      ],
    };

    return registryItemSchema.parse(item);
  } catch (error) {
    throw new Error(`Failed to fetch registry item "${name}": ${error}`);
  }
}
