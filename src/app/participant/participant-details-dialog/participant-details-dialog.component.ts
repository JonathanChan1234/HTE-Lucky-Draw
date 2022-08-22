import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { convertDateToDateString } from 'src/app/utility/date';
import { Participant } from '../participant';

@Component({
    selector: 'app-participant-details-dialog',
    templateUrl: './participant-details-dialog.component.html',
})
export class ParticipantDetailsDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public participant: Participant,
        public dialogRef: MatDialogRef<ParticipantDetailsDialogComponent>
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    signedInDate(): string {
        if (!this.participant.signedInAt) return '';
        return convertDateToDateString(this.participant.signedInAt.toDate());
    }
}
