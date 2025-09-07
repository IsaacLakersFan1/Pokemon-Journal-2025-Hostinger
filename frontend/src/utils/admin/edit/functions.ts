import { GetAllItemsToSelectProps, HandleSelectItemProps, CheckAndAddItemProps } from "./interfaces";

export const getAllItemsToSelect = async (props: GetAllItemsToSelectProps) => {
  const { value, getAllItems, minLength } = props;

  if (!minLength) {
    await getAllItems(value);
    return;
  }
  if (value.length > minLength) {
    await getAllItems(value);
  }
};

export const handleSelectItem = (props: HandleSelectItemProps) => {
  const { item, currentValue, setValue, setOpen, setId, displayValue = item.name } = props;

  setValue(displayValue === currentValue ? "" : displayValue);
  setOpen(false);
  setId(item.id);
};

export const checkAndAddItem = (props: CheckAndAddItemProps) => {
    const { items, itemId, itemToAdd, setItems } = props;

    if (!items.some((item) => item.id === itemId)) {
        setItems((prev) => {
            if (prev.some((i) => i.id === itemToAdd.id)) return prev;
            return [...prev, itemToAdd];
        });
    }
};

