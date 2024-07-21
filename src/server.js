import 'dotenv/config';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ContactsCollection } from './db/models/contact.js';

const PORT = Number(env('PORT', '3000'));

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await ContactsCollection.find();
      res.send({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await ContactsCollection.findById(contactId);
      if (contact === null) {
        res.status(404).send({
          message: 'Contact not found',
        });
      }
      res.send({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data: contact,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  });

  app.use((req, res) => {
    res.status(404).send({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
