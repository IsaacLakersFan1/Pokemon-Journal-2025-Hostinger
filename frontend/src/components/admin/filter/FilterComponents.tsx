import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FilterSectionProps, 
  BooleanFilterProps, 
  StringFilterProps,
  NumberFilterProps,
  FilterLayoutProps,
  FilterSidebarProps 
} from "./interfaces";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function FilterSection(props: FilterSectionProps) {
  const {
    title,
    items,
    selectedItems,
    onSelectAll,
    onItemSelect,
    isAllSelected,
  } = props;

  return (
    <div className="flex flex-col gap-2 p-6 justify-center border-b border-gray-400 mx-4">
      <p className="text-xl font-bold mb-4">{title}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2 pb-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
          <Label htmlFor="select-all" className="text-md font-semibold">
            Seleccionar todos
          </Label>
        </div>
        <ScrollArea className="h-[600px] w-full rounded-md border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 mx-4 my-2">
              <Checkbox
                id={item.id.toString()}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) =>
                  onItemSelect(item.id, checked as boolean)
                }
              />
              <Label
                htmlFor={item.id.toString()}
                className="text-md cursor-pointer"
              >
                {item.name}
              </Label>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

export function BooleanFilter(props: BooleanFilterProps) {
  const {
    title,
    items,
    selectedItems,
    onSelectAll,
    onItemSelect,
    isAllSelected,
  } = props;

  return (
    <div className="flex flex-col gap-2 p-6 justify-center border-b border-gray-400 mx-4">
      <p className="text-xl font-bold mb-4">{title}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2 pb-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
          <Label htmlFor="select-all" className="text-md font-semibold">
            Seleccionar todos
          </Label>
        </div>
        {items.map((item) => (
          <div key={item.value.toString()} className="flex items-center space-x-2 pb-2">
            <Checkbox
              id={`checkbox-${item.value}`}
              checked={selectedItems.includes(item.value)}
              onCheckedChange={(checked) =>
                onItemSelect(item.value, checked as boolean)
              }
            />
            <Label htmlFor={`checkbox-${item.value}`} className="text-md font-semibold">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StringFilter(props: StringFilterProps) {
  const {
    title,
    items,
    selectedItems,
    onSelectAll,
    onItemSelect,
    isAllSelected,
  } = props;

  return (
    <div className="flex flex-col gap-2 p-6 justify-center border-b border-gray-400 mx-4">
      <p className="text-xl font-bold mb-4">{title}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2 pb-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
          <Label htmlFor="select-all" className="text-md font-semibold">
            Seleccionar todos
          </Label>
        </div>
        {items.map((item) => (
          <div key={item.value} className="flex items-center space-x-2 pb-2">
            <Checkbox
              id={`checkbox-${item.value}`}
              checked={selectedItems.includes(item.value)}
              onCheckedChange={(checked) =>
                onItemSelect(item.value, checked as boolean)
              }
            />
            <Label htmlFor={`checkbox-${item.value}`} className="text-md font-semibold">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NumberFilter(props: NumberFilterProps) {
  const {
    title,
    items,
    selectedItems,
    onSelectAll,
    onItemSelect,
    isAllSelected,
  } = props;

  return (
    <div className="flex flex-col gap-2 p-6 justify-center border-b border-gray-400 mx-4">
      <p className="text-xl font-bold mb-4">{title}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2 pb-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
          <Label htmlFor="select-all" className="text-md font-semibold">
            Seleccionar todos
          </Label>
        </div>
        {items.map((item) => (
          <div key={item.value} className="flex items-center space-x-2 pb-2">
            <Checkbox
              id={`checkbox-${item.value}`}
              checked={selectedItems.includes(item.value)}
              onCheckedChange={(checked) =>
                onItemSelect(item.value, checked as boolean)
              }
            />
            <Label htmlFor={`checkbox-${item.value}`} className="text-md font-semibold">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilterLayout(props: FilterLayoutProps) {
  const { children, title, description, onApply, isMultiFilter = false } = props;

  return (
    <div className={`h-full ${isMultiFilter ? "w-2/3" : ""}`}>
      <SheetHeader className="px-4 pt-4 pb-2">
        <SheetTitle>{title}</SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {children}
      </ScrollArea>
      <SheetFooter className="px-4 py-3 border-t">
        <Button type="submit" onClick={onApply}>
          Aplicar filtros
        </Button>
      </SheetFooter>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const { options, activeFilter, onFilterChange } = props;

  return (
    <div className="w-1/3 h-full bg-white border-r">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Filtros</h3>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="flex flex-col">
          {options.map(option => (
            <Button
              key={option.id}
              variant={activeFilter === option.id ? "secondary" : "ghost"}
              className="justify-start rounded-none text-left px-4 py-6"
              onClick={() => onFilterChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
