import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Participant } from '../participant';
import { ParticipantDeleteDialogComponent } from '../participant-delete-dialog/participant-delete-dialog.component';
import { ParticipantDetailsDialogComponent } from '../participant-details-dialog/participant-details-dialog.component';
import { ParticipantEditDialogComponent } from '../participant-edit-dialog/participant-edit-dialog.component';
import { ParticipantAction } from '../participant.action';
import {
    selectError,
    selectLoading,
    selectPageOption,
    selectParticipant,
} from '../participant.selector';

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit, OnDestroy {
    isSmallScreen$!: Observable<boolean>;
    loading$!: Observable<boolean>;
    participants$!: Observable<Participant[]>;
    error$!: Observable<string | null>;

    participantSubscription!: Subscription;
    refresh$ = new BehaviorSubject<boolean>(true);

    constructor(
        private screenSizeService: ScreenSizeService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.participants$ = this.store.select(selectParticipant);
        this.loading$ = this.store.select(selectLoading);
        this.error$ = this.store.select(selectError);

        this.participantSubscription = combineLatest([
            this.route.params,
            this.store.select(selectPageOption),
            this.refresh$,
        ]).subscribe(([params]) => {
            if (!params['drawId']) return;
            this.store.dispatch(
                ParticipantAction.loadParticipant({ drawId: params['drawId'] })
            );
        });
    }

    openEditDialog(participant: Participant): void {
        this.matDialog.open(ParticipantEditDialogComponent, {
            data: participant,
            // disableClose: true,
        });
    }

    openDetailsDialog(participant: Participant): void {
        this.matDialog.open(ParticipantDetailsDialogComponent, {
            data: participant,
        });
    }

    openDeleteDialog(participant: Participant): void {
        const dialogRef = this.matDialog.open(
            ParticipantDeleteDialogComponent,
            {
                disableClose: true,
                data: participant,
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.refresh$.next(true);
        });
    }

    ngOnDestroy(): void {
        this.participantSubscription.unsubscribe();
        this.refresh$.complete();
    }
}
