import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getContacts(page, perPage) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [contacts, contactsCount] = await Promise.all([
    ContactsCollection.find().skip(skip).limit(limit).exec(),
    ContactsCollection.countDocuments(),
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
