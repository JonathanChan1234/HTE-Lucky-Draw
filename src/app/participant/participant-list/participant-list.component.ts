import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Participant } from '../participant';
import { ParticipantDeleteDialogComponent } from '../participant-delete-dialog/participant-delete-dialog.component';
import { ParticipantDetailsDialogComponent } from '../participant-details-dialog/participant-details-dialog.component';
import { ParticipantEditDialogComponent } from '../participant-edit-dialog/participant-edit-dialog.component';
import { ParticipantAction } from '../participant.action';
import { ParticipantSelector } from '../participant.selector';

export interface ParticipantDialogData {
    participant: Participant;
    drawId: string;
}

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
    isSmallScreen$!: Observable<boolean>;
    loading$!: Observable<boolean>;
    participants$!: Observable<Participant[]>;
    error$!: Observable<string | null>;

    constructor(
        private screenSizeService: ScreenSizeService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.participants$ = this.store.select(
            ParticipantSelector.selectParticipant
        );
        this.loading$ = this.store.select(ParticipantSelector.selectLoading);
        this.error$ = this.store.select(ParticipantSelector.selectError);
        this.store.dispatch(ParticipantAction.loadParticipant());
    }

    openEditDialog(participant: Participant): void {
        const drawId = this.route.snapshot.params['drawId'];
        if (!drawId) return;
        const dialogRef = this.matDialog.open(ParticipantEditDialogComponent, {
            data: { participant, drawId },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.store.dispatch(ParticipantAction.loadParticipant());
        });
    }

    openDetailsDialog(participant: Participant): void {
        this.matDialog.open(ParticipantDetailsDialogComponent, {
            data: participant,
        });
    }

    openDeleteDialog(participant: Participant): void {
        const drawId = this.route.snapshot.params['drawId'];
        if (!drawId) return;
        const dialogRef = this.matDialog.open(
            ParticipantDeleteDialogComponent,
            {
                data: { participant, drawId },
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.store.dispatch(ParticipantAction.loadParticipant());
        });
    }
}
