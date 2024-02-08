// custom error
// 错误拦截器

import { getResult } from "./apiHandler";

/**
 * 业务处理错误基类
 */
class ServiceError extends Error {
  /**
   * @param message 错误信息
   * @param code 错误码
   */
  constructor(message: string, public code: number) {
    super(message);
  }

  toResponseJSON() {
    return getResult({
      code: this.code,
      msg: this.message,
      data: null
    });
  }
}

// throw new ServiceError("aaa", 1);
// 文件上传错误
export class UploadError extends ServiceError {
  constructor(message) {
    super(message, 413);
  }
}

// 禁止访问错误
export class ForbiddenError extends ServiceError {
  constructor(message) {
    super(message, 401);
  }
}

// 验证错误
export class ValidationError extends ServiceError {
  constructor(message) {
    super(message, 406);
  }
}
// 无资源错误
export class NotFoundError extends ServiceError {
  constructor(message) {
    super("not found ", 406);
  }
}
// 未知错误
export class UnknownError extends ServiceError {
  constructor(message) {
    super("server interval error ", 500);
  }
}

export default ServiceError;
