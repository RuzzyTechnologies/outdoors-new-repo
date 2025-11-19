export class throwAppError extends Error {
  status_code: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.status_code = statusCode;
  }
}

export class BadRequest extends throwAppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class Unauthorized extends throwAppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFound extends throwAppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class Conflict extends throwAppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends throwAppError {
  constructor(message: string) {
    super(message, 500);
  }
}
