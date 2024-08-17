import * as AuthService from '../services/auth.js';

export async function registerUserController(req, res, next) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await AuthService.registerUser(user);
  res.status(201).send({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
}

export async function loginUserController(req, res, next) {
  const { email, password } = req.body;
  const session = await AuthService.loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res, next) {
  if (typeof req.cookies.sessionId === 'string') {
    await AuthService.logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).end();
}

export async function refreshUserSessionController(req, res, next) {
  const session = await AuthService.refreshUsersSession(
    req.cookies.sessionId,
    req.cookies.refreshToken,
  );

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestResetEmailController(req, res, next) {
  await AuthService.requestResetToken(req.body.email);
  res.send({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
}

export async function resetPasswordController(req, res, next) {
  const { password, token } = req.body;
  await AuthService.resetPassword(password, token);
  res.send({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
}
