"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

const calendarVariants = cva("w-full max-w-sm rounded-lg bg-card p-4");

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  disabled?: boolean;
  showAnimation?: boolean;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      selectedDate,
      onDateSelect,
      disabled = false,
      showAnimation = true,
      ...props
    },
    ref
  ) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = React.useState(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );
    const [showMonthYearPicker, setShowMonthYearPicker] = React.useState(false);

    const month = currentMonth.toLocaleDateString("en-US", { month: "long" });
    const year = currentMonth.getFullYear();

    // Close popup when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showMonthYearPicker && ref && "current" in ref && ref.current) {
          const target = event.target as Node;
          if (!ref.current.contains(target)) {
            setShowMonthYearPicker(false);
          }
        }
      };

      if (showMonthYearPicker) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [showMonthYearPicker, ref]);

    // Days of week labels
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get days for current month
    const daysInMonth = new Date(
      year,
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const startDay = currentMonth.getDay(); // weekday index of 1st day
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Handle prev/next month
    const changeMonth = (offset: number) => {
      if (disabled) return;
      setCurrentMonth(new Date(year, currentMonth.getMonth() + offset, 1));
    };

    const handleDateSelect = (date: Date) => {
      if (disabled || !onDateSelect) return;
      onDateSelect(date);
    };

    const CalendarWrapper = showAnimation ? motion.div : "div";
    const animationProps = showAnimation
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        }
      : {};

    return (
      <CalendarWrapper
        ref={ref}
        className={cn(calendarVariants(), "relative", className)}
        {...(animationProps as any)}
        {...props}
      >
        {/* Header with navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            disabled={disabled}
            className={cn(
              "rounded-full p-1 transition-colors",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {showAnimation ? (
            <motion.button
              key={month + year}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-foreground hover:bg-accent hover:text-accent-foreground rounded px-3 py-1 text-lg font-semibold transition-colors"
              onClick={() => setShowMonthYearPicker(true)}
              disabled={disabled}
            >
              {month} {year}
            </motion.button>
          ) : (
            <button
              className="text-foreground hover:bg-accent hover:text-accent-foreground rounded px-3 py-1 text-lg font-semibold transition-colors"
              onClick={() => setShowMonthYearPicker(true)}
              disabled={disabled}
            >
              {month} {year}
            </button>
          )}
          <button
            onClick={() => changeMonth(1)}
            disabled={disabled}
            className={cn(
              "rounded-full p-1 transition-colors",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Month/Year Picker Popup */}
        {showMonthYearPicker && (
          <div className="bg-background border-border absolute left-0 right-0 top-0 z-20 rounded-lg border p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground font-semibold">
                Select Month & Year
              </h3>
              <button
                onClick={() => setShowMonthYearPicker(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Year Selection */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(year - 1, currentMonth.getMonth(), 1)
                  )
                }
                className="hover:bg-accent hover:text-accent-foreground rounded p-2 transition-colors"
                disabled={disabled}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold">{year}</span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(year + 1, currentMonth.getMonth(), 1)
                  )
                }
                className="hover:bg-accent hover:text-accent-foreground rounded p-2 transition-colors"
                disabled={disabled}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Month Selection Grid */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(year, i, 1);
                const monthName = monthDate.toLocaleDateString("en-US", {
                  month: "short",
                });
                const isCurrentMonth = i === currentMonth.getMonth();

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentMonth(new Date(year, i, 1));
                      setShowMonthYearPicker(false);
                    }}
                    disabled={disabled}
                    className={cn(
                      "rounded-lg p-2 text-sm transition-colors",
                      isCurrentMonth
                        ? "text-primary-foreground bg-black dark:bg-white"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowMonthYearPicker(false)}
              className="text-primary-foreground w-full rounded-lg bg-black p-2 transition-colors hover:bg-black/80 dark:bg-white dark:hover:bg-white/80"
            >
              Done
            </button>
          </div>
        )}

        {/* Weekday labels */}
        <div className="text-muted-foreground mb-2 mt-2 grid grid-cols-7 text-center text-xs font-medium">
          {weekdays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Empty slots before first day */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={"empty-" + i}></div>
          ))}

          {showAnimation ? (
            <AnimatePresence mode="popLayout">
              {daysArray.map((day) => {
                const date = new Date(year, currentMonth.getMonth(), day);
                const isToday = date.toDateString() === today.toDateString();
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();

                return (
                  <motion.button
                    key={day}
                    layout
                    whileHover={disabled ? {} : { scale: 1.1 }}
                    whileTap={disabled ? {} : { scale: 0.95 }}
                    onClick={() => handleDateSelect(date)}
                    disabled={disabled}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                      disabled && "cursor-not-allowed opacity-50",
                      isSelected
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : isToday
                          ? "border border-black text-black dark:border-white dark:text-white"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {day}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          ) : (
            <>
              {daysArray.map((day) => {
                const date = new Date(year, currentMonth.getMonth(), day);
                const isToday = date.toDateString() === today.toDateString();
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(date)}
                    disabled={disabled}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                      disabled && "cursor-not-allowed opacity-50",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "border-primary text-primary border"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </CalendarWrapper>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar, calendarVariants };
