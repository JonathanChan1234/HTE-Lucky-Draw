import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

const PasswordValidator: ValidatorFn = (fg) => {
    const password = fg.get('newPassword')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
        ? null
        : {
              password: 'Not Identical to Confirm Password',
              confirmPassword: 'Not Identical to Password',
          };
};

class ConfirmPasswordErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {
        return !!(control?.parent?.invalid && control?.touched);
    }
}

interface ChangePasswordForm {
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    formGroup: FormGroup<ChangePasswordForm>;
    err = '';
    loading = false;
    confirmPasswordErrorMatcher: ConfirmPasswordErrorMatcher;

    constructor(private router: Router, private authService: AuthService) {
        this.confirmPasswordErrorMatcher = new ConfirmPasswordErrorMatcher();
        this.formGroup = new FormGroup(
            {
                oldPassword: new FormControl('', {
                    validators: [Validators.required],
                    nonNullable: true,
                }),
                newPassword: new FormControl('', {
                    validators: [
                        Validators.required,
                        Validators.pattern(/^(?=.*\d)(?=.*[a-zA-z]).{8,30}$/),
                    ],
                    nonNullable: true,
                }),
                confirmPassword: new FormControl('', {
                    validators: [Validators.required],
                    nonNullable: true,
                }),
            },
            { validators: PasswordValidator }
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    changePassword(): void {
        console.log('change password');
        if (this.formGroup.invalid) return;
        const { oldPassword, newPassword } = this.formGroup.value;
        if (!oldPassword || !newPassword) return;
        this.loading = true;
        from(
            this.authService.changePassword(oldPassword, newPassword)
        ).subscribe({
            next: () => {
                this.loading = false;
                alert('Change Password Successfully');
            },
            error: (error) => {
                this.loading = false;
                this.err = error.message;
            },
        });
    }

    back(): void {
        this.router.navigate(['home']);
    }
}
