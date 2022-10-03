import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    AUTH_URL: RegExp[] = [/.+\/draw\/.+\/luckyDraw/gm];

    constructor(private authService: AuthService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.isAuthUrl(req.url)) return next.handle(req);

        return from(this.authService.getUserIdToken()).pipe(
            switchMap((idToken) => {
                if (!idToken) throw new Error('Not authenticated');
                const authReq = req.clone({
                    headers: req.headers.set(
                        'Authorization',
                        `Bearer ${idToken}`
                    ),
                });
                return next.handle(authReq);
            })
        );
    }

    isAuthUrl(url: string): boolean {
        for (const authUrl of this.AUTH_URL) {
            if (authUrl.test(url)) {
                authUrl.lastIndex = 0;
                return true;
            }
            authUrl.lastIndex = 0;
        }
        return false;
    }
}
