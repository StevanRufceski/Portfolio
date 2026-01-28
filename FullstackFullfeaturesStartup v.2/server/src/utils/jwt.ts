import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, config.ACCESS_SECRET, { expiresIn: config.ACCESS_EXPIRES });

export const signRefreshToken = (payload: { id: string; role?: string }) =>
  jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: config.REFRESH_EXPIRES });

export const verifyAccess = (token: string) =>
  jwt.verify(token, config.ACCESS_SECRET);

export const verifyRefresh = (token: string) =>
  jwt.verify(token, config.REFRESH_SECRET) as { id: string; role?: string; iat: number; exp: number };
