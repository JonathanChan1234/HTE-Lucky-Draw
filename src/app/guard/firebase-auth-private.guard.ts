import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class FirebaseAuthPrivateGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.authService
            .getUserInfo()
            .then((user) => {
                if (
                    state.url === '/register' ||
                    state.url === '/login' ||
                    state.url === '/'
                )
                    return user === null ? true : this.router.parseUrl('/main');
                return user === null ? this.router.parseUrl('/login') : true;
            })
            .catch((error) => {
                console.error(error);
                return this.router.parseUrl('/login');
            });
    }
}
