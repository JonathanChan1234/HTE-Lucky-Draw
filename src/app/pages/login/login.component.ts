import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder, private auth: Auth) {
        this.formGroup = formBuilder.group({
            login: ['', [Validators.required, Validators.email]],
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

    ngOnInit(): void {}

    submitForm() {}
}
