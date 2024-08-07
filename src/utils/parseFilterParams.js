function parseContactType(contactType) {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isContactType(contactType)) return contactType;
}
function parseBoolean(isFavourite) {
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return undefined;
}
export function parseFilterParams(query) {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
}
