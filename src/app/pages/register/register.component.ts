import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    constructor(formBuilder: FormBuilder, private authService: AuthService) {
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
            }
        });
    }

    async submitForm() {
        if (!this.formGroup.valid) return;
        const { email, password } = this.formGroup.value;
        await this.authService.register(email, password);
    }
}
