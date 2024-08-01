import { ContactsCollection } from '../db/models/contact.js';

export function getContacts() {
  return ContactsCollection.find();
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
