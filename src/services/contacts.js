import { ContactsCollection } from '../db/models/contact.js';

export function getContacts() {
  return ContactsCollection.find();
}

export function getContactByID(contactId) {
  return ContactsCollection.findById(contactId);
}
