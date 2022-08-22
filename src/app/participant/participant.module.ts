import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { UtilsModule } from '../utils/utils.module';
import { DrawParticipantsComponent } from './draw-participants/draw-participants.component';
import { ParticipantDeleteDialogComponent } from './participant-delete-dialog/participant-delete-dialog.component';
import { ParticipantDetailsDialogComponent } from './participant-details-dialog/participant-details-dialog.component';
import { ParticipantEditDialogComponent } from './participant-edit-dialog/participant-edit-dialog.component';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { ParticipantPaginatorComponent } from './participant-paginator/participant-paginator.component';
import { ParticipantRoutingModule } from './participant-routing.module';
import { ParticipantSearchBarComponent } from './participant-search-bar/participant-search-bar.component';
import { ParticipantEffects } from './participant.effect';
import {
    participantFeatureKey,
    participantReducer,
} from './participant.reducer';
import { ParticipantCreateDialogComponent } from './participant-create-dialog/participant-create-dialog.component';

@NgModule({
    declarations: [
        DrawParticipantsComponent,
        ParticipantListComponent,
        ParticipantPaginatorComponent,
        ParticipantSearchBarComponent,
        ParticipantDetailsDialogComponent,
        ParticipantDeleteDialogComponent,
        ParticipantEditDialogComponent,
        ParticipantCreateDialogComponent,
    ],
    imports: [
        CommonModule,
        UtilsModule,
        ReactiveFormsModule,
        FormsModule,
        ParticipantRoutingModule,
        StoreModule.forFeature(participantFeatureKey, participantReducer),
        EffectsModule.forFeature([ParticipantEffects]),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
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
        MatCheckboxModule,
    ],
})
export class ParticipantModule {}
