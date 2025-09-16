import { Button } from "@sickui/core";

// Default Button Example
export function ButtonDefault() {
  return <Button>Button</Button>;
}

export const ButtonDefaultCode = `import { Button } from "@sickui/core";

export function ButtonDefault() {
  return <Button>Button</Button>;
}`;

// Variants Example
export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

export const ButtonVariantsCode = `import { Button } from "@sickui/core";

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`;

// Sizes Example
export function ButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🎉</Button>
    </div>
  );
}

export const ButtonSizesCode = `import { Button } from "@sickui/core";

export function ButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🎉</Button>
    </div>
  );
}`;

// Loading Example
export function ButtonLoading() {
  return (
    <div className="flex gap-4">
      <Button disabled>
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </Button>
      <Button variant="outline" disabled>
        Please wait
      </Button>
    </div>
  );
}

export const ButtonLoadingCode = `import { Button } from "@sickui/core";

export function ButtonLoading() {
  return (
    <div className="flex gap-4">
      <Button disabled>
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </Button>
      <Button variant="outline" disabled>
        Please wait
      </Button>
    </div>
  );
}`;
