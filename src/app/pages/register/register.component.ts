import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    formGroup: FormGroup;
    confirmPwdErr = '';
    registerErr = '';
    loading$: Observable<boolean> = of(false);
    error$: Observable<Error | boolean> = of(false);

    constructor(
        formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.formGroup = formBuilder.group({
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
        });
    }

    ngOnInit(): void {
        this.formGroup.valueChanges.subscribe(({ confirmPassword }) => {
            if (confirmPassword === '') return;
            if (this.formGroup.value.password !== confirmPassword) {
                this.confirmPwdErr = 'Passwords do not match';
            } else {
                this.confirmPwdErr = '';
            }
        });
    }

    navigateToLoginPage() {
        this.router.navigate(['login']);
    }

    submitForm() {
        if (!this.formGroup.valid) return;
        const { email, password } = this.formGroup.value;
        const request$ = this.authService.register(email, password);
        request$.subscribe(() => this.router.navigate(['main']));
        this.loading$ = request$.pipe(
            startWith(true),
            catchError(() => of(false)),
            map(() => false)
        );
        this.error$ = request$.pipe(
            startWith(true),
            catchError((error) => of(error)),
            map(() => false)
        );
    }
}
