import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-lucky-draw-toolbar',
    templateUrl: './lucky-draw-toolbar.component.html',
    styleUrls: ['./lucky-draw-toolbar.component.scss'],
})
export class LuckyDrawToolbarComponent implements OnInit {
    user$!: Subject<User | null>;
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.user$ = this.authService.user$;
    }

    signOut(): void {
        this.authService
            .signOut()
            .subscribe(() => this.router.navigate(['login']));
    }
}
