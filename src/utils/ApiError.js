class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong.",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error;
    this.stack = stack;
  }
}
