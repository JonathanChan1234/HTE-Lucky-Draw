import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { Participant } from '../participant';
import { ParticipantDbService } from '../participant-db.service';

@Component({
    selector: 'app-participant-delete-dialog',
    templateUrl: './participant-delete-dialog.component.html',
})
export class ParticipantDeleteDialogComponent implements OnInit {
    loading = false;
    errMsg = '';
    drawId = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public participant: Participant,
        private route: ActivatedRoute,
        private readonly participantDbService: ParticipantDbService,
        private dialogRef: MatDialogRef<ParticipantDeleteDialogComponent>
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (!params['drawId']) return;
            this.drawId = params['drawId'];
        });
    }

    deleteParticipant() {
        if (!this.drawId) {
            this.errMsg = 'Please select a draw before performing this action';
            return;
        }

        this.loading = true;
        from(
            this.participantDbService.deleteParticipant(
                this.drawId,
                this.participant.id
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
