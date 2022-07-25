import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorMessageBarComponent } from './components/error-message-bar/error-message-bar.component';
import { LoginComponent } from './pages/login/login.component';
import { LuckyDrawComponent } from './pages/lucky-draw/lucky-draw.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LuckyDrawComponent,
        RegisterComponent,
        ErrorMessageBarComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        provideStorage(() => getStorage()),
        BrowserAnimationsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
