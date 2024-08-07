function parsedNumber(number, defaultValue) {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultValue;
  if (parsedNumber <= 0) return defaultValue;

  return parsedNumber;
}

export function parsePaginationParams(query) {
  const { page, perPage } = query;
  const parsedPage = parsedNumber(page, 1);
  const parsedPerPage = parsedNumber(perPage, 10);

  return { page: parsedPage, perPage: parsedPerPage };
}
