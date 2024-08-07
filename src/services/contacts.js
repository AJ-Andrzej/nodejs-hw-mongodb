import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getContacts(page, perPage, sortBy, sortOrder, filter) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactsQuery = ContactsCollection.find();
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery),
    contactsQuery
      .find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
}

export function getContactByID(contactId) {
  return ContactsCollection.findById(contactId);
}

export function createContact(contact) {
  return ContactsCollection.create(contact);
}

export function updateContact(contactId, data, options = {}) {
  return ContactsCollection.findByIdAndUpdate(contactId, data, { new: true });
}
export function deleteContact(contactId) {
  return ContactsCollection.findByIdAndDelete(contactId);
}
