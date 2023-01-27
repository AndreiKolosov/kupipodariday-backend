import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class TransformWishOwnerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((wishesData: Wish | Wish[] | undefined) => {
        if (wishesData === undefined) return;

        if (Array.isArray(wishesData)) {
          for (const wish of wishesData) {
            delete wish.owner.email;
            delete wish.owner.password;
          }
        } else {
          delete wishesData.owner.email;
          delete wishesData.owner.password;
        }
        return wishesData;
      }),
    );
  }
}
