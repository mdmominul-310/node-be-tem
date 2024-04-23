// custom error class which handler custom error of our project
class ApiError extends Error {
  statusCode: number;

  constructor(status: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
