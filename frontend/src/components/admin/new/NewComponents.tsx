import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NewTextInputProps,
  NewSelectInputProps,
  NewCheckboxInputProps,
  NewHardcodedSelectProps,
  NewDateInputProps,
} from "./interfaces";
import { CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";
import { CommandEmpty } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function NewTextInput(props: NewTextInputProps) {
  const { id, label, placeholder, onChange, value } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        className="col-span-3"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
}

export function NewSelectInput(props: NewSelectInputProps) {
  const {
    id,
    label,
    placeholder,
    value,
    open,
    setOpen,
    items,
    onValueChange,
    onSelect,
    getItemName,
    getItemSearchText,
  } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[320px] justify-between ${
              value ? "" : "text-gray-500 font-normal"
            }`}
          >
            {value
              ? (() => {
                  const selectedItem = items.find(
                    (item) => getItemName(item) === value
                  );
                  return selectedItem ? getItemName(selectedItem) : placeholder;
                })()
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0 text-gray-100">
          <Command>
            <CommandInput
              placeholder={placeholder}
              onValueChange={onValueChange}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={getItemName(item)}
                    value={
                      getItemSearchText
                        ? getItemSearchText(item)
                        : getItemName(item)
                    }
                    onSelect={() => onSelect(item)}
                  >
                    {getItemName(item)}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === getItemName(item)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function NewCheckboxInput(props: NewCheckboxInputProps) {
  const { id, label, checked, onCheckedChange } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked === true)}
        />
        <Label htmlFor={id} className="cursor-pointer">
          {checked ? "Sí" : "No"}
        </Label>
      </div>
    </div>
  );
}

export function NewHardcodedSelect(props: NewHardcodedSelectProps) {
  const { id, label, onValueChange, options, placeholder } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function NewDateInput(props: NewDateInputProps) {
  const {
    id,
    label,
    value,
    onValueChange,
    placeholder = "Selecciona una fecha",
  } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(value, "PPP HH:mm") : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onValueChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
