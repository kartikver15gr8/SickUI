"use client";

import { CircularProgress } from "@sickui/core";
import { useState, useEffect } from "react";

// Default CircularProgress Example
export function CircularProgressDefault() {
  return <CircularProgress value={75} />;
}

export const CircularProgressDefaultCode = `import { CircularProgress } from "@sickui/core";

export function CircularProgressDefault() {
  return <CircularProgress value={75} />;
}`;

// Size Variants Example
export function CircularProgressSizes() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={40} size="sm" />
        <span className="text-sm text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={65} size="default" />
        <span className="text-sm text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={85} size="lg" />
        <span className="text-sm text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={90} size="xl" />
        <span className="text-sm text-muted-foreground">Extra Large</span>
      </div>
    </div>
  );
}

export const CircularProgressSizesCode = `import { CircularProgress } from "@sickui/core";

export function CircularProgressSizes() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={40} size="sm" />
        <span className="text-sm text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={65} size="default" />
        <span className="text-sm text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={85} size="lg" />
        <span className="text-sm text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={90} size="xl" />
        <span className="text-sm text-muted-foreground">Extra Large</span>
      </div>
    </div>
  );
}`;

// Stroke Width Variants Example
export function CircularProgressStrokes() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={60} strokeWidth={2} />
        <span className="text-sm text-muted-foreground">Thin (2px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={70} strokeWidth={6} />
        <span className="text-sm text-muted-foreground">Default (6px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={80} strokeWidth={10} />
        <span className="text-sm text-muted-foreground">Thick (10px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={90} strokeWidth={14} />
        <span className="text-sm text-muted-foreground">Extra Thick (14px)</span>
      </div>
    </div>
  );
}

export const CircularProgressStrokesCode = `import { CircularProgress } from "@sickui/core";

export function CircularProgressStrokes() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={60} strokeWidth={2} />
        <span className="text-sm text-muted-foreground">Thin (2px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={70} strokeWidth={6} />
        <span className="text-sm text-muted-foreground">Default (6px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={80} strokeWidth={10} />
        <span className="text-sm text-muted-foreground">Thick (10px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={90} strokeWidth={14} />
        <span className="text-sm text-muted-foreground">Extra Thick (14px)</span>
      </div>
    </div>
  );
}`;

// Animated Example
export function CircularProgressAnimated() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={progress} duration={0.1} />
        <span className="text-sm text-muted-foreground">Animated Progress</span>
      </div>
    </div>
  );
}

export const CircularProgressAnimatedCode = `"use client";

import { CircularProgress } from "@sickui/core";
import { useState, useEffect } from "react";

export function CircularProgressAnimated() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={progress} duration={0.1} />
        <span className="text-sm text-muted-foreground">Animated Progress</span>
      </div>
    </div>
  );
}`;

// Without Value Display Example
export function CircularProgressNoValue() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={45} showValue={false} />
        <span className="text-sm text-muted-foreground">No Value Display</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} showValue={true} />
        <span className="text-sm text-muted-foreground">With Value Display</span>
      </div>
    </div>
  );
}

export const CircularProgressNoValueCode = `import { CircularProgress } from "@sickui/core";

export function CircularProgressNoValue() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={45} showValue={false} />
        <span className="text-sm text-muted-foreground">No Value Display</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} showValue={true} />
        <span className="text-sm text-muted-foreground">With Value Display</span>
      </div>
    </div>
  );
}`;

// Loading States Example
export function CircularProgressLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsLoading(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleReset = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress value={progress} size="lg" />
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
        >
          {isLoading ? "Loading..." : "Reset"}
        </button>
      </div>
    </div>
  );
}

export const CircularProgressLoadingCode = `"use client";

import { CircularProgress } from "@sickui/core";
import { useState, useEffect } from "react";

export function CircularProgressLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsLoading(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleReset = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress value={progress} size="lg" />
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
        >
          {isLoading ? "Loading..." : "Reset"}
        </button>
      </div>
    </div>
  );
}`;
