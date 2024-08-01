import createHttpError from 'http-errors';
import * as ContactsService from '../services/contacts.js';

export async function getContactsController(req, res) {
  const contacts = await ContactsService.getContacts();
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await ContactsService.getContactByID(contactId);

  if (!contact) {
    return next(createHttpError(404), 'Contact not found');
  }
  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}
