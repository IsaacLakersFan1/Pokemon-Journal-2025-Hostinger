export interface FilterItem {
  id: number;
  name: string;
}

export interface HandleItemIdClickProps {
  itemId: number;
  checked: boolean;
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
}

export interface HandleSelectAllItemsProps {
  checked: boolean;
  items: FilterItem[];
//   selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
}

export interface IsAllSelectedProps {
  items: FilterItem[];
  selectedItems: number[];
}

export interface HandleItemStringClickProps {
  item: string;
  checked: boolean;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export interface HandleItemBooleanClickProps {
  item: boolean;
  checked: boolean;
  selectedItems: boolean[];
  setSelectedItems: (items: boolean[]) => void;
}

export interface HandleSelectAllBooleanItemsProps {
  checked: boolean;
  items: boolean[];
  setSelectedItems: (items: boolean[]) => void;
}

export interface HandleSelectAllStringItemsProps {
  checked: boolean;
  items: string[];
  setSelectedItems: (items: string[]) => void;
}

export interface IsAllBooleanSelectedProps {
  items: boolean[];
  selectedItems: boolean[];
}

export interface IsAllStringSelectedProps {
  items: string[];
  selectedItems: string[];
}

export interface HandleItemNumberClickProps {
  item: number;
  checked: boolean;
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
}

export interface HandleSelectAllNumberItemsProps {
  checked: boolean;
  items: number[];
  setSelectedItems: (items: number[]) => void;
}

export interface IsAllNumberSelectedProps {
  items: number[];
  selectedItems: number[];
}