import { CLEAR_FLASH } from "./types";

export const clearFlash = () => {
  return { type: CLEAR_FLASH, payload: null };
};
