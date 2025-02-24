import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthUser extends JwtPayload {
  id: string;
}

// Secret keys for signing tokens (you can use different keys)
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
console.log("Loaded ACCESS_TOKEN_SECRET:", JSON.stringify(accessTokenSecret));

if (!accessTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables.");
}
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

if (!refreshTokenSecret) {
  throw new Error("REFRESH_TOKEN_SECRET is not set in environment variables.");
}

/**
 * Generate a JWT token
 */
export function generateAccessToken(payload: object): string {
  console.log("Signing with ACCESS_TOKEN_SECRET:", accessTokenSecret);
  return jwt.sign(payload, accessTokenSecret, {expiresIn: "30s"});
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, accessTokenSecret!) as AuthUser;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
