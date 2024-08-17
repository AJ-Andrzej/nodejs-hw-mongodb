import createHttpError from 'http-errors';
import * as ContactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export async function getContactsController(req, res, next) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await ContactsService.getContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  );
  if (!contacts) {
    return next(createHttpError(400, 'Bad Request'));
  }

  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await ContactsService.getContactByID(contactId, userId);

  if (contact === null) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}

export async function createContactController(req, res, next) {
  const photo = req.file;
  let photoUrl;

  if (env('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const newContact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
    photo: photoUrl,
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
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;

  if (env('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const updatedContact = await ContactsService.updateContact(
    contactId,
    {
      ...req.body,
      photo: photoUrl,
    },
    userId,
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
  const userId = req.user._id;
  const deletedContact = await ContactsService.deleteContact(contactId, userId);

  if (deletedContact === null) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).end();
}
