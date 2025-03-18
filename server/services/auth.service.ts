import { hash, compare, create, verify, decode } from "../deps.ts";
import { User } from "../models/user.model.ts";
import DatabaseSingleton from "./mongo.service.ts";

const tokenCache = new Map<string, { email: string, expiration: number | undefined}>();

async function getJwtKey() {
  const enc = new TextEncoder().encode("27ef50f295163e3cf19888d87b77ee1b43bf7ec2cd6a4937c8f9034b37c09663fcfde42c1f6b52e3cca54ec653309b36e21c2668e55879de23546b7820cfb0257efd78ad5c1ef877140bce135e40fc8e82bde51d2197b8e6b7e0e59ad081c084d73ed3f5a2c904f09f27aae7be073101e7336f8787a230f17b02161991b966988aadbd1a43d8d4b24b6056b8eaebb8e854c7e11119d87982c98db20ea6b74b3d972e937c74b539d7c2771ce8c0c36df28d13c6118a17f521c5734c038aa82e63e4b0e347e4fd1541000cfa8ab0031d8abfcef937efef4a83ba5a08c6897701afc777b5d10f9e11efe477c9cf594b753e0e837bb4d4c2e8de5e51ca4525551d26");
  return await crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-512" }, false, ["sign", "verify"]);
}

export async function register(email: string, password: string) {
  const db = await DatabaseSingleton.getInstance();
  const users = db.collection<User>("users");

  const hashedPassword = await hash(password);
  const newUser: User = { email, password: hashedPassword };

  await users.insertOne(newUser);
  return { message: "User registered" };
}

export async function login(email: string, password: string) {
  const db = await DatabaseSingleton.getInstance();
  const users = db.collection<User>("users");

  const user: User | undefined = await users.findOne({ email });
  if (!user || !(await compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const key = await getJwtKey();
  const exp = Math.floor(Date.now() / 1000) + 3600;

  const jwt = await create(
    { alg: "HS512", typ: "JWT" }, // Header
    { sub: user._id?.toString(), email: user.email, exp: exp }, // Subject (User ID)
    key
  );

  tokenCache.set(jwt, { expiration: exp, email: user.email });

  return { token: jwt, expiresAt: exp };
}

export async function verifyToken(token: string) {
  const key = await getJwtKey();
  const vToken = cachedToken(token);
  if (vToken) {
    return vToken;
  }
  
  try {
    const payload = await verify(token, key);
    if (!payload.email) {
      throw new Error("Email missing in JWT payload");
    }
    tokenCache.set(token, { email: payload.email, expiration: payload.exp });
    return payload;
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error);
    return null;
  }
}

export function cachedToken(token: string) {
  const cached = tokenCache.get(token);

  if (cached) {
    const now = Math.floor(Date.now() / 1000);
    if ((cached.expiration || 0) > now) {
      return { email: cached.email, exp: cached.expiration };
    } else {
      tokenCache.delete(token);
      return false;
    }
  }
}