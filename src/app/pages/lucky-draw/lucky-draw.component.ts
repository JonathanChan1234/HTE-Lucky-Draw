import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-lucky-draw',
    templateUrl: './lucky-draw.component.html',
    styleUrls: ['./lucky-draw.component.scss'],
})
export class LuckyDrawComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {}

    async signOut() {
        try {
            await this.authService.signOut();
            this.router.navigate(['login']);
        } catch (error) {
            alert(error);
        }
    }
}
