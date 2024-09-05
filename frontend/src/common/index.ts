export * from "./request";

export async function createHash(inputString) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
