import { PaginationMeta } from '../interfaces';

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static fail(message: string): ApiResponse<null> {
    return new ApiResponse(false, message);
  }
}

export class PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;

  constructor(message: string, data: T[], meta: PaginationMeta) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
