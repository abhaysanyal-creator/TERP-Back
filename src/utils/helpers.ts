import jwt, { type SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  [key: string]: any;
}

export const generateToken = (
  payload: TokenPayload,
  secret: string,
  expiresInSecs: number
): string => {
  const options: SignOptions = { expiresIn: expiresInSecs };
  return jwt.sign(payload, secret, options);
};
