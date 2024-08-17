import { Router, json } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';
import { contactSchema, updatecontactSchema } from '../validation/students.js';

const router = Router();
const jsonParser = json();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post(
  '/contacts',
  upload.single('photo'),
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  upload.single('photo'),
  jsonParser,
  validateBody(updatecontactSchema),
  ctrlWrapper(patchContactController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);
export default router;
