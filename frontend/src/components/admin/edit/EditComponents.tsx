import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditTextInputProps, EditSelectInputProps, EditCheckboxInputProps, EditHardcodedSelectProps } from "./interfaces";
import { CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";
import { CommandEmpty } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function EditTextInput(props: EditTextInputProps) {
  const { id, label, placeholder, onChange, defaultValue } = props;
  
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="col-span-3"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function EditSelectInput(props: EditSelectInputProps) {
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
    getItemName
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
            className={`w-[320px] justify-between ${value ? "" : "text-gray-500 font-normal"}`}
          >
            {value || placeholder}
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
                    value={getItemName(item)}
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

export function EditCheckboxInput(props: EditCheckboxInputProps) {
  const { id, label, defaultValue, onCheckedChange } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          defaultChecked={defaultValue}
          onCheckedChange={(checked) => onCheckedChange(checked === true)}
        />
        <Label htmlFor={id} className="cursor-pointer">
          {defaultValue ? "Sí" : "No"}
        </Label>
      </div>
    </div>
  );
}

export function EditHardcodedSelect(props: EditHardcodedSelectProps) {
  const { id, label, defaultValue, onValueChange, options } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Selecciona un método" />
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
