import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { extModules } from './build-specific';
import { CreateDrawDialogComponent } from './draw/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from './draw/delete-draw-dialog/delete-draw-dialog.component';
import { DrawSettingComponent } from './draw/draw-setting/draw-setting.component';
import { LuckyDrawToolbarComponent } from './draw/lucky-draw-toolbar/lucky-draw-toolbar.component';
import { LuckyDrawComponent } from './draw/lucky-draw/lucky-draw.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LuckyDrawComponent,
        RegisterComponent,
        CreateDrawDialogComponent,
        LuckyDrawToolbarComponent,
        DeleteDrawDialogComponent,
        DrawSettingComponent,
    ],
    imports: [
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
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        extModules,
    ],
    providers: [{ provide: PERSISTENCE, useValue: 'local' }],
    bootstrap: [AppComponent],
})
export class AppModule {}
