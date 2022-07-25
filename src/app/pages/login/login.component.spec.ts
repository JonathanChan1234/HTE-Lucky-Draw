import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let loader: HarnessLoader;
    let debugElement: DebugElement;

    // Spy
    let spyRouter: jasmine.SpyObj<Router>;
    let spyAuthService: jasmine.SpyObj<AuthService>;

    // Harness
    let emailField: MatInputHarness;
    let passwordField: MatInputHarness;
    let submitButton: MatButtonHarness;

    beforeEach(async () => {
        spyRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        spyAuthService = jasmine.createSpyObj<AuthService>('authService', [
            'signIn',
        ]);
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
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

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        debugElement = fixture.debugElement;

        emailField = await loader.getHarness(
            MatInputHarness.with({ selector: '.email-input' })
        );
        passwordField = await loader.getHarness(
            MatInputHarness.with({ selector: '.password-input' })
        );
        submitButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.submit-button' })
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
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeFalse();

        // invalid email
        await emailField.setValue('testgmail.com');
        await passwordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // empty email
        await emailField.setValue('');
        await passwordField.setValue('password1');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();

        // empty password
        await emailField.setValue('test@gmail.com');
        await passwordField.setValue('');
        fixture.detectChanges();
        expect(await submitButton.isDisabled()).toBeTrue();
    });

    it('should show error message', async () => {
        const errMsg = 'test error';
        const cold$ = cold('--#|', null, new Error(errMsg));
        const signIn = spyAuthService.signIn.and.returnValue(cold$);
        const navigate = spyRouter.navigate.and.returnValue(
            new Promise((res) => res(true))
        );

        const email = 'test@gmail.com';
        const password = 'password1';

        await emailField.setValue(email);
        await passwordField.setValue(password);
        await submitButton.click();
        fixture.detectChanges();

        // loading
        expect(signIn).toHaveBeenCalledWith(email, password);
        expect(component.loading).toBeTrue();
        expect(await submitButton.isDisabled()).toBeTrue();

        // Error
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(component.loginErr).toBe(errMsg);
        expect(getErrMsgBar()).toBeTruthy();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('should navigate for success login', async () => {
        const res$ = cold('--x|', { x: 'test' });
        const signIn = spyAuthService.signIn.and.returnValue(res$);
        const navigate = spyRouter.navigate.and.returnValue(
            new Promise((res) => res(true))
        );

        const email = 'test@gmail.com';
        const password = 'password1';

        await emailField.setValue(email);
        await passwordField.setValue(password);
        await submitButton.click();
        fixture.detectChanges();

        // loading
        expect(signIn).toHaveBeenCalledWith(email, password);
        expect(component.loading).toBeTrue();
        expect(await submitButton.isDisabled()).toBeTrue();

        // Error
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(component.loginErr).toBe('');
        expect(getErrMsgBar()).toBeNull();
        expect(navigate).toHaveBeenCalled();
    });
});
