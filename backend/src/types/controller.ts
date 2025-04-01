import { Router } from "express";

export interface ExpressController {
  path: string;
  router: Router;
}
