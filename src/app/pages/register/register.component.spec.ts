import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { cold } from 'jasmine-marbles';
import { AuthService } from 'src/app/service/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let loader: HarnessLoader;
    let debugElement: DebugElement;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyAuthService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        spyRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        spyAuthService = jasmine.createSpyObj<AuthService>('authService', [
            'register',
        ]);
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: Router, useValue: spyRouter },
                { provide: AuthService, useValue: spyAuthService },
                { provide: FormBuilder, useValue: new FormBuilder() },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        fixture.detectChanges();
    });

    it('validation test', async () => {
        expect(component).toBeTruthy();
        const cold$ = cold('--#|', null, new Error('test error'));
        const register = spyAuthService.register.and.returnValue(cold$);

        const emailField = await loader.getHarness(
            MatInputHarness.with({ selector: '.email-form-field' })
        );
        const passwordField = await loader.getHarness(
            MatInputHarness.with({ selector: '.password-form-field' })
        );
        const confirmPasswordField = await loader.getHarness(
            MatInputHarness.with({ selector: '.confirm-password-form-field' })
        );
        const submitButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.register-btn' })
        );

        // correct email and password
        await emailField.setValue('test@gmail.com');
        await passwordField.setValue('password1');
        await confirmPasswordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeFalse();

        // password and confirm password not matching
        await emailField.setValue('test@gmail.com');
        await passwordField.setValue('password12');
        await confirmPasswordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        await emailField.setValue('test@gmail.com');
        await passwordField.setValue('password1');
        await confirmPasswordField.setValue('password12');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // wrong email format
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue('password1');
        await confirmPasswordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // password does not numeric
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue('password');
        await confirmPasswordField.setValue('password');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // password does not numeric
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue('12345678');
        await confirmPasswordField.setValue('12345678');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // length of password less than 8
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue('test123');
        await confirmPasswordField.setValue('test123');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // length of password greater than 30
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue(
            'a0123456789a0123456789a0123456789a0123456789'
        );
        await confirmPasswordField.setValue(
            'a0123456789a0123456789a0123456789a0123456789'
        );
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();
    });
});
