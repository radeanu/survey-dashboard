import { intersection, isEmpty, xor } from 'lodash';

function filterList(list, filters) {
  return list.filter(row => {
    const passed = filters
      .map(f => {
        const fieldValue = row[f.item.value];

        if (f._exact) {
          const comp = Array.isArray(fieldValue)
            ? isEmpty(xor(fieldValue, f._selectedItems))
            : fieldValue === f._selectedItems;

          return comp;
        } else {
          return Array.isArray(fieldValue)
            ? intersection(fieldValue, f._selectedItems).length > 0
            : f._selectedItems.includes(fieldValue);
        }
      })
      .filter(Boolean);

    return passed.length === filters.length ? row : false;
  });
}

function searchTextInList(text, list) {
  if (text.length) {
    const result = list.filter(v => v.value.includes(text));
    return result.map(v => v._id);
  }

  return false;
}

function switchToNewListItem(list, item, position) {
  const newPosition = item._index + position;

  const newRowIndex = newPosition > 0 && newPosition <= list.length
    ? newPosition
    : item._index;

  const res = list.filter(({ _index }) => _index === newRowIndex)[0];
  return res;
}

export { filterList, searchTextInList, switchToNewListItem };
