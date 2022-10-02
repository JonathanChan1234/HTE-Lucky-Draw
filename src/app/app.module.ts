import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import {
    connectFirestoreEmulator,
    getFirestore,
    provideFirestore,
} from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QRCodeModule } from 'angularx-qrcode';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { extModules } from './build-specific';
import { CreateDrawDialogComponent } from './draw/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from './draw/delete-draw-dialog/delete-draw-dialog.component';
import { DrawSettingComponent } from './draw/draw-setting/draw-setting.component';
import { DrawSideNavBarComponent } from './draw/draw-side-nav-bar/draw-side-nav-bar.component';
import { DrawEffects } from './draw/draw.effect';
import { drawReducer } from './draw/draw.reducer';
import { LuckyDrawAppComponent } from './draw/lucky-draw-app/lucky-draw-app.component';
import { LuckyDrawHomeComponent } from './draw/lucky-draw-home/lucky-draw-home.component';
import { LuckyDrawToolbarComponent } from './draw/lucky-draw-toolbar/lucky-draw-toolbar.component';
import { QrCodeComponent } from './draw/qr-code/qr-code.component';
import { httpInterceptorProviders } from './http-interceptor';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './pages/login/login.component';
import { ParticipantSignInComponent } from './pages/participant-sign-in/participant-sign-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LuckyDrawHomeComponent,
        RegisterComponent,
        CreateDrawDialogComponent,
        LuckyDrawToolbarComponent,
        DeleteDrawDialogComponent,
        DrawSettingComponent,
        LuckyDrawAppComponent,
        DrawSideNavBarComponent,
        ChangePasswordComponent,
        ParticipantSignInComponent,
        QrCodeComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.useEmulators)
                connectFirestoreEmulator(firestore, 'localhost', 8080);
            return firestore;
        }),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        provideStorage(() => getStorage()),
        MatSlideToggleModule,
        MatSnackBarModule,
        MatDialogModule,
        MatChipsModule,
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatCardModule,
        MatSelectModule,
        MatTooltipModule,
        QRCodeModule,
        StoreModule.forRoot({ draw: drawReducer }),
        EffectsModule.forRoot([DrawEffects]),
        extModules,
    ],
    providers: [
        { provide: PERSISTENCE, useValue: 'local' },
        httpInterceptorProviders,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
