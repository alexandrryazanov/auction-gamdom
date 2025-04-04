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
import authMiddleware from "@/middlewares/authMiddleware";

export class LotsController implements ExpressController {
  private _path = "/lots";
  private _router: Router = Router();

  get path(): string {
    return this._path;
  }

  get router(): Router {
    return this._router;
  }

  constructor(private readonly lotsService: LotsService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: lotGetAllSchema }),
      this.getAll,
    );
    this.router.get(
      "/:id",
      authMiddleware,
      validateMiddleware({ params: lotGetOneSchema }),
      this.getById,
    );

    // TODO: protect by admin middleware
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

  private getAll = async (request: Request, response: Response) => {
    const dto = request.query as LotGetAllDto;
    const result = await this.lotsService.getAll(dto);
    response.send(result);
  };

  private getById = async (request: Request, response: Response) => {
    const result = await this.lotsService.getById(+request.params.id);
    response.send(result);
  };

  private create = async (request: Request, response: Response) => {
    const dto = request.body as LotCreateDto;
    const result = await this.lotsService.create(dto);
    response.send(result);
  };

  private updateById = async (request: Request, response: Response) => {
    const dto = request.body as LotUpdateDto;
    const result = await this.lotsService.updateById(+request.params.id, dto);
    response.send(result);
  };

  private deleteById = async (request: Request, response: Response) => {
    const result = await this.lotsService.deleteById(+request.params.id);
    response.send(result);
  };
}
