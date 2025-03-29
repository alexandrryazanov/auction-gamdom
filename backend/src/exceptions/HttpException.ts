export class HttpException extends Error {
  status: number;
  message: string;
  details: string;

  constructor(status: number, message: string, details: string = "") {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

export class NotFoundException extends HttpException {
  constructor(itemName: string, id: string | number, fieldName = "id") {
    super(404, "Not found", `${itemName} with ${fieldName} ${id} not found`);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, details: string = "Something went wrong") {
    super(400, message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(details: string) {
    super(401, `Unauthorized`, details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(details: string) {
    super(403, `Forbidden`, details);
  }
}

export class ConflictException extends HttpException {
  constructor(details: string) {
    super(409, `Conflict`, details);
  }
}

export class AxiosException extends HttpException {
  constructor(details: string) {
    super(500, "Axios exception", details);
  }
}
