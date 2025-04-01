import { ExpressController } from "@/types/controller";
import { Request, Response, Router } from "express";
import { UsersService } from "@/modules/users/users.service";
import authMiddleware from "@/middlewares/authMiddleware";

export class UsersController implements ExpressController {
  private _path = "/users";
  private _router: Router = Router();

  get path(): string {
    return this._path;
  }

  get router(): Router {
    return this._router;
  }

  constructor(private readonly usersService: UsersService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/me", authMiddleware, this.getMe);
  }

  private getMe = async (request: Request, response: Response) => {
    const { userId } = request as Request & { userId: number };
    const result = await this.usersService.getById(userId);
    response.send(result);
  };
}
