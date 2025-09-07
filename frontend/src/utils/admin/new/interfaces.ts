export interface GetAllItemsToSelectProps {
    value: string;
    getAllItems: (value: string) => Promise<void>;
    minLength?: number;
}

export interface HandleSelectItemProps {
    item: any;
    currentValue: string;
    setValue: (value: string) => void;
    setOpen: (open: boolean) => void;
    setId: (id: number) => void;
    displayValue?: string;
}
