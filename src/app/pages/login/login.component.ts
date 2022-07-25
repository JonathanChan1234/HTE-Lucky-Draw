import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    loading = false;

    constructor(private router: Router, private authService: AuthService) {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {}

    submitForm() {
        if (this.formGroup.invalid) return;

        const { email, password } = this.formGroup.value;
        if (email === null || password === null) return;

        this.loading = true;
        this.loginErr = '';
        this.authService.signIn(email, password).subscribe({
            next: () => this.router.navigate(['main']),
            error: (error) => (this.loginErr = error.message),
            complete: () => (this.loading = false),
        });
    }

    navigateToRegisterPage() {
        this.router.navigate(['register']);
    }
}
