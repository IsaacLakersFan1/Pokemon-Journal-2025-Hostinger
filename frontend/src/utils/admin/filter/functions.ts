import {  HandleItemIdClickProps, HandleSelectAllItemsProps, IsAllSelectedProps, HandleItemStringClickProps, HandleItemBooleanClickProps, HandleSelectAllBooleanItemsProps, HandleSelectAllStringItemsProps, IsAllBooleanSelectedProps, IsAllStringSelectedProps, HandleItemNumberClickProps, HandleSelectAllNumberItemsProps, IsAllNumberSelectedProps } from './interfaces';

export const handleItemIdClick = (props: HandleItemIdClickProps) => {
    const { itemId, checked, selectedItems, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...selectedItems, itemId]);
  } else {
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
  }
};

export const handleSelectAllItems = (props: HandleSelectAllItemsProps) => {
  const { checked, items, setSelectedItems } = props;
  if (checked) {
    const allItemIds = items.map((item) => item.id);
    setSelectedItems(allItemIds);
  } else {
    setSelectedItems([]);
  }
};

export const isAllSelected = (props: IsAllSelectedProps) => {
  const { items, selectedItems } = props;
  return items.length > 0 && selectedItems.length === items.length;
};

export const handleItemStringClick = (props: HandleItemStringClickProps) => {
  const { item, checked, selectedItems, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...selectedItems, item]);
  } else {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  }
};

export const handleItemBooleanClick = (props: HandleItemBooleanClickProps) => {
  const { item, checked, selectedItems, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...selectedItems, item]);
  } else {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  }
};

export const handleSelectAllBooleanItems = (props: HandleSelectAllBooleanItemsProps) => {
  const { checked, items, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...items]);
  } else {
    setSelectedItems([]);
  }
};

export const handleSelectAllStringItems = (props: HandleSelectAllStringItemsProps) => {
  const { checked, items, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...items]);
  } else {
    setSelectedItems([]);
  }
};

export const isAllBooleanSelected = (props: IsAllBooleanSelectedProps) => {
  const { items, selectedItems } = props;
  return items.length > 0 && selectedItems.length === items.length;
};

export const isAllStringSelected = (props: IsAllStringSelectedProps) => {
  const { items, selectedItems } = props;
  return items.length > 0 && selectedItems.length === items.length;
};



export const handleItemNumberClick = (props: HandleItemNumberClickProps) => {
  const { item, checked, selectedItems, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...selectedItems, item]);
  } else {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  }
};

export const handleSelectAllNumberItems = (props: HandleSelectAllNumberItemsProps) => {
  const { checked, items, setSelectedItems } = props;
  if (checked) {
    setSelectedItems([...items]);
  } else {
    setSelectedItems([]);
  }
};

export const isAllNumberSelected = (props: IsAllNumberSelectedProps) => {
  const { items, selectedItems } = props;
  return items.length > 0 && selectedItems.length === items.length;
};
