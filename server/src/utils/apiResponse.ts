import type { Response } from "express";

type ApiData = Record<string, unknown>;

export class ApiResponse<T extends ApiData = ApiData> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data?: T,
  ) {}

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: true,
      message: this.message,
      ...(this.data ?? {}),
    });
  }
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: false,
      message: this.message,
    });
  }
}