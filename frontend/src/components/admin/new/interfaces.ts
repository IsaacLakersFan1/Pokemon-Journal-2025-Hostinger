export interface NewTextInputProps {
    id: string;
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
    value?: string;
  }
  
  export interface NewSelectInputProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    items: any[];
    onValueChange: (value: string) => void;
    onSelect: (item: any) => void;
    getItemName: (item: any) => string;
    getItemSearchText?: (item: any) => string;
  }
  
  export interface NewCheckboxInputProps {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }
  
  export interface NewHardcodedSelectProps {
    id: string;
    label: string;
    // value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }
  
  export interface NewDateInputProps {
    id: string;
    label: string;
    value?: Date;
    onValueChange: (date: Date | undefined) => void;
    placeholder?: string;
  }
  