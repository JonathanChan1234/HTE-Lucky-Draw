import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
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
import { CreateDrawDialogComponent } from './components/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from './components/delete-draw-dialog/delete-draw-dialog.component';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { LuckyDrawToolbarComponent } from './components/lucky-draw-toolbar/lucky-draw-toolbar.component';
import { DrawSettingComponent } from './pages/draw-setting/draw-setting.component';
import { LoginComponent } from './pages/login/login.component';
import { LuckyDrawComponent } from './pages/lucky-draw/lucky-draw.component';
import { RegisterComponent } from './pages/register/register.component';
import { UtilsModule } from './utils/utils.module';

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
        EmptyListComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        UtilsModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
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
