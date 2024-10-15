"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CURRENCY_ID } from "@/lib/currencies";

const currencies = Object.entries(CURRENCY_ID).map(([key, value]) => ({
  value: value,
  label: value,
}));

interface CurrencyComboboxProps {
  register: UseFormRegister<any>;
  name: string;
  className?: string;
}

export function CurrencyCombobox({
  register,
  name,
  className,
}: CurrencyComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>(
    []
  );

  const { onChange, ...rest } = register(name);

  const handleSelect = (currentValue: string) => {
    const updatedSelection = selectedCurrencies.includes(currentValue)
      ? selectedCurrencies.filter((item) => item !== currentValue)
      : [...selectedCurrencies, currentValue];

    setSelectedCurrencies(updatedSelection);
    onChange({ target: { name, value: updatedSelection } });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between", className)}
        >
          {selectedCurrencies.length > 0
            ? `${selectedCurrencies.length} selected`
            : "Select currencies..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search currencies..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCurrencies.includes(currency.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <input type="hidden" {...rest} value={selectedCurrencies.join(",")} />
    </Popover>
  );
}
