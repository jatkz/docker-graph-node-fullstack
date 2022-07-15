import { assert } from "chai";

function isException(error: any) {
  let strError = error.toString();
  return (
    strError.includes("Invalid JSON RPC") ||
    strError.includes("VM Exception") ||
    strError.includes("invalid opcode") ||
    strError.includes("invalid JUMP")
  );
}

export function ensureException(error: any) {
  assert(isException(error), error.toString());
}
