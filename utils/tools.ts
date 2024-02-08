import { verify } from "jsonwebtoken";
import { md5 } from "./crypto";

export function parseToken(token: string | undefined) {
  if (!token) {
    // 没有token
    return null;
  }
  // authorization: bearer token
  const parts = token.split(" ");
  if (parts.length > 0) {
    token = parts.length === 1 ? parts[0] : parts[1];
  }
  // }
  try {
    const result = verify(token, md5(process.env.JWT_SECRECT!));
    return result;
  } catch (error) {
    // logger.log(error);
    return null;
  }
}
