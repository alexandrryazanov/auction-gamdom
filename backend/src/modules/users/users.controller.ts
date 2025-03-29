import { ExpressController } from "@/types/controller";
import { Request, Response, Router } from "express";
import { UsersService } from "@/modules/users/users.service";

export class UsersController implements ExpressController {
  public path = "/users";
  private router: Router = Router();

  getRouter(): Router {
    return this.router;
  }

  constructor(private readonly usersService: UsersService) {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getAll);
  }

  getAll = async (request: Request, response: Response) => {
    const result = await this.usersService.getAll();
    response.send(result);
  };
}
