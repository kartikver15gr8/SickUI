import { Badge } from "@sickui/core";

// Default Badge Example
export function BadgeDefault() {
  return <Badge>Badge</Badge>;
}

export const BadgeDefaultCode = `import { Badge } from "@sickui/core";

export function BadgeDefault() {
  return <Badge>Badge</Badge>;
}`;

// Variants Example
export function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
  );
}

export const BadgeVariantsCode = `import { Badge } from "@sickui/core";

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
  );
}`;
