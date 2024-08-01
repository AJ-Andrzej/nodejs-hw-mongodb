import { Router, json } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = Router();
const jsonParser = json();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', jsonParser, ctrlWrapper(createContactController));
router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchContactController),
);
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
export default router;
