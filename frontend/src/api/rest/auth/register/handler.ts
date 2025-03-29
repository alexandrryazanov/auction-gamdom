import { RegisterDto } from "./types";
import { baseApiClient } from "@/api/instances/base";
import { REGISTER_PATH } from "./constants";

export async function register(dto: RegisterDto) {
  const res = await baseApiClient.post(REGISTER_PATH, dto);
  return res.data;
}
