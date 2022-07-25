import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-authenticating',
    templateUrl: './authenticating.component.html',
    styleUrls: ['./authenticating.component.scss'],
})
export class AuthenticatingComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authService.getUserInfo().then((user) => {
            if (user === null) return this.router.navigate(['login']);
            return this.router.navigate(['main']);
        });
    }
}
