export interface FilterSectionProps {
    title: string;
    items: Array<{
      id: number;
      name: string;
    }>;
    selectedItems: number[];
    onSelectAll: (checked: boolean) => void;
    onItemSelect: (itemId: number, checked: boolean) => void;
    isAllSelected: boolean;
  }
  
  export interface BooleanFilterProps {
    title: string;
    items: Array<{
      value: boolean;
      label: string;
    }>;
    selectedItems: boolean[];
    onSelectAll: (checked: boolean) => void;
    onItemSelect: (value: boolean, checked: boolean) => void;
    isAllSelected: boolean;
  }
  
  export interface StringFilterProps {
    title: string;
    items: Array<{
      value: string;
      label: string;
    }>;
    selectedItems: string[];
    onSelectAll: (checked: boolean) => void;
    onItemSelect: (value: string, checked: boolean) => void;
    isAllSelected: boolean;
  }
  
  export interface NumberFilterProps {
    title: string;
    items: Array<{
      value: number;
      label: string;
    }>;
    selectedItems: number[];
    onSelectAll: (checked: boolean) => void;
    onItemSelect: (value: number, checked: boolean) => void;
    isAllSelected: boolean;
  }
  
  export interface FilterLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    onApply: () => void;
    isMultiFilter?: boolean;
  }
  
  export interface FilterSidebarProps {
    options: Array<{
      id: string;
      label: string;
    }>;
    activeFilter: string;
    onFilterChange: (filterId: string) => void;
  }
  