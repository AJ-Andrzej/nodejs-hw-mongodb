import path from 'node:path';
import fs from 'node:fs/promises';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { TEMPLATES_DIR, SMTP } from '../constants/index.js';

export async function registerUser(user) {
  const emailCheck = await UsersCollection.findOne({ email: user.email });
  if (emailCheck !== null) {
    throw createHttpError(409, 'Email in use');
  }
  user.password = await bcrypt.hash(user.password, 10);
  return UsersCollection.create(user);
}

export async function loginUser(email, password) {
  const maybeUser = await UsersCollection.findOne({ email });
  if (maybeUser === null) {
    throw createHttpError(401, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);
  if (!isMatch) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionsCollection.deleteOne({ userId: maybeUser._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: maybeUser._id,
    ...newSession,
  });
}

export async function refreshUsersSession(sessionId, refreshToken) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
}

export function logoutUser(sessionId) {
  return SessionsCollection.deleteOne({ _id: sessionId });
}

export async function requestResetToken(email) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = await fs.readFile(resetPasswordTemplatePath, {
    encoding: 'utf-8',
  });

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: SMTP.FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    throw err;
  }
}

export async function resetPassword(password, token) {
  let decoded;

  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });

  if (user === null) {
    throw createHttpError(401, 'User not found');
  }

  const newPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findByIdAndUpdate(user._id, { password: newPassword });
}
