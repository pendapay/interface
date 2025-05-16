import { hashMessage, type Address } from "viem";

export const PROFILE_ADDRESS: Address = "0x8739E0930cCFC7055D26F7f5EF8ebCb0e12337ca"
export const MAGIC_PAY_ADDRESS: Address = "0x0e47F72a9ebE5ae820d60379fc9a71126ca5a74a"

export const VIEWING_KEY = hashMessage("pendapay-viewing-key");
export const SIGN_IN_MESSAGE = "Sign in to Pendapay. If you sign this message, you will allow this app to view your balance."