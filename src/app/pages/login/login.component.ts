import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup: FormGroup;
    loginErr = '';

    constructor(
        formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {}

    async submitForm() {
        if (!this.formGroup.valid) return;
        const { email, password } = this.formGroup.value;
        try {
            await this.authService.signIn(email, password);
            this.router.navigate(['main']);
        } catch (error) {
            this.loginErr = (error as Error).message;
        }
    }

    navigateToRegisterPage() {
        this.router.navigate(['register']);
    }
}
