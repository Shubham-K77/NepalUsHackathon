import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || "";

let vapiSingleton: any | null = null;

function resolveVapiConstructor() {
  const maybeModule: any = Vapi as any;
  return maybeModule?.default ?? maybeModule;
}

export function getVapi() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!vapiSingleton) {
    const VapiConstructor = resolveVapiConstructor();
    if (typeof VapiConstructor !== "function") {
      throw new Error("Vapi SDK could not be initialized");
    }
    vapiSingleton = new VapiConstructor(publicKey);
  }

  return vapiSingleton;
}

export function assertVapiPublicKey() {
  if (!publicKey) {
    throw new Error("VITE_VAPI_PUBLIC_KEY is missing");
  }
}
