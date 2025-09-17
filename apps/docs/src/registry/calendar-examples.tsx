"use client";

import { Calendar } from "@sickui/core";
import { useState } from "react";

// Default Calendar Example
export function CalendarDefault() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Calendar
      className="border shadow-sm"
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
    />
  );
}

export const CalendarDefaultCode = `"use client";

import { useState } from "react";
import { Calendar } from "@sickui/core";

export function CalendarDefault() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Calendar 
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
    />
  );
}`;

// Styling Examples
export function CalendarVariants() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default (No Border)</p>
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">With Border</p>
        <Calendar
          className="border-border border"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">With Shadow</p>
        <Calendar
          className="shadow-lg"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Custom Styling</p>
        <Calendar
          className="border-primary rounded-xl border-2 shadow-md"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  );
}

export const CalendarVariantsCode = `"use client";

import { useState } from "react";
import { Calendar } from "@sickui/core";

export function CalendarVariants() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default (No Border)</p>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">With Border</p>
        <Calendar
          className="border border-border"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">With Shadow</p>
        <Calendar
          className="shadow-lg"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Custom Styling</p>
        <Calendar
          className="border-2 border-primary rounded-xl shadow-md"
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  );
}`;

// Disabled State Example
export function CalendarDisabled() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Interactive</p>
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled</p>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          disabled
        />
      </div>
    </div>
  );
}

export const CalendarDisabledCode = `"use client";

import { useState } from "react";
import { Calendar } from "@sickui/core";

export function CalendarDisabled() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Interactive</p>
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled</p>
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          disabled
        />
      </div>
    </div>
  );
}`;

// No Animation Example
export function CalendarNoAnimation() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">With Animation</p>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          showAnimation={true}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">No Animation</p>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          showAnimation={false}
        />
      </div>
    </div>
  );
}

export const CalendarNoAnimationCode = `"use client";

import { useState } from "react";
import { Calendar } from "@sickui/core";

export function CalendarNoAnimation() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">With Animation</p>
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          showAnimation={true}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">No Animation</p>
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          showAnimation={false}
        />
      </div>
    </div>
  );
}`;
