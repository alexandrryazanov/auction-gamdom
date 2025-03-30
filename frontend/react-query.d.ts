import "@tanstack/react-query";
import { GeneralError } from "@/api/types/errors";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: GeneralError;
  }
}
