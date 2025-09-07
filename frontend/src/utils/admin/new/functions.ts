import { GetAllItemsToSelectProps, HandleSelectItemProps } from "./interfaces";

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
