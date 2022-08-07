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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateDrawDialogComponent } from './components/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from './components/delete-draw-dialog/delete-draw-dialog.component';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { ErrorMessageBarComponent } from './components/error-message-bar/error-message-bar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LuckyDrawToolbarComponent } from './components/lucky-draw-toolbar/lucky-draw-toolbar.component';
import { DrawSettingComponent } from './pages/draw-setting/draw-setting.component';
import { LoginComponent } from './pages/login/login.component';
import { LuckyDrawComponent } from './pages/lucky-draw/lucky-draw.component';
import { RegisterComponent } from './pages/register/register.component';
import { DrawParticipantsComponent } from './participant/draw-participants/draw-participants.component';
import { ParticipantListComponent } from './participant/participant-list/participant-list.component';
import { ParticipantPaginatorComponent } from './participant/participant-paginator/participant-paginator.component';
import { ParticipantSearchBarComponent } from './participant/participant-search-bar/participant-search-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LuckyDrawComponent,
        RegisterComponent,
        ErrorMessageBarComponent,
        CreateDrawDialogComponent,
        LuckyDrawToolbarComponent,
        DeleteDrawDialogComponent,
        DrawSettingComponent,
        LoadingSpinnerComponent,
        EmptyListComponent,
        DrawParticipantsComponent,
        ParticipantListComponent,
        ParticipantSearchBarComponent,
        ParticipantPaginatorComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
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
        MatPaginatorModule,
    ],
    providers: [{ provide: PERSISTENCE, useValue: 'local' }],
    bootstrap: [AppComponent],
})
export class AppModule {}
