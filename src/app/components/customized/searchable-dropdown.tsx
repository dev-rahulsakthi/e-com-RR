"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/src/app/lib/utils";
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,} from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

type Option = {
  value: string | number;
  label: string;
};

interface SearchableDropdownProps {
  options: Option[];
  value: string | number | null;
  onChange: (val: string | number) => void;
  placeholder?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "-- Select --",
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger styled like input */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
            "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "flex items-center justify-between"
          )}
        >
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground item-center">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>

      {/* Dropdown content - Fixed with proper positioning and styling */}
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-white shadow-md border rounded-md mt-1 z-50"
        sideOffset={5}
        align="start"
        style={{
          // This ensures the popover appears above other elements
          zIndex: 50,
        }}
      >
        <Command className="rounded-lg border shadow-md">
          {/* Search input styled same as Input */}
          <div className="px-2 pt-2">
            <CommandInput
              placeholder="Search..."
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
                "border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
                "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              )}
            />
          </div>
          <CommandEmpty className="py-3 px-2 text-sm text-muted-foreground text-center">
            No results found.
          </CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto p-1">
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.label}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-md hover:bg-gray-100"
              >
                {opt.label}
                {value === opt.value && <Check className="h-4 w-4 text-blue-500" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}