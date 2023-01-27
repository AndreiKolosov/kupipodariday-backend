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
      map((wishes: Wish[]) => {
        return wishes.map((wish: Wish) => {
          const { id, username, avatar, about, createdAt, updatedAt } =
            wish.owner;
          return {
            ...wish,
            owner: {
              id,
              username,
              avatar,
              about,
              createdAt,
              updatedAt,
            },
          };
        });
      }),
    );
  }
}
