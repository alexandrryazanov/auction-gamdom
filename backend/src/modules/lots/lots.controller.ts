import { ExpressController } from "@/types/controller";
import { Request, Response, Router } from "express";
import { LotsService } from "@/modules/lots/lots.service";
import { validateMiddleware } from "@/middlewares/validateMiddleware";
import {
  LotCreateDto,
  lotCreateSchema,
} from "@/modules/lots/dto/lot-create.dto";
import {
  LotGetAllDto,
  lotGetAllSchema,
} from "@/modules/lots/dto/lot-get-all.dto";
import { lotGetOneSchema } from "@/modules/lots/dto/lot-get-one.dto";
import {
  LotUpdateDto,
  lotUpdateSchema,
} from "@/modules/lots/dto/lot-update.dto";

export class LotsController implements ExpressController {
  public path = "/lots";
  private router: Router = Router();

  getRouter(): Router {
    return this.router;
  }

  constructor(private readonly lotsService: LotsService) {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: lotGetAllSchema }),
      this.getAll,
    );
    this.router.get(
      "/:id",
      validateMiddleware({ params: lotGetOneSchema }),
      this.getById,
    );
    this.router.post(
      "/",
      validateMiddleware({ body: lotCreateSchema }),
      this.create,
    );
    this.router.patch(
      "/:id",
      validateMiddleware({ params: lotGetOneSchema, body: lotUpdateSchema }),
      this.updateById,
    );
    this.router.delete(
      "/:id",
      validateMiddleware({ params: lotGetOneSchema }),
      this.deleteById,
    );
  }

  getAll = async (request: Request, response: Response) => {
    const dto = request.query as LotGetAllDto;
    const result = await this.lotsService.getAll(dto);
    response.send(result);
  };

  getById = async (request: Request, response: Response) => {
    const result = await this.lotsService.getById(+request.params.id);
    response.send(result);
  };

  create = async (request: Request, response: Response) => {
    const dto = request.body as LotCreateDto;
    const result = await this.lotsService.create(dto);
    response.send(result);
  };

  updateById = async (request: Request, response: Response) => {
    const dto = request.body as LotUpdateDto;
    const result = await this.lotsService.updateById(+request.params.id, dto);
    response.send(result);
  };

  deleteById = async (request: Request, response: Response) => {
    const result = await this.lotsService.deleteById(+request.params.id);
    response.send(result);
  };
}
