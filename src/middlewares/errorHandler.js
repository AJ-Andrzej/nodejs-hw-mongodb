import { HttpError, isHttpError } from 'http-errors';

export function errorHandler(err, _req, res, _next) {
  if (isHttpError) {
    return res
      .status(err.status)
      .send({ status: err.status, message: err.message });
  }
  console.error(err);
  res.status(500).send({ message: 'internal serwer error' });
}
