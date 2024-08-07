import { SORT_ORDER } from '../constants/index.js';

function parseSortOrder(sortOrder) {
  if (sortOrder === undefined) return SORT_ORDER.ASC;
  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder.toLowerCase()))
    return sortOrder.toLowerCase();
  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy) {
  const keysOfStudent = ['_id', 'name', 'createdAt'];

  if (keysOfStudent.includes(sortBy)) {
    return sortBy;
  }
  return 'name';
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;
  const parsedSortOrder = parseSortOrder(sortOrder);

  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
}
