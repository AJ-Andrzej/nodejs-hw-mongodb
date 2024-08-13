import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

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
