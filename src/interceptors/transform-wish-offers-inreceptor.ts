import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class TransformWishOffersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((wish: Wish | undefined) => {
        if (wish === undefined) return;

        for (const offer of wish.offers as Offer[]) {
          delete offer.user.password;
        }

        return wish;
      }),
    );
  }
}
