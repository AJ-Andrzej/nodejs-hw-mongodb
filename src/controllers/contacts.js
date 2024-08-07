import createHttpError from 'http-errors';
import * as ContactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const contacts = await ContactsService.getContacts(page, perPage);
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

export async function createContactController(req, res, next) {
  const newContact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const createdContact = await ContactsService.createContact(newContact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
}

export async function patchContactController(req, res, next) {
  const { contactId } = req.params;
  const updatedContact = await ContactsService.updateContact(
    contactId,
    req.body,
  );
  if (!updatedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const deletedContact = await ContactsService.deleteContact(contactId);

  if (!deletedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).end();
}
