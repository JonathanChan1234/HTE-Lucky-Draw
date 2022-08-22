import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { ParticipantDbService } from '../participant-db.service';
import { ParticipantDialogData } from '../participant-list/participant-list.component';

@Component({
    selector: 'app-participant-delete-dialog',
    templateUrl: './participant-delete-dialog.component.html',
})
export class ParticipantDeleteDialogComponent {
    loading = false;
    errMsg = '';

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public dialogData: ParticipantDialogData,
        private readonly participantDbService: ParticipantDbService,
        private dialogRef: MatDialogRef<ParticipantDeleteDialogComponent>
    ) {}

    deleteParticipant() {
        this.loading = true;
        from(
            this.participantDbService.deleteParticipant(
                this.dialogData.drawId,
                this.dialogData.participant.id
            )
        ).subscribe({
            next: () => {
                this.loading = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                this.loading = false;
                this.errMsg = error.message;
            },
        });
    }
}
