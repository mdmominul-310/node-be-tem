/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../../config';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/ApiError';

import { ZodError } from 'zod';
import handleZodValidationError from '../../errors/handleZodValidationError';
import handleCastError from '../../errors/handleCastError';
import logger from '../../helpers/logger';

type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
// global error handler
const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === 'development'
    ? console.log(`global error handler~~~`, error)
    : logger.error(`global error handler~~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simpliFiedError = handleValidationError(error);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorMessages = simpliFiedError?.errorMessages;
  } else if (error?.name === 'CastError') {
    const simpliFiedError = handleCastError(error);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorMessages = simpliFiedError?.errorMessages;
  } else if (error instanceof ZodError) {
    const zodError = handleZodValidationError(error);
    statusCode = zodError?.statusCode;
    message = zodError?.message;
    errorMessages = zodError?.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
        {
          path: '',
          message: error?.message,
        },
      ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
        {
          path: '',
          message: error?.message,
        },
      ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error.stack : undefined,
  });
};

export default globalErrorHandler;










/**
 import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';
import { ZodError } from 'zod';
import { NODE_ENV } from '../config/siteEnv';
import AppError from './AppError';
import handleCastError from './handleCastError';
import handleMongoServerError from './handleMongoServerError';
import handleValidationError from './handleValidationError';
import handleYupError from './handleYupError';
import handleZodError from './handleZodError';

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // console.log('error from global error-handler:_ ', error);
  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof ValidationError) {
    const simplifiedError = handleYupError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages.map(error => ({
      path: error.path ?? '',
      message: error.message,
    }));
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'MongoServerError') {
    const simplifiedError = handleMongoServerError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: NODE_ENV === 'development' ? error?.stack : undefined,
  });

  next(new AppError(message, statusCode));
};


*/
