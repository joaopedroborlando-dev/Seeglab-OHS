import fs from "fs";
import path from "path";

const privateKeyPath = path.join(__dirname, "keys", "private.key");
const publicKeyPath = path.join(__dirname, "keys", "public.key");

export const privateKey = fs.readFileSync(privateKeyPath, "utf8");
export const publicKey = fs.readFileSync(publicKeyPath, "utf8");
