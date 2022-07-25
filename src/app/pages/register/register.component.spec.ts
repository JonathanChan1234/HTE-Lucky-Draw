import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';

import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { AuthService } from 'src/app/service/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let loader: HarnessLoader;
    let debugElement: DebugElement;

    // Spy
    let spyRouter: jasmine.SpyObj<Router>;
    let spyAuthService: jasmine.SpyObj<AuthService>;

    // Harnesses and Elements
    let emailField: MatInputHarness;
    let passwordField: MatInputHarness;
    let confirmPasswordField: MatInputHarness;

    let submitButton: MatButtonHarness;

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
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        emailField = await loader.getHarness(
            MatInputHarness.with({ selector: '.email-form-field' })
        );
        passwordField = await loader.getHarness(
            MatInputHarness.with({ selector: '.password-form-field' })
        );
        confirmPasswordField = await loader.getHarness(
            MatInputHarness.with({ selector: '.confirm-password-form-field' })
        );
        submitButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.register-btn' })
        );
        fixture.detectChanges();
    });

    const getErrMsgBar = () => {
        return debugElement.query(By.css('.err-msg-bar'));
    };

    it('validation test', async () => {
        // valid email and password
        await emailField.setValue('test@gmail.com');
        await passwordField.setValue('password1');
        await confirmPasswordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeFalse();

        // invalid email
        await emailField.setValue('testgmail.com');
        await passwordField.setValue('password1');
        await confirmPasswordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

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

        // password does not contain number
        await emailField.setValue('test.gmail.com');
        await passwordField.setValue('password');
        await confirmPasswordField.setValue('password');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // password does not contain alphabet
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

    it('should show err msg', async () => {
        const errMsg = 'test error';
        const cold$ = cold('--#|', null, new Error(errMsg));
        const register = spyAuthService.register.and.returnValue(cold$);
        const navigate = spyRouter.navigate.and.returnValue(
            new Promise((res) => res(true))
        );

        const email = 'test@gmail.com';
        const password = 'password1';

        await emailField.setValue(email);
        await passwordField.setValue(password);
        await confirmPasswordField.setValue(password);
        await submitButton.click();
        fixture.detectChanges();

        // loading
        expect(register).toHaveBeenCalledWith(email, password);
        expect(component.loading).toBeTrue();
        expect(await submitButton.isDisabled()).toBeTrue();

        // Error
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(component.registerErr).toBe(errMsg);
        expect(getErrMsgBar()).toBeTruthy();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('should navigate to main when success', async () => {
        const res$ = cold('--x|', { x: 'test' });
        const register = spyAuthService.register.and.returnValue(res$);
        const navigate = spyRouter.navigate.and.returnValue(
            new Promise((res) => res(true))
        );

        const email = 'test@gmail.com';
        const password = 'password1';

        await emailField.setValue(email);
        await passwordField.setValue(password);
        await confirmPasswordField.setValue(password);
        await submitButton.click();
        fixture.detectChanges();

        // loading
        expect(register).toHaveBeenCalledWith(email, password);
        expect(component.loading).toBeTrue();
        expect(await submitButton.isDisabled()).toBeTrue();

        // Error
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(component.registerErr).toBe('');
        expect(getErrMsgBar()).toBeNull();
        expect(navigate).toHaveBeenCalled();
    });
});
