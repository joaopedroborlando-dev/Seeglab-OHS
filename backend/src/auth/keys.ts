import "dotenv/config";
import fs from "fs";
import path from "path";

const loadKey = (envVar: string, fileName: string): string => {
  const fromEnv = process.env[envVar];
  if (fromEnv) return fromEnv.replace(/\\n/g, "\n");
  return fs.readFileSync(path.join(__dirname, "keys", fileName), "utf8");
};

export const privateKey = loadKey("JWT_PRIVATE_KEY", "private.key");
export const publicKey = loadKey("JWT_PUBLIC_KEY", "public.key");
