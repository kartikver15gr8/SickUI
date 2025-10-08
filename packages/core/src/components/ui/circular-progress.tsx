import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const circularProgressVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-16 h-16",
        default: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-40 h-40",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value: number; // Progress value (0–100)
  strokeWidth?: number;
  showValue?: boolean;
  duration?: number;
}

export type { CircularProgressProps };

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      value,
      size,
      strokeWidth = 6,
      showValue = true,
      duration = 1,
      ...props
    },
    ref
  ) => {
    // Get size dimensions based on variant
    const sizeMap = {
      sm: 64,
      default: 96,
      lg: 128,
      xl: 160,
    };

    const actualSize = sizeMap[size || "default"];
    const radius = (actualSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Animated motion values
    const progress: MotionValue<number> = useMotionValue(0);
    const strokeOffset = useTransform(progress, (latest) => {
      const pct = Math.min(Math.max(latest, 0), 100);
      return circumference - (pct / 100) * circumference;
    });

    // Local state for number display (because MotionValue can't render directly)
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
      const controls = animate(progress, value, {
        duration,
        ease: "easeInOut",
      });

      const unsubscribe = progress.on("change", (latest) => {
        setDisplayValue(Math.round(latest));
      });

      return () => {
        controls.stop();
        unsubscribe();
      };
    }, [value, duration, progress]);

    return (
      <div
        ref={ref}
        className={cn(circularProgressVariants({ size }), className)}
        style={{ width: actualSize, height: actualSize }}
        {...props}
      >
        <svg
          width={actualSize}
          height={actualSize}
          className="-rotate-90 transform"
        >
          {/* Background circle */}
          <circle
            stroke="hsl(var(--muted))"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={actualSize / 2}
            cy={actualSize / 2}
          />
          {/* Animated progress circle */}
          <motion.circle
            stroke="hsl(var(--primary))"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: strokeOffset }}
            r={radius}
            cx={actualSize / 2}
            cy={actualSize / 2}
          />
        </svg>

        {/* Dynamic numeric label */}
        {showValue && (
          <span className="text-foreground absolute select-none text-sm font-medium">
            {displayValue}%
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
