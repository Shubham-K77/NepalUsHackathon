import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || "";

export const vapi = new Vapi(publicKey);

export function assertVapiPublicKey() {
  if (!publicKey) {
    throw new Error("VITE_VAPI_PUBLIC_KEY is missing");
  }
}
