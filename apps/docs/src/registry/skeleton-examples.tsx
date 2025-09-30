import { Skeleton } from "@sickui/core";

// Default Skeleton Example
export function SkeletonDefault() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export const SkeletonDefaultCode = `import { Skeleton } from "@sickui/core";

export function SkeletonDefault() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`;

// Variants Example
export function SkeletonVariants() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Skeleton className="h-4 w-[250px]" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Shimmer</p>
        <Skeleton variant="shimmer" className="h-4 w-[250px]" />
      </div>
    </div>
  );
}

export const SkeletonVariantsCode = `import { Skeleton } from "@sickui/core";

export function SkeletonVariants() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Skeleton className="h-4 w-[250px]" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Shimmer</p>
        <Skeleton variant="shimmer" className="h-4 w-[250px]" />
      </div>
    </div>
  );
}`;

// Card Skeleton Example
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export const SkeletonCardCode = `import { Skeleton } from "@sickui/core";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`;

// Loading State Example
export function SkeletonLoading() {
  return (
    <div className="space-y-6">
      {/* Profile skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Button skeleton */}
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
}

export const SkeletonLoadingCode = `import { Skeleton } from "@sickui/core";

export function SkeletonLoading() {
  return (
    <div className="space-y-6">
      {/* Profile skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Button skeleton */}
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
}`;