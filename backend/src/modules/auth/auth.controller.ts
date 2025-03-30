import { AuthService } from "@/modules/auth/auth.service";
import { Request, Response, Router } from "express";
import { COOKIE_OPTIONS, EXPIRES_IN } from "@/modules/auth/auth.constants";
import ms from "ms";
import { RegisterDto, registerSchema } from "@/modules/auth/dto/register.dto";
import { validateMiddleware } from "@/middlewares/validateMiddleware";
import { LoginDto, loginSchema } from "@/modules/auth/dto/login.dto";

export class AuthController {
  public path = "/auth";
  private router: Router = Router();

  getRouter(): Router {
    return this.router;
  }

  constructor(private readonly authService: AuthService) {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      "/register",
      validateMiddleware({ body: registerSchema }),
      this.register,
    );
    this.router.post(
      "/login",
      validateMiddleware({ body: loginSchema }),
      this.login,
    );
    this.router.post("/refresh", this.refresh);
    this.router.post("/logout", this.logout);
  }

  register = async (request: Request, response: Response) => {
    const dto = request.body as RegisterDto;
    const result = await this.authService.register(dto);
    response.send(result);
  };

  login = async (request: Request, response: Response) => {
    const dto = request.body as LoginDto;
    const { accessToken, refreshToken } = await this.authService.login(dto);
    response.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    response.send({ accessToken });
  };

  refresh = async (request: Request, response: Response) => {
    const { accessToken, refreshToken } = await this.authService.refresh(
      request.cookies.refreshToken,
    );
    response.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    response.send({ accessToken });
  };

  logout = async (request: Request, response: Response) => {
    response.clearCookie("refreshToken", COOKIE_OPTIONS);
    response.send({});
  };
}
