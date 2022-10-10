import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { downloadFile } from 'src/app/utility/download';
import { ImportParticipantsDialogComponent } from '../import-participants-dialog/import-participants-dialog.component';
import { ParticipantCreateDialogComponent } from '../participant-create-dialog/participant-create-dialog.component';
import { ParticipantAction } from '../participant.action';

@Component({
    selector: 'app-draw-participants',
    templateUrl: './draw-participants.component.html',
    styleUrls: ['./draw-participants.component.scss'],
})
export class DrawParticipantsComponent implements OnInit {
    drawId!: string | null;
    isSmallScreen$!: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        private screenSizeService: ScreenSizeService,
        private matDialog: MatDialog,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.drawId = this.route.snapshot.paramMap.get('drawId');
    }

    openCreateDialog() {
        if (!this.drawId) return;
        const matDialogRef = this.matDialog.open(
            ParticipantCreateDialogComponent,
            {
                data: this.drawId,
                disableClose: true,
            }
        );
        matDialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.store.dispatch(ParticipantAction.loadParticipant());
        });
    }

    openImportDialog() {
        if (!this.drawId) return;
        const matDialogRef = this.matDialog.open(
            ImportParticipantsDialogComponent,
            {
                data: this.drawId,
                disableClose: true,
            }
        );
        matDialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.store.dispatch(ParticipantAction.loadParticipant());
        });
    }

    downloadTemplateFile(): void {
        downloadFile('./assets/participant.csv', 'participant_template');
    }
}
