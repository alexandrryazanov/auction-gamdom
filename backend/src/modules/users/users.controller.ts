import { ExpressController } from "@/types/controller";
import { Request, Response, Router } from "express";
import { UsersService } from "@/modules/users/users.service";
import authMiddleware from "@/middlewares/authMiddleware";

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
    this.router.get("/me", authMiddleware, this.getMe);
  }

  getMe = async (request: Request, response: Response) => {
    const { userId } = request as Request & { userId: number };
    const result = await this.usersService.getById(userId);
    response.send(result);
  };
}
