export interface EditTextInputProps {
    id: string;
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
    // value?: string;
    defaultValue: string;
}

export interface EditSelectInputProps {
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
}

export interface EditCheckboxInputProps {
    id: string;
    label: string;
    defaultValue: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export interface EditHardcodedSelectProps {
    id: string;
    label: string;
    defaultValue: string;
    onValueChange: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
}