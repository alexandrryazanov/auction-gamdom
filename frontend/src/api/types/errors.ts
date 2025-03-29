// standard error from backend
export type ServerErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

// custom class to handle any error for API
export class GeneralError extends Error {
  status: number;
  details: string;
  message: string;

  constructor(e?: string | ServerErrorResponse) {
    if (typeof e === "string") {
      super(e);
      this.status = 500;
      this.message = e;
      this.details = e;
    } else {
      super(e?.error || "Unknown error");
      this.status = e?.statusCode || 500;
      this.message = e?.error || "Unknown error";
      this.details = e?.message || "Something went wrong";
    }
  }
}
