import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

const PasswordValidator: ValidatorFn = (fg) => {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return confirmPassword !== null && password === confirmPassword
        ? null
        : {
              password: 'Not Identical to Confirm Password',
              confirmPassword: 'Not Identical to Password',
          };
};

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    formGroup: FormGroup;
    confirmPwdErr = '';
    registerErr = '';
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.formGroup = formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^(?=.*\d)(?=.*[a-zA-z]).{8,30}$/),
                    ],
                ],
                confirmPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^(?=.*\d)(?=.*[a-zA-z]).{8,30}$/),
                    ],
                ],
            },
            { validator: PasswordValidator }
        );
    }

    ngOnInit(): void {}

    navigateToLoginPage() {
        this.router.navigate(['login']);
    }

    submitForm() {
        if (!this.formGroup.valid) return;
        const { email, password } = this.formGroup.value;
        this.loading = true;
        this.registerErr = '';
        this.authService.register(email, password).subscribe({
            next: () => this.router.navigate(['main']),
            error: (error) => (this.registerErr = error.message),
            complete: () => (this.loading = false),
        });
    }
}
