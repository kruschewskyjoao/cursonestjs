import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware antes');
    if (isNaN(Number(req.params.id))) {
      throw new BadRequestException('ID inválido');
    }
    console.log('middleware depois');
    next();
  }
}
