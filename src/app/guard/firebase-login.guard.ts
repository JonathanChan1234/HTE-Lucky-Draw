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
export class FirebaseLoginGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.checkLoginInfo();
    }

    checkLoginInfo() {
        if (this.authService.getUserInfo()) return true;
        return this.router.parseUrl('login');
    }
}
