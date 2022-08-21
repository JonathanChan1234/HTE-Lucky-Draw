import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Participant } from '../participant';
import { ParticipantDetailsComponent } from '../participant-details/participant-details.component';
import {
    selectError,
    selectLoading,
    selectParticipant,
} from '../participant.selector';

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
        private matDialog: MatDialog,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.participants$ = this.store.select(selectParticipant);
        this.loading$ = this.store.select(selectLoading);
        this.error$ = this.store.select(selectError);
    }

    openDetailsDialog(participant: Participant): void {
        this.matDialog.open(ParticipantDetailsComponent, {
            data: { participant },
        });
    }
}
