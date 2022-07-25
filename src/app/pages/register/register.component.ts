import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgForm,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

const PasswordValidator: ValidatorFn = (fg) => {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
        ? null
        : {
              password: 'Not Identical to Confirm Password',
              confirmPassword: 'Not Identical to Password',
          };
};

class ConfirmPasswordErrorMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        _form: FormGroupDirective | NgForm | null
    ): boolean {
        return !!(control?.parent?.invalid && control?.touched);
    }
}

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
    confirmPasswordErrorMatcher: ConfirmPasswordErrorMatcher;

    constructor(private router: Router, private authService: AuthService) {
        this.confirmPasswordErrorMatcher = new ConfirmPasswordErrorMatcher();
        this.formGroup = new FormGroup(
            {
                email: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.pattern(/^(?=.*\d)(?=.*[a-zA-z]).{8,30}$/),
                ]),
                confirmPassword: new FormControl('', [Validators.required]),
            },
            { validators: PasswordValidator }
        );
    }

    ngOnInit(): void {}

    navigateToLoginPage() {
        this.router.navigate(['login']);
    }

    register() {
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
