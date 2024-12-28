interface ApiErrorDetail {
  message: string;
  code?: string;
  field?: string;
  details?: string;
}

class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: ApiErrorDetail[];
  stack?: string;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: ApiErrorDetail[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
